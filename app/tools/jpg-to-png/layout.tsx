import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "JPG to PNG — Free Image Converter | FilePilot",
    description: "Convert JPG images to PNG format instantly. High-quality and fast.",
    keywords: ["jpg to png", "image converter", "convert jpg"],
  alternates: {
    canonical: "https://filepilot.com/tools/jpg-to-png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
