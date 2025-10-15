'use client';

import Link from "next/link";
import { Camera } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Portfolio Gallery
            </h1>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/gallery" className="nav-link">
              Gallery
            </Link>
            <Link href="/upload" className="nav-link">
              Upload
            </Link>
            <Link href="/admin" className="btn-primary">
              Admin
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
