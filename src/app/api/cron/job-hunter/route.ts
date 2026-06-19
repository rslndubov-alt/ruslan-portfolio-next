import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Config ──
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET; // optional security

const SKILLS_PROFILE = `
Ruslan Dubov — AI Content Creator & Prompt Engineer.
Core skills: ChatGPT, Midjourney v7, Claude, Google Gemini, Suno AI, Veo 3, Seedance 2.0, 
Nano Banana, Prompt Engineering (8-block CinePrompt architecture), 
AI Video Production, AI Music Production, AI Art Direction,
Photoshop, Illustrator, CapCut, Next.js, React, TypeScript.
Work style: Remote only, freelance or contract.
Languages: English, Russian, Ukrainian.
Looking for: AI content creation, prompt engineering, AI art direction, 
AI video production, creative AI roles, generative AI specialist positions.
`;

const SEARCH_QUERIES = [
  'AI prompt engineer',
  'AI content creator',
  'Midjourney artist',
  'AI video production',
  'generative AI',
  'prompt engineering remote',
  'AI art director',
];

// ── Job Sources ──

interface RawJob {
  id: string;
  title: string;
  company: string;
  url: string;
  description: string;
  salary?: string;
  location?: string;
  source: string;
  date?: string;
}

/** Remotive.com — fully free, no key needed */
async function fetchRemotive(): Promise<RawJob[]> {
  const jobs: RawJob[] = [];
  try {
    const queries = ['artificial-intelligence', 'content', 'design'];
    for (const cat of queries) {
      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${cat}&limit=20`, {
        headers: { 'User-Agent': 'JobHunterBot/1.0' },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const j of data.jobs || []) {
        // Only include recent jobs (last 7 days)
        const pubDate = new Date(j.publication_date);
        const daysAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysAgo > 7) continue;

        jobs.push({
          id: `remotive-${j.id}`,
          title: j.title,
          company: j.company_name || 'Unknown',
          url: j.url,
          description: (j.description || '').replace(/<[^>]*>/g, '').slice(0, 1500),
          salary: j.salary || '',
          location: j.candidate_required_location || 'Remote',
          source: 'Remotive',
          date: j.publication_date,
        });
      }
    }
  } catch (err) {
    console.error('Remotive fetch error:', err);
  }
  return jobs;
}

/** Arbeitnow — free, no key needed, European + remote */
async function fetchArbeitnow(): Promise<RawJob[]> {
  const jobs: RawJob[] = [];
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      headers: { 'User-Agent': 'JobHunterBot/1.0' },
    });
    if (!res.ok) return jobs;
    const data = await res.json();
    
    const aiKeywords = /\b(ai|artificial intelligence|machine learning|prompt|midjourney|generative|content creator|chatgpt|llm|creative technolog)/i;
    
    for (const j of (data.data || []).slice(0, 100)) {
      const text = `${j.title} ${j.description || ''}`;
      if (!aiKeywords.test(text)) continue;
      if (!j.remote) continue; // Only remote

      jobs.push({
        id: `arbeitnow-${j.slug}`,
        title: j.title,
        company: j.company_name || 'Unknown',
        url: j.url,
        description: (j.description || '').replace(/<[^>]*>/g, '').slice(0, 1500),
        location: j.location || 'Remote',
        source: 'Arbeitnow',
        date: j.created_at,
      });
    }
  } catch (err) {
    console.error('Arbeitnow fetch error:', err);
  }
  return jobs;
}

/** HimalayanJobs / free aggregator fallback */
async function fetchHimalaya(): Promise<RawJob[]> {
  const jobs: RawJob[] = [];
  try {
    for (const query of ['ai+prompt+engineer', 'ai+content+creator']) {
      const res = await fetch(`https://himalayas.app/jobs/api?q=${query}&limit=15`, {
        headers: { 'User-Agent': 'JobHunterBot/1.0' },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const j of data.jobs || []) {
        jobs.push({
          id: `himalaya-${j.id}`,
          title: j.title,
          company: j.companyName || 'Unknown',
          url: `https://himalayas.app/jobs/${j.slug}`,
          description: (j.description || '').slice(0, 1500),
          salary: j.salaryCurrency ? `${j.salaryCurrency} ${j.salaryMin}-${j.salaryMax}` : '',
          location: 'Remote',
          source: 'Himalayas',
          date: j.pubDate,
        });
      }
    }
  } catch (err) {
    console.error('Himalayas fetch error:', err);
  }
  return jobs;
}

