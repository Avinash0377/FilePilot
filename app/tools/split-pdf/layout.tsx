import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Split PDF — Extract Pages from PDF | FilePilot",
    description: "Extract specific pages from a PDF instantly. Private, fast, and free.",
    keywords: ["split pdf", "extract pdf pages", "separate pdf"],
  alternates: {
    canonical: "https://filepilot.com/tools/split-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
