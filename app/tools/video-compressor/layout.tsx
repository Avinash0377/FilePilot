import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Video Compressor — Reduce Video Size | FilePilot",
    description: "Compress videos while maintaining quality. Fast and secure.",
    keywords: ["video compressor", "reduce video size", "compress mp4"],
  alternates: {
    canonical: "https://filepilot.com/tools/video-compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
