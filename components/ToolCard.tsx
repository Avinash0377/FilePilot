import Link from 'next/link';
import { Icons, toolIconMap } from './Icons';
import { Tool } from '@/lib/tools';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  // Get the SVG icon component based on toolId
  const iconKey = tool.id ? toolIconMap[tool.id] : null;
  const IconComponent = iconKey ? Icons[iconKey] : null;

  return (
    <Link
      href={tool.href}
      className="group block bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 hover:border-brand-800 shadow-soft hover:shadow-dark transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 min-h-[120px] touch-manipulation active:scale-[0.99]"
    >
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* White background with dark border icon */}
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border-2 border-brand-800 text-brand-800 flex items-center justify-center group-hover:bg-brand-800 group-hover:text-white group-hover:shadow-glow transition-all duration-300 group-hover:rotate-3">
          {IconComponent ? (
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <Icons.File className="w-6 h-6 sm:w-7 sm:h-7" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-brand-800 transition-colors mb-1 sm:mb-2">
            {tool.title}
          </h3>
        </div>

        {/* Arrow with animation */}
        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <Icons.ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-800 animate-bounce-subtle" />
        </div>
      </div>

      <p className="text-sm sm:text-base text-slate-600 line-clamp-2 leading-relaxed mb-3 sm:mb-4">
        {tool.description}
      </p>

      {/* Format Badges */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {tool.supportedFormats.slice(0, 3).map((format, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
          >
            {format}
          </span>
        ))}
        {tool.supportedFormats.length > 3 && (
          <span className="text-xs text-slate-400">
            +{tool.supportedFormats.length - 3}
          </span>
        )}
        <span className="text-xs text-slate-500">• {tool.maxFileSize}</span>
      </div>
    </Link>
  );
}
