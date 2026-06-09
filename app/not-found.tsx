'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
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
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
