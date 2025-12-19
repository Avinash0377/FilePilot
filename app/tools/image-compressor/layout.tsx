import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Image Compressor — Reduce Image Size | FilePilot",
    description: "Compress JPG, PNG, and WebP images without losing quality.",
    keywords: ["image compressor", "reduce image size", "compress jpg"],
  alternates: {
    canonical: "https://filepilot.online/tools/image-compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
