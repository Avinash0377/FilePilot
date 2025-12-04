import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Background Remover — Remove BG from Images | FilePilot",
    description: "Remove image backgrounds automatically with AI-powered processing.",
    keywords: ["background remover", "remove bg", "image background remove"],
  alternates: {
    canonical: "https://filepilot.com/tools/background-remover",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
