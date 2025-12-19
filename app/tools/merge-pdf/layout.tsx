import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Merge PDF — Combine PDF Files | FilePilot",
    description: "Combine multiple PDF files into a single document. Fast, secure, and free.",
    keywords: ["merge pdf", "combine pdf", "join pdf files"],
  alternates: {
    canonical: "https://filepilot.online/tools/merge-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
