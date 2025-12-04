'use client';

import Link from 'next/link';
import { Icons, toolIconMap } from './Icons';
import SimilarTools from './SimilarTools';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon?: string;
  children: React.ReactNode;
  toolId?: string;
}

export default function ToolLayout({ title, description, children, toolId }: ToolLayoutProps) {
  // Get SVG icon based on toolId or derive from title
  const derivedToolId = toolId || title.toLowerCase().replace(/\s+/g, '-');
  const iconKey = toolIconMap[derivedToolId] || null;
  const IconComponent = iconKey ? Icons[iconKey] : null;

  return (
    <div className="min-h-[calc(100vh-200px)] bg-slate-50 bg-gradient-mesh">
      {/* Header with glassmorphism */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-100 py-8 sticky top-16 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-4 group"
          >
            <Icons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to tools
          </Link>

          {/* Title */}
          <div className="flex items-center gap-4 fade-up">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 shadow-soft icon-pulse">
              {IconComponent ? (
                <IconComponent className="w-7 h-7" />
              ) : (
                <Icons.File className="w-7 h-7" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content card with glassmorphism */}
        <div className="glass-card rounded-2xl border border-white/60 p-8 shadow-soft-lg fade-up fade-up-2">
          {children}
        </div>

        {/* Trust badges with subtle animation */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 fade-up fade-up-3">
          {[
            { icon: Icons.Shield, text: 'Files stay private', color: 'emerald' },
            { icon: Icons.Bolt, text: 'Fast processing', color: 'blue' },
            { icon: Icons.Trash, text: 'Auto-deleted', color: 'purple' },
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-slate-100 shadow-soft">
              <badge.icon className={`w-4 h-4 text-${badge.color}-500`} />
              <span className="text-sm text-slate-600">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Similar Tools */}
        <SimilarTools currentTool={derivedToolId} />
      </div>
    </div>
  );
}
