import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Video Converter — MP4 ⇆ WebM | FilePilot",
  description: "Convert MP4 to WebM or WebM to MP4 instantly. Fast and free.",
  keywords: ["video converter", "mp4 to webm", "webm to mp4"],
  alternates: {
    canonical: "https://filepilot.com/tools/video-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
