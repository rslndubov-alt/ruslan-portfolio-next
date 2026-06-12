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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: { role: 'user' | 'model'; text: string }[] };
    if (!messages?.length) return NextResponse.json({ error: 'No messages' }, { status: 400 });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const chat = model.startChat({
      systemInstruction: SYSTEM_PROMPT,
      history: messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.text);
    const text = result.response.text();
    return NextResponse.json({ text });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
