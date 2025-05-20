"use client";

import { ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
