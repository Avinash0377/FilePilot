import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Add Background — Add BG to Images | FilePilot",
    description: "Add custom backgrounds to transparent PNG images instantly. Fast, easy, and free.",
    keywords: ["add background", "image background", "png background", "add bg to image"],
  alternates: {
    canonical: "https://filepilot.com/tools/add-background",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
