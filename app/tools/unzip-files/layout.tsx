import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Unzip Files — Extract ZIP Archives | FilePilot",
    description: "Extract ZIP archives instantly. Fast, secure, free.",
    keywords: ["unzip files", "extract zip", "decompress files"],
  alternates: {
    canonical: "https://filepilot.online/tools/unzip-files",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
