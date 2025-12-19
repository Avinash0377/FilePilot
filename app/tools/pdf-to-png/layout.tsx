import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "PDF to PNG — Free Converter | FilePilot",
    description: "Convert PDF pages into high-quality PNG images instantly.",
    keywords: ["pdf to png", "convert pdf to image"],
  alternates: {
    canonical: "https://filepilot.online/tools/pdf-to-png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
