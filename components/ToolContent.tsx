'use client';

import { toolContent } from '@/lib/tool-content';
import { Icons } from './Icons';

interface ToolContentProps {
    toolId: string;
}

export default function ToolContent({ toolId }: ToolContentProps) {
    const content = toolContent[toolId];

    if (!content) return null;

    return (
        <div className="mt-16 space-y-16 max-w-4xl mx-auto">
            {/* How To Section */}
            <section className="fade-up">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Icons.Bolt className="w-6 h-6" />
                    </div>
                    {content.howTo.title}
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {content.howTo.steps.map((step, idx) => (
                        <div key={idx} className="relative p-6 bg-white rounded-xl shadow-soft border border-slate-100">
                            <div className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mt-2 mb-2">{step.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="fade-up">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Icons.Shield className="w-6 h-6" />
                    </div>
                    {content.features.title}
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {content.features.items.map((item, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="fade-up">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <Icons.Settings className="w-6 h-6" />
                    </div>
                    {content.faq.title}
                </h2>
                <div className="space-y-4">
                    {content.faq.items.map((item, idx) => (
                        <div key={idx} className="p-6 bg-white rounded-xl shadow-soft border border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="text-purple-600">Q.</span> {item.question}
                            </h3>
                            <p className="text-slate-600 pl-6 border-l-2 border-purple-100 ml-1.5">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
