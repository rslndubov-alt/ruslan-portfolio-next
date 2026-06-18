import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an AI assistant on Ruslan Dubov's portfolio website.
Ruslan Dubov is a content creator working at the intersection of AI, visual art, and mindful living.
He creates videos, AI artworks, and music using: ChatGPT, Midjourney, Claude, Suno, Google AI, Photoshop, CapCut, Illustrator.
He is active on YouTube (@ruslandubov5532), TikTok (@ruslan.dubov), Instagram (@ruslan.dubov), Facebook (rslndubov), Telegram (@Dubovruslan).
His email: rslndubov@gmail.com.
He also works with adaptogens and mindful living.
For the arts gallery: images are loaded from Supabase storage.
For the video section: videos are loaded from Supabase storage.
Answer questions about Ruslan, his work, his tools, collaborations, and portfolio.
Be concise, friendly and professional. Answer in the same language as the question.
If asked about gallery search, explain you can help filter/describe artworks by topic.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: { role: 'user' | 'model'; text: string }[] };
    if (!messages?.length) return NextResponse.json({ error: 'No messages' }, { status: 400 });

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
    });
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    });

    const lastMessage = messages[messages.length - 1];

    // Retry up to 3 times with backoff for 503/429 errors
    let lastError: any;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await chat.sendMessage(lastMessage.text);
        const text = result.response.text();
        return NextResponse.json({ text });
      } catch (e: any) {
        lastError = e;
        const status = e?.status || 0;
        if ((status === 503 || status === 429) && attempt < 2) {
          await delay(2000 * (attempt + 1)); // 2s, 4s
          continue;
        }
        throw e;
      }
    }

    throw lastError;
  } catch (err: any) {
    console.error('Chat error:', err);
    // User-friendly error messages
    const status = err?.status || 0;
    if (status === 503) {
      return NextResponse.json({ error: 'AI сервер временно перегружен. Попробуйте через несколько секунд.' }, { status: 503 });
    }
    if (status === 429) {
      return NextResponse.json({ error: 'Слишком много запросов. Подождите минуту.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}

