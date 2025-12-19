import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Word to PDF — Free Converter | FilePilot",
    description: "Convert Word documents (.docx) to PDF format instantly. Fast, secure, and accurate.",
    keywords: ["word to pdf", "docx to pdf", "convert word to pdf"],
  alternates: {
    canonical: "https://filepilot.online/tools/word-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
