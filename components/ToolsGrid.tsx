'use client';

import { useState, useMemo } from 'react';
import ToolCard from './ToolCard';
import { Icons, categoryIconMap } from './Icons';
import { tools, categories, Tool } from '@/lib/tools';

export default function ToolsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedTools = useMemo(() => {
    const groups: Record<string, Tool[]> = {};

    for (const tool of filteredTools) {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    }

    return groups;
  }, [filteredTools]);

  // Helper function to get category icon
  const getCategoryIcon = (categoryId: string) => {
    const iconKey = categoryIconMap[categoryId];
    if (iconKey && Icons[iconKey]) {
      const IconComponent = Icons[iconKey];
      return <IconComponent className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="space-y-10">
      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto w-full">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for tools (e.g., PDF to Word, Image Compressor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-base shadow-soft-md focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:shadow-glow transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${!selectedCategory
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-200'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50'
                }`}
            >
              All Tools
            </button>
            {categories.map((category) => {
              const IconComponent = categoryIconMap[category.id] ? Icons[categoryIconMap[category.id]] : Icons.File;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-200'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {Object.keys(groupedTools).length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Icons.Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No tools found</h3>
          <p className="text-slate-500 text-sm mb-4">Try adjusting your search</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryTools = groupedTools[category.id];
            if (!categoryTools || categoryTools.length === 0) return null;

            const IconComponent = categoryIconMap[category.id] ? Icons[categoryIconMap[category.id]] : Icons.File;

            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-soft-md p-5 sm:p-8">
                {/* Category Header with Visual Separator */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Icon Badge */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white border-2 border-brand-800 flex items-center justify-center shadow-soft group-hover:bg-brand-800 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-brand-800 group-hover:text-white" />
                    </div>

                    {/* Category Name */}
                    <div className="flex-1">
                      <h2 className={`text-2xl sm:text-3xl font-semibold ${category.id === 'pdf' ? 'text-green-600' : 'text-slate-900'}`}>
                        {category.name}
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} available
                      </p>
                    </div>
                  </div>

                  {/* Decorative Line */}
                  <div className="h-px bg-gradient-to-r from-brand-200 via-brand-300 to-transparent"></div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool, index) => (
                    <div key={tool.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ToolCard name={tool.title} description={tool.description} icon={tool.icon} href={tool.href} category={tool.category} supportedFormats={tool.supportedFormats} maxFileSize={tool.maxFileSize} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
