'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Icons } from './Icons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickToolsOpen, setQuickToolsOpen] = useState(false);

  // Close mobile menu when clicking outside or on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('scroll', handleScroll);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobileMenuOpen]);

  const quickTools = [
    { name: 'PDF to Word', href: '/tools/pdf-to-word', icon: Icons.PdfToWord },
    { name: 'Compress Image', href: '/tools/image-compressor', icon: Icons.ImageCompress },
    { name: 'Merge PDF', href: '/tools/merge-pdf', icon: Icons.MergePdf },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', icon: Icons.WordToPdf },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <img
                src="/logo.png"
                alt="FilePilot Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-soft group-hover:shadow-dark transition-all duration-300"
              />
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
                href="/contact"
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200"
              >
                Privacy
              </Link>
            </div>

            {/* Mobile Menu Button - Larger Touch Target */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[48px] min-h-[48px] p-3 rounded-xl hover:bg-slate-100 transition-colors touch-manipulation active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <Icons.Close className="w-6 h-6 text-slate-700" />
              ) : (
                <Icons.Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Full Screen Slide-in */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel - Slide from Right */}
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="text-lg font-bold text-slate-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[48px] min-h-[48px] p-3 rounded-xl hover:bg-slate-100 transition-colors touch-manipulation active:scale-95"
              >
                <Icons.Close className="w-6 h-6 text-slate-700" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              <Link
                href="/#tools"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all touch-manipulation active:scale-98"
              >
                <Icons.Check className="w-5 h-5 text-brand-600" />
                All Tools
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all touch-manipulation active:scale-98"
              >
                <Icons.Mail className="w-5 h-5 text-brand-600" />
                Contact
              </Link>

              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all touch-manipulation active:scale-98"
              >
                <Icons.Shield className="w-5 h-5 text-brand-600" />
                Privacy
              </Link>

              <div className="pt-4 border-t border-slate-200">
                <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Quick Tools
                </p>

                {quickTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 text-base font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all touch-manipulation active:scale-98"
                  >
                    <tool.icon className="w-5 h-5 text-brand-500" />
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
