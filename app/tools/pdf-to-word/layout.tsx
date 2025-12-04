import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "PDF to Word — Free Converter | FilePilot",
    description: "Convert PDF files to editable Word (.docx) instantly with FilePilot. Fast, accurate, secure.",
    keywords: ["pdf to word", "convert pdf to word", "free pdf to word", "pdf to docx"],
    alternates: {
        canonical: "https://filepilot.com/tools/pdf-to-word",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
