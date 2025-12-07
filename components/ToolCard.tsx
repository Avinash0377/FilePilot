'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

interface ToolCardProps {
  name: string;
  description: string;
  icon: keyof typeof Icons;
  href: string;
  category: string;
  supportedFormats?: string[];
  maxFileSize?: string;
}

export default function ToolCard({
  name,
  description,
  icon: iconName,
  href,
  category,
  supportedFormats,
  maxFileSize
}: ToolCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  // Color mapping based on category
  const getCategoryColors = (cat: string) => {
    const colors: Record<string, string> = {
      pdf: 'from-red-500 to-red-600 text-white',
      image: 'from-violet-500 to-violet-600 text-white',
      text: 'from-blue-500 to-blue-600 text-white',
      video: 'from-pink-500 to-pink-600 text-white',
      audio: 'from-amber-500 to-amber-600 text-white',
      archive: 'from-emerald-500 to-emerald-600 text-white',
      // Default fallback
      default: 'from-brand-500 to-brand-600 text-white'
    };
    return colors[cat.toLowerCase()] || colors.default;
  };

  const colorClass = getCategoryColors(category);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Store files in sessionStorage to pass to the tool page
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      sessionStorage.setItem('draggedFiles', JSON.stringify(fileData));
      sessionStorage.setItem('draggedFilesObjects', 'pending');

      // Navigate to the tool page
      router.push(href);
    }
  };

  return (
    <Link
      href={href}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative block p-5 sm:p-8 bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 ${isDragging
        ? 'border-brand-500 bg-brand-50 shadow-soft-xl scale-105'
        : 'border-slate-200 hover:border-brand-300'
        }`}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-brand-500/10 rounded-2xl flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-brand-600 mx-auto mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-brand-700 font-semibold text-sm sm:text-base">Drop to convert</p>
          </div>
        </div>
      )}

      {/* Category Badge */}
      <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
        {category}
      </div>

      {/* Icon */}
      <div className={`w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
        {Icons[iconName] && React.createElement(Icons[iconName], { className: "w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:rotate-12 transition-transform duration-300" })}
      </div>

      {/* Content */}
      <h3 className="text-[17px] sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-brand-600 transition-colors leading-tight tracking-tight">
        {name}
      </h3>
      <p className="text-xs sm:text-base text-slate-600 mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Format & Size Info */}
      {(supportedFormats || maxFileSize) && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          {supportedFormats && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex flex-wrap gap-1">
                {supportedFormats.slice(0, 3).map((format, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {format}
                  </span>
                ))}
                {supportedFormats.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    +{supportedFormats.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
          {maxFileSize && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <span>Max: {maxFileSize}</span>
            </div>
          )}
        </div>
      )}

      {/* Drag & Drop Hint */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Click or drag files here
        </p>
      </div>

      {/* Arrow Icon */}
      <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-600 transition-all duration-300">
        <svg
          className="w-4 h-4 text-slate-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
