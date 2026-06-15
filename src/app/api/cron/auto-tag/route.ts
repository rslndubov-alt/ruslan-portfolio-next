import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Security Check
    // Secure the cron job with a secret token from Vercel
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // In local dev, we might bypass this or use a query param for testing
    // But in production, we strictly check the Bearer token matching CRON_SECRET
    if (
      process.env.NODE_ENV === 'production' && 
      authHeader !== `Bearer ${cronSecret}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch all public URLs from `arts` bucket
    // For simplicity we check root bucket here. If you have subfolders, 
    // we would use the getArtsFolders() logic.
    const { data: files, error: filesError } = await supabase.storage
      .from('arts')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (filesError || !files) {
      return NextResponse.json({ error: 'Failed to fetch arts' }, { status: 500 });
    }

    // Filter out folders and non-images
    const IMG_RE = /\.(jpg|jpeg|png|webp|gif|avif)$/i;
    const imageFiles = files.filter(f => IMG_RE.test(f.name));

    if (imageFiles.length === 0) {
      return NextResponse.json({ message: 'No images found in arts bucket' });
    }

    // 3. Fetch existing metadata from the database
    const { data: metaData, error: metaError } = await supabase
      .from('media_meta')
      .select('file_name');

    if (metaError) {
      return NextResponse.json({ error: 'Failed to fetch media_meta' }, { status: 500 });
    }

    const existingNames = new Set(metaData?.map(m => m.file_name) || []);

    // 4. Find images that do NOT have metadata yet
    const missingImages = imageFiles.filter(f => !existingNames.has(f.name));

    if (missingImages.length === 0) {
      return NextResponse.json({ message: 'All images are already tagged' });
    }

    // Limit to 5 images per run to avoid timeout/rate limits on Vercel
    const batchToProcess = missingImages.slice(0, 5);
    const processed = [];

    // 5. Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    for (const file of batchToProcess) {
      // Get the public URL to download the image data
      const publicUrl = supabase.storage.from('arts').getPublicUrl(file.name).data.publicUrl;
      
      // Fetch the image as arrayBuffer
      const imgRes = await fetch(publicUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      
      // Prepare for Gemini
      const imagePart = {
        inlineData: {
          data: Buffer.from(imgBuffer).toString('base64'),
          mimeType: imgRes.headers.get('content-type') || 'image/jpeg',
        },
      };

      const prompt = `You are an expert art critic and cinematic storyteller.
Analyze this image. Generate a short, poetic, cinematic title (max 5 words) and a 1-sentence poetic description (max 15 words) that captures the mood, colors, and essence.
Provide the output strictly in valid JSON format with no markdown wrappers, matching this interface:
{
  "title_en": "Title in English",
  "title_uk": "Title in Ukrainian",
  "title_ru": "Title in Russian",
  "desc_en": "Description in English",
  "desc_uk": "Description in Ukrainian",
  "desc_ru": "Description in Russian"
}
Output only JSON.`;

      try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        
        const aiData = JSON.parse(text);

        // 6. Insert into Supabase media_meta
        const insertData = {
          file_name: file.name,
          title_en: aiData.title_en,
          title_uk: aiData.title_uk,
          title_ru: aiData.title_ru,
          desc_en: aiData.desc_en,
          desc_uk: aiData.desc_uk,
          desc_ru: aiData.desc_ru,
        };

        const { error: insertError } = await supabase
          .from('media_meta')
          .insert(insertData);

        if (insertError) {
          console.error(`Failed to insert ${file.name}:`, insertError);
        } else {
          processed.push(file.name);
        }
      } catch (aiError) {
        console.error(`Failed to analyze ${file.name}:`, aiError);
      }
    }

    return NextResponse.json({ 
      message: 'Batch processing complete', 
      processed_count: processed.length,
      processed_files: processed 
    });
  } catch (error: any) {
    console.error('Agent Auto-Tag Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
