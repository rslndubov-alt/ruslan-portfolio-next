import React from 'react';
import { cn } from '@/lib/utils';

export function PatternText({
  text = 'Text',
  className,
  ...props
}: Omit<React.ComponentProps<'p'>, 'children'> & { text: string }) {
  return (
    <p
      data-shadow={text}
      className={cn(
        // NO hardcoded text-[10em] — size is fully controlled by className prop
        'relative inline-block font-bold',
        '[text-shadow:0.02em_0.02em_0_var(--background)]',
        'after:absolute after:top-2 after:left-2 after:-z-10 after:content-[attr(data-shadow)]',
        'after:bg-clip-text after:text-transparent after:text-shadow-none',
        'after:bg-[length:0.05em_0.05em] after:bg-[linear-gradient(45deg,transparent_45%,var(--foreground)_45%,var(--foreground)_55%,transparent_0)]',
        'after:animate-shadanim',
        className,
      )}
      {...props}
    >
      {text}
    </p>
  );
}
