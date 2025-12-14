import Link from 'next/link';
import { Icons } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white border-t border-slate-700/50">
      {/* Top Gradient Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="FilePilot Logo"
                className="w-12 h-12 rounded-xl shadow-soft"
              />
              <span className="text-2xl font-bold">FilePilot</span>
            </div>
            <p className="text-slate-400 text-base leading-relaxed mb-4 max-w-md">
              Professional file conversion tools. Free, fast, and secure. Transform your files instantly without compromising privacy.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:sudhimallaavinash07@gmail.com" className="hover:text-brand-400 transition-colors">
                sudhimallaavinash07@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Icons.Home className="w-4 h-4" />
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Icons.Mail className="w-4 h-4" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Icons.Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Tools</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/tools/pdf-to-word" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Icons.PdfToWord className="w-4 h-4" />
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Icons.ImageCompress className="w-4 h-4" />
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Icons.MergePdf className="w-4 h-4" />
                  Merge PDF
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-slate-400">
              © {new Date().getFullYear()} FilePilot. All rights reserved.
            </span>
          </div>

          {/* Owner Signature */}
          <div className="mt-8 pt-6 border-t border-slate-700/30 text-center">
            <p className="text-slate-500 text-sm font-serif italic tracking-wide mb-2">
              Done & Dusted by <span className="text-brand-400 font-semibold">Avinash Sudimalla</span>
            </p>
            <a
              href="mailto:sudhimallaavinash07@gmail.com"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Mail me at sudhimallaavinash07@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
