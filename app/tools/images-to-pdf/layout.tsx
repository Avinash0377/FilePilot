import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Images to PDF — Convert JPG/PNG to PDF | FilePilot",
    description: "Convert images (JPG/PNG) to PDF instantly. Supports multiple images.",
    keywords: ["images to pdf", "jpg to pdf", "png to pdf"],
  alternates: {
    canonical: "https://filepilot.com/tools/images-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
