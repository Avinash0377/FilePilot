import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Image to WebP — Convert JPG/PNG to WebP | FilePilot",
    description: "Convert JPG or PNG images into WebP format instantly.",
    keywords: ["image to webp", "webp converter"],
  alternates: {
    canonical: "https://filepilot.online/tools/image-to-webp",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
