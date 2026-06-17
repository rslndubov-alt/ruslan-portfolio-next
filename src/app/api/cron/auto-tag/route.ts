import { NextResponse } from 'next/server';
import { supabase as publicSupabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds max for Vercel Hobby

// Helper to delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  try {
    // 1. Security Check
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch existing metadata
    const { data: metaData, error: metaError } = await publicSupabase
      .from('media_meta')
      .select('file_name');

    if (metaError) {
      return NextResponse.json({ error: 'Failed to fetch media_meta' }, { status: 500 });
    }
    const existingNames = new Set(metaData?.map((m) => m.file_name) || []);

    // 3. Helper to get missing files from a bucket
    const getMissingFiles = async (bucket: string, pattern: RegExp) => {
      const { data } = await publicSupabase.storage.from(bucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (!data) return [];
      return data.filter((f) => pattern.test(f.name) && !existingNames.has(f.name));
    };

    // 4. Find what needs processing (Priority: 1 Video -> 1 Audio -> 5 Arts)
    const missingVideos = await getMissingFiles('videos', /\.(mp4|webm|mov|avi)$/i);
    const missingMusic = await getMissingFiles('music', /\.(mp3|wav|ogg|flac|m4a)$/i);
    const missingArts = await getMissingFiles('arts', /\.(jpg|jpeg|png|webp|gif|avif)$/i);

    if (missingVideos.length === 0 && missingMusic.length === 0 && missingArts.length === 0) {
      return NextResponse.json({ message: 'All media is already tagged' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const processed: string[] = [];

    // --- HELPER: Process Big Files via File Manager ---
    const processBigFile = async (bucket: string, file: any, prompt: string, mimeType: string) => {
      const publicUrl = publicSupabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl;
      const res = await fetch(publicUrl);
      const buffer = await res.arrayBuffer();
      
      const tmpPath = path.join(os.tmpdir(), file.name);
      fs.writeFileSync(tmpPath, Buffer.from(buffer));

      let uploadResult;
      try {
        uploadResult = await fileManager.uploadFile(tmpPath, {
          mimeType,
          displayName: file.name,
        });

        // Wait for processing
        let fileState = await fileManager.getFile(uploadResult.file.name);
        while (fileState.state === 'PROCESSING') {
          await delay(2000);
          fileState = await fileManager.getFile(uploadResult.file.name);
        }

        if (fileState.state === 'FAILED') throw new Error('File processing failed in Gemini');

        const result = await model.generateContent([
          prompt,
          { fileData: { fileUri: uploadResult.file.uri, mimeType: uploadResult.file.mimeType } }
        ]);

        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(text);

        const { error } = await adminSupabase.from('media_meta').insert({
          file_name: file.name,
          title_en: aiData.title_en, title_uk: aiData.title_uk, title_ru: aiData.title_ru,
          desc_en: aiData.desc_en, desc_uk: aiData.desc_uk, desc_ru: aiData.desc_ru,
        });

        if (!error) processed.push(file.name);
        else console.error(`Failed to insert ${file.name}:`, error);

      } finally {
        fs.unlinkSync(tmpPath); // Cleanup
        if (uploadResult) {
          try { await fileManager.deleteFile(uploadResult.file.name); } catch(e) {}
        }
      }
    };

    // --- LOGIC ---
    if (missingVideos.length > 0) {
      // 1. Process 1 Video
      const file = missingVideos[0];
      const prompt = `You are an expert film director. Watch this video. Generate a poetic title (max 5 words) and a 1-sentence description (max 15 words) focusing on the visual composition, lighting, and action. Return STRICTLY JSON with: {"title_en": "", "title_uk": "", "title_ru": "", "desc_en": "", "desc_uk": "", "desc_ru": ""}`;
      
      // Attempt to guess mime type from extension
      const ext = path.extname(file.name).toLowerCase();
      let mime = 'video/mp4';
      if (ext === '.webm') mime = 'video/webm';
      else if (ext === '.mov') mime = 'video/quicktime';
      
      await processBigFile('videos', file, prompt, mime);

    } else if (missingMusic.length > 0) {
      // 2. Process 1 Music Track
      const file = missingMusic[0];
      const prompt = `You are an expert music producer. Listen to this track. Generate a cinematic title (max 5 words) and a 1-sentence description (max 15 words) focusing on the genre, mood, rhythm, and instrumentation. Return STRICTLY JSON with: {"title_en": "", "title_uk": "", "title_ru": "", "desc_en": "", "desc_uk": "", "desc_ru": ""}`;
      
      const ext = path.extname(file.name).toLowerCase();
      let mime = 'audio/mp3';
      if (ext === '.wav') mime = 'audio/wav';
      else if (ext === '.ogg') mime = 'audio/ogg';
      else if (ext === '.flac') mime = 'audio/flac';
      
      await processBigFile('music', file, prompt, mime);

    } else {
      // 3. Process up to 5 Arts via InlineData
      const batchToProcess = missingArts.slice(0, 5);
      const prompt = `You are an expert art critic. Analyze this image. Generate a short, poetic title (max 5 words) and a 1-sentence description (max 15 words) that captures the mood and colors. Return STRICTLY JSON with: {"title_en": "", "title_uk": "", "title_ru": "", "desc_en": "", "desc_uk": "", "desc_ru": ""}`;
      
      for (const file of batchToProcess) {
        try {
          const publicUrl = publicSupabase.storage.from('arts').getPublicUrl(file.name).data.publicUrl;
          const imgRes = await fetch(publicUrl);
          const imgBuffer = await imgRes.arrayBuffer();
          
          const result = await model.generateContent([prompt, {
            inlineData: {
              data: Buffer.from(imgBuffer).toString('base64'),
              mimeType: imgRes.headers.get('content-type') || 'image/jpeg',
            },
          }]);
          
          const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
          const aiData = JSON.parse(text);

          const { error } = await adminSupabase.from('media_meta').insert({
            file_name: file.name,
            title_en: aiData.title_en, title_uk: aiData.title_uk, title_ru: aiData.title_ru,
            desc_en: aiData.desc_en, desc_uk: aiData.desc_uk, desc_ru: aiData.desc_ru,
          });

          if (!error) processed.push(file.name);
          else console.error(`Failed to insert ${file.name}:`, error);
        } catch (e) {
          console.error(`Failed to analyze art ${file.name}:`, e);
        }
      }
    }

    return NextResponse.json({ message: 'Batch processing complete', processed_count: processed.length, processed_files: processed });
  } catch (error: any) {
    console.error('Agent Auto-Tag Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
