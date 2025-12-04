'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icons } from './Icons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickToolsOpen, setQuickToolsOpen] = useState(false);

  const quickTools = [
    { name: 'PDF to Word', href: '/tools/pdf-to-word', icon: Icons.PdfToWord },
    { name: 'Compress Image', href: '/tools/image-compressor', icon: Icons.ImageCompress },
    { name: 'Merge PDF', href: '/tools/merge-pdf', icon: Icons.MergePdf },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', icon: Icons.WordToPdf },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="FilePilot Logo"
              className="w-12 h-12 rounded-xl shadow-soft group-hover:shadow-dark transition-all duration-300"
            />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              FilePilot
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Quick Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickToolsOpen(!quickToolsOpen)}
                onBlur={() => setTimeout(() => setQuickToolsOpen(false), 200)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200"
              >
                <Icons.Bolt className="w-4 h-4" />
                Quick Tools
                <Icons.ChevronRight className={`w-4 h-4 transition-transform ${quickToolsOpen ? 'rotate-90' : ''}`} />
              </button>

              {quickToolsOpen && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-soft-lg border border-slate-200 py-2 animate-scale-in">
                  {quickTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <tool.icon className="w-4 h-4" />
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <Link
              href="/#tools"
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200"
            >
              All Tools
            </Link>
            <Link
              href="/privacy"
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200"
            >
              Privacy
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <Icons.Close className="w-6 h-6 text-slate-700" />
            ) : (
              <Icons.Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
              <Link
                href="/#tools"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all"
              >
                All Tools
              </Link>

              <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Quick Tools
              </div>

              {quickTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all flex items-center gap-2"
                >
                  <tool.icon className="w-4 h-4" />
                  {tool.name}
                </Link>
              ))}

              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all"
              >
                Privacy
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
