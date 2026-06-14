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
const IMG_RE = /\.(jpg|jpeg|png|webp|gif|avif)$/i;

// Dynamically discover subfolders in the arts bucket
export async function getArtsFolders(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('arts')
    .list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) return [];
  // Folders in Supabase have no metadata (null) and id is null
  return data
    .filter(item => item.id === null || item.metadata === null)
    .map(item => item.name)
    .filter(name => !IMG_RE.test(name)); // exclude files, keep only folders
}

// Fetch arts from a specific subfolder (or root)
export async function getArtsByCategory(category: string): Promise<string[]> {
  if (category === 'all' || category === '') {
    return getArtsAllCategories();
  }
  return listUrls('arts', category, IMG_RE, 300);
}

// Fetch ALL arts from root + all discovered subfolders
export async function getArtsAllCategories(): Promise<string[]> {
  const folders = await getArtsFolders();
  const allFolders = ['', ...folders];
  const results = await Promise.all(
    allFolders.map(f => listUrls('arts', f, IMG_RE, 300))
  );
  return results.flat();
}

// Legacy: fetch root only
export async function getArtsUrls(): Promise<string[]> {
  return listUrls('arts', '', IMG_RE, 300);
}

// ─── Bucket: "videos" ─────────────────────────────────────────────────────────
// Video works / content — shown on the Video page
export async function getVideoUrls(): Promise<string[]> {
  return listUrls('videos', '', /\.(mp4|webm|mov|avi)$/i, 100);
}

// ─── Bucket: "music" ──────────────────────────────────────────────────────────
const AUDIO_RE = /\.(mp3|wav|ogg|flac|m4a)$/i;

// Dynamically discover subfolders in the music bucket
export async function getMusicFolders(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('music')
    .list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) return [];
  return data
    .filter(item => item.id === null || item.metadata === null)
    .map(item => item.name)
    .filter(name => !AUDIO_RE.test(name));
}

// Fetch music from a specific subfolder (or all)
export async function getMusicByCategory(category: string): Promise<string[]> {
  if (category === 'all' || category === '') {
    return getMusicAllCategories();
  }
  return listUrls('music', category, AUDIO_RE, 100);
}

// Fetch ALL music from root + all discovered subfolders
export async function getMusicAllCategories(): Promise<string[]> {
  const folders = await getMusicFolders();
  const allFolders = ['', ...folders];
  const results = await Promise.all(
    allFolders.map(f => listUrls('music', f, AUDIO_RE, 100))
  );
  return results.flat();
}

// Legacy: fetch root only
export async function getMusicUrls(): Promise<string[]> {
  return listUrls('music', '', AUDIO_RE, 100);
}
