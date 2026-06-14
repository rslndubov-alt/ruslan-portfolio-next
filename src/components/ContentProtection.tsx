'use client';
import { useEffect } from 'react';

export default function ContentProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow right-click only on input/textarea
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
    };

    // Disable keyboard shortcuts for copy/save
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S, Ctrl+U, Ctrl+Shift+I (save, view source, devtools)
      if (e.ctrlKey && (e.key === 's' || e.key === 'u')) {
        e.preventDefault();
      }
      // F12 (devtools)
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    // Disable drag on images and videos
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}
