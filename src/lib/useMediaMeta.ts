import { useState, useEffect } from 'react';
import { getMediaMetadata, MediaMeta } from './supabase';
import { Lang } from './i18n';

export function useMediaMeta() {
  const [metaMap, setMetaMap] = useState<Record<string, MediaMeta>>({});

  useEffect(() => {
    getMediaMetadata().then(data => {
      const map: Record<string, MediaMeta> = {};
      data.forEach(item => {
        map[item.file_name] = item;
      });
      setMetaMap(map);
    });
  }, []);

  const getMeta = (url: string, lang: Lang) => {
    try {
      const parts = url.split('/');
      const fileName = decodeURIComponent(parts[parts.length - 1]);
      const meta = metaMap[fileName];
      
      if (!meta) return null;
      
      const title = meta[`title_${lang}` as keyof MediaMeta] || meta.title_en;
      const desc = meta[`desc_${lang}` as keyof MediaMeta] || meta.desc_en;
      
      return { 
        title: typeof title === 'string' ? title : null, 
        desc: typeof desc === 'string' ? desc : null 
      };
    } catch {
      return null;
    }
  };

  return { metaMap, getMeta };
}
