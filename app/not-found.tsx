// app/not-found.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    Sentry.captureException(new Error(`404 Not Found: ${pathname}`), {
      level: 'warning',
      tags: { path: pathname },
    });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2] px-4">
      <span className="text-[200px] font-serif font-bold leading-none text-stone-200 select-none">
        404
      </span>
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 -mt-8 mb-4">
        Page Not Found
      </h1>
      <p className="text-stone-500 text-lg max-w-md text-center mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="default" size="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
