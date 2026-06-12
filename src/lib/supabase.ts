import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

/** Helper: list public URLs from a bucket + optional subfolder */
async function listUrls(
  bucket: string,
  folder: string = '',
  filter: RegExp,
  limit = 200,
): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, { limit, sortBy: { column: 'created_at', order: 'desc' } });
  if (error || !data) return [];
  return data
    .filter(f => filter.test(f.name))
    .map(f => {
      const path = folder ? `${folder}/${f.name}` : f.name;
      return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    });
}

// ─── Bucket: "resume" ─────────────────────────────────────────────────────────
// Short videos about Ruslan — shown on the home / About page
export async function getResumeVideoUrls(): Promise<string[]> {
  return listUrls('resume', '', /\.(mp4|webm|mov|avi)$/i, 20);
}

// ─── Bucket: "arts" ───────────────────────────────────────────────────────────
// AI-generated artworks (images) — shown on the Arts page
export async function getArtsUrls(): Promise<string[]> {
  return listUrls('arts', '', /\.(jpg|jpeg|png|webp|gif|avif)$/i, 300);
}

// ─── Bucket: "videos" ─────────────────────────────────────────────────────────
// Video works / content — shown on the Video page
export async function getVideoUrls(): Promise<string[]> {
  return listUrls('videos', '', /\.(mp4|webm|mov|avi)$/i, 100);
}
