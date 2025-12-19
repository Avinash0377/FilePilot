import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "PDF to Text — Extract Text from PDF | FilePilot",
    description: "Convert PDF documents into plain text instantly.",
    keywords: ["pdf to text", "extract text pdf"],
  alternates: {
    canonical: "https://filepilot.online/tools/pdf-to-text",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
