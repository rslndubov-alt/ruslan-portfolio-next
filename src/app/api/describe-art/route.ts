import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: 'No imageUrl' }, { status: 400 });

    // Download image and convert to base64
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return NextResponse.json({ title: '', desc: '' });
    
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const base64 = buffer.toString('base64');
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: contentType,
          data: base64,
        }
      },
      {
        text: `You are an art critic for a portfolio website of AI artist Ruslan Dubov. Look at this AI-generated artwork and provide:
1. A short, catchy creative title (3-6 words, no quotes)
2. A brief artistic description (1 sentence, max 20 words)

Respond ONLY in this exact JSON format, nothing else:
{"title":"Your Title Here","desc":"Brief artistic description here"}

Be poetic, evocative and professional. If artwork depicts a character, mention them. If it's abstract or architectural, describe the mood.`
      },
    ]);

    const text = result.response.text().trim();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        title: parsed.title || '',
        desc: parsed.desc || '',
      });
    }

    return NextResponse.json({ title: 'Untitled', desc: '' });
  } catch (err: any) {
    console.error('Describe art error:', err);
    return NextResponse.json({ title: '', desc: '' }, { status: 200 });
  }
}
