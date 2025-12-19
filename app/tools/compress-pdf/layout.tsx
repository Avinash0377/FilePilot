import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Compress PDF — Reduce PDF Size | FilePilot",
    description: "Reduce PDF file size without losing quality. Instant and secure PDF compression.",
    keywords: ["compress pdf", "pdf compressor", "reduce pdf size"],
  alternates: {
    canonical: "https://filepilot.online/tools/compress-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
