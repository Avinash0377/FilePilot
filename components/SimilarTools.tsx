import Link from 'next/link';
import { Icons } from './Icons';

interface SimilarTool {
    title: string;
    href: string;
    icon: keyof typeof Icons;
    description: string;
}

interface SimilarToolsProps {
    currentTool: string;
}

export default function SimilarTools({ currentTool }: SimilarToolsProps) {
    // Define similar tools based on current tool
    const similarToolsMap: Record<string, SimilarTool[]> = {
        'pdf-to-word': [
            { title: 'PDF to PPT', href: '/tools/pdf-to-ppt', icon: 'PdfToPpt', description: 'Convert PDF to PowerPoint' },
            { title: 'PDF to PNG', href: '/tools/pdf-to-png', icon: 'PdfToPng', description: 'Convert PDF to images' },
            { title: 'Merge PDF', href: '/tools/merge-pdf', icon: 'MergePdf', description: 'Combine multiple PDFs' },
            { title: 'Compress PDF', href: '/tools/compress-pdf', icon: 'CompressPdf', description: 'Reduce PDF file size' },
        ],
        'image-compressor': [
            { title: 'Image to WebP', href: '/tools/image-to-webp', icon: 'ImageToWebp', description: 'Convert to WebP format' },
            { title: 'JPG to PNG', href: '/tools/jpg-to-png', icon: 'JpgToPng', description: 'Convert JPG to PNG' },
            { title: 'PNG to JPG', href: '/tools/png-to-jpg', icon: 'PngToJpg', description: 'Convert PNG to JPG' },
            { title: 'Background Remover', href: '/tools/background-remover', icon: 'BackgroundRemove', description: 'Remove image background' },
        ],
        'merge-pdf': [
            { title: 'Split PDF', href: '/tools/split-pdf', icon: 'SplitPdf', description: 'Split PDF into pages' },
            { title: 'Compress PDF', href: '/tools/compress-pdf', icon: 'CompressPdf', description: 'Reduce PDF file size' },
            { title: 'PDF to Word', href: '/tools/pdf-to-word', icon: 'PdfToWord', description: 'Convert PDF to Word' },
            { title: 'Word to PDF', href: '/tools/word-to-pdf', icon: 'WordToPdf', description: 'Convert Word to PDF' },
        ],
    };

    const tools = similarToolsMap[currentTool] || [
        { title: 'PDF to Word', href: '/tools/pdf-to-word', icon: 'PdfToWord', description: 'Convert PDF to Word' },
        { title: 'Image Compressor', href: '/tools/image-compressor', icon: 'ImageCompressor', description: 'Compress images' },
        { title: 'Merge PDF', href: '/tools/merge-pdf', icon: 'MergePdf', description: 'Combine PDFs' },
        { title: 'Background Remover', href: '/tools/background-remover', icon: 'BackgroundRemover', description: 'Remove backgrounds' },
    ];

    return (
        <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Similar Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tools.map((tool, index) => {
                    const IconComponent = Icons[tool.icon];
                    return (
                        <Link
                            key={index}
                            href={tool.href}
                            className="group flex items-start gap-3 p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-brand-200 hover:shadow-md transition-all"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                                {IconComponent && <IconComponent className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors mb-0.5">
                                    {tool.title}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-1">
                                    {tool.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
