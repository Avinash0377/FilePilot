'use client';

import Link from 'next/link';
import { Icons, toolIconMap } from './Icons';
import SimilarTools from './SimilarTools';
import { tools } from '@/lib/tools';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon?: string;
  children: React.ReactNode;
  toolId?: string;
}

// Category color mappings
const categoryColors: Record<string, { bg: string; text: string }> = {
  pdf: { bg: 'from-red-100 to-red-200', text: 'text-red-600' },
  image: { bg: 'from-indigo-100 to-indigo-200', text: 'text-indigo-600' },
  text: { bg: 'from-blue-100 to-blue-200', text: 'text-blue-600' },
  video: { bg: 'from-pink-100 to-pink-200', text: 'text-pink-600' },
  audio: { bg: 'from-amber-100 to-amber-200', text: 'text-amber-600' },
  archive: { bg: 'from-teal-100 to-teal-200', text: 'text-teal-600' },
};

export default function ToolLayout({ title, description, children, toolId }: ToolLayoutProps) {
  // Get SVG icon based on toolId or derive from title
  const derivedToolId = toolId || title.toLowerCase().replace(/\s+/g, '-');
  const iconKey = toolIconMap[derivedToolId] || null;
  const IconComponent = iconKey ? Icons[iconKey] : null;

  // Get category for this tool
  const tool = tools.find(t => t.id === derivedToolId);
  const category = tool?.category || 'pdf';
  const colors = categoryColors[category] || categoryColors.pdf;

  return (
    <div className="min-h-[calc(100vh-200px)] bg-slate-50 bg-gradient-mesh">
      {/* Header - NOT sticky, scrolls with page */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-100 py-4 sm:py-6 md:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb - Mobile Optimized */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-slate-500 hover:text-slate-700 transition-colors mb-3 sm:mb-4 group min-h-[44px] touch-manipulation active:scale-95"
          >
            <Icons.ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to tools</span>
          </Link>

          {/* Title with category color */}
          <div className="flex items-center gap-3 sm:gap-4 fade-up">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${colors.bg} rounded-xl sm:rounded-2xl flex items-center justify-center ${colors.text} shadow-soft icon-pulse flex-shrink-0`}>
              {IconComponent ? (
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <Icons.File className="w-6 h-6 sm:w-7 sm:h-7" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 truncate tracking-tight">{title}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 line-clamp-2">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Main content card with glassmorphism - Mobile Optimized */}
        <div className="glass-card rounded-xl sm:rounded-2xl border border-white/60 p-4 sm:p-6 md:p-8 shadow-soft-lg fade-up fade-up-2">
          {children}
        </div>

        {/* Trust badges - Mobile Optimized */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 fade-up fade-up-3">
          {[
            { icon: Icons.Shield, text: 'Files stay private', color: 'emerald' },
            { icon: Icons.Bolt, text: 'Fast processing', color: 'blue' },
            { icon: Icons.Trash, text: 'Auto-deleted', color: 'purple' },
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/60 backdrop-blur border border-slate-100 shadow-soft min-h-[44px] touch-manipulation">
              <badge.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${badge.color}-500 flex-shrink-0`} />
              <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Similar Tools - Mobile Optimized */}
        <SimilarTools currentTool={derivedToolId} />
      </div>
    </div>
  );
}
