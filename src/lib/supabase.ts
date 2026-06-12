import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export async function getArtsUrls(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('arts')
    .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
  if (error || !data) return [];
  return data
    .filter(f => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f.name))
    .map(f => supabase.storage.from('arts').getPublicUrl(f.name).data.publicUrl);
}

export async function getVideoUrls(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('videos')
    .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
  if (error || !data) return [];
  return data
    .filter(f => /\.(mp4|webm|mov|avi)$/i.test(f.name))
    .map(f => supabase.storage.from('videos').getPublicUrl(f.name).data.publicUrl);
}