// ── Gemini Matcher ──
async function scoreJobs(jobs: RawJob[]): Promise<Array<RawJob & { score: number; reason: string }>> {
  if (!GEMINI_KEY || !jobs.length) return [];

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const scored: Array<RawJob & { score: number; reason: string }> = [];

  // Batch jobs in groups of 5 for efficiency
  const batches = [];
  for (let i = 0; i < Math.min(jobs.length, 30); i += 5) {
    batches.push(jobs.slice(i, i + 5));
  }

  for (const batch of batches) {
    const jobsList = batch.map((j, i) => 
      `JOB ${i + 1}:\nTitle: ${j.title}\nCompany: ${j.company}\nLocation: ${j.location}\nSalary: ${j.salary || 'Not specified'}\nDescription: ${j.description.slice(0, 500)}`
    ).join('\n\n---\n\n');

    try {
      const result = await model.generateContent(`You are a job matching AI. Score how well each job matches this candidate profile:

${SKILLS_PROFILE}

Score each job 0-100 based on:
- Tool/skill match (0-30): Does the job require tools the candidate knows?
- Remote compatibility (0-20): Is it remote-friendly?
- Role fit (0-20): Is it a creative/AI content role?
- Salary level (0-15): Is the salary competitive? (assume good if not specified)
- Growth potential (0-15): Can this lead to ongoing work?

Jobs to evaluate:

${jobsList}

Respond ONLY with valid JSON array, nothing else:
[{"index":0,"score":85,"reason":"Short 1-sentence explanation"},...]`);

      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const scores = JSON.parse(jsonMatch[0]);
        for (const s of scores) {
          if (s.index >= 0 && s.index < batch.length) {
            scored.push({
              ...batch[s.index],
              score: s.score || 0,
              reason: s.reason || '',
            });
          }
        }
      }
    } catch (err) {
      console.error('Gemini scoring error:', err);
      // Add unscorable jobs with score 0
      batch.forEach(j => scored.push({ ...j, score: 0, reason: 'Scoring failed' }));
    }
  }

  return scored.sort((a, b) => b.score - a.score);
}

// ── Telegram Sender ──
async function sendToTelegram(jobs: Array<RawJob & { score: number; reason: string }>): Promise<number> {
  if (!BOT_TOKEN || !CHAT_ID) return 0;

  const topJobs = jobs.filter(j => j.score >= 60).slice(0, 5);
  if (!topJobs.length) {
    // Send "no matches" notification once a day at morning run
    const hour = new Date().getUTCHours();
    if (hour >= 4 && hour <= 6) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `🔍 *Job Hunter Report*\n\n📭 Новых подходящих вакансий не найдено.\nСледующий скан через 6 часов.\n\n🕐 _${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kiev' })}_`,
          parse_mode: 'Markdown',
        }),
      });
    }
    return 0;
  }

  // Header message
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: `🎯 *JOB HUNTER — Найдено ${topJobs.length} вакансий!*\n\n🕐 _${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kiev' })}_`,
      parse_mode: 'Markdown',
    }),
  });

  // Send each job
  for (const job of topJobs) {
    const stars = job.score >= 80 ? '🔥🔥🔥' : job.score >= 70 ? '🔥🔥' : '🔥';
    const message = `${stars} *Match: ${job.score}/100*

📌 *${escMd(job.title)}*
🏢 ${escMd(job.company)} · ${escMd(job.source)}
📍 ${escMd(job.location || 'Remote')}
${job.salary ? `💰 ${escMd(job.salary)}` : ''}

💡 _${escMd(job.reason)}_

🔗 [Откликнуться](${job.url})`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    // Small delay between messages
    await new Promise(r => setTimeout(r, 300));
  }

  return topJobs.length;
}

function escMd(s: string): string {
  return (s || '').replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

// ── Deduplication via simple hash ──
const seenJobsKey = 'job-hunter-seen';

// ── Main Handler ──
export async function GET(req: Request) {
  // Optional: verify cron secret
  const authHeader = req.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log('[JobHunter] Starting scan...');

  // 1. Fetch from all sources
  const [remotiveJobs, arbeitnowJobs, himalayaJobs] = await Promise.all([
    fetchRemotive(),
    fetchArbeitnow(),
    fetchHimalaya(),
  ]);

  const allJobs = [...remotiveJobs, ...arbeitnowJobs, ...himalayaJobs];
  console.log(`[JobHunter] Found ${allJobs.length} raw jobs (Remotive: ${remotiveJobs.length}, Arbeitnow: ${arbeitnowJobs.length}, Himalayas: ${himalayaJobs.length})`);

  // 2. Deduplicate by title+company
  const seen = new Set<string>();
  const unique = allJobs.filter(j => {
    const key = `${j.title.toLowerCase().trim()}-${j.company.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`[JobHunter] ${unique.length} unique jobs after dedup`);

  if (!unique.length) {
    return NextResponse.json({ 
      status: 'ok', 
      jobs_found: 0, 
      jobs_sent: 0, 
      duration_ms: Date.now() - startTime 
    });
  }

  // 3. Score with Gemini
  const scored = await scoreJobs(unique);
  console.log(`[JobHunter] Scored ${scored.length} jobs. Top score: ${scored[0]?.score || 0}`);

  // 4. Send top matches to Telegram
  const sentCount = await sendToTelegram(scored);
  console.log(`[JobHunter] Sent ${sentCount} jobs to Telegram`);

  return NextResponse.json({
    status: 'ok',
    jobs_found: allJobs.length,
    unique: unique.length,
    scored: scored.length,
    jobs_sent: sentCount,
    top_3: scored.slice(0, 3).map(j => ({ title: j.title, company: j.company, score: j.score })),
    duration_ms: Date.now() - startTime,
  });
}
