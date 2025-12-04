import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "ZIP Files — Create ZIP Archives | FilePilot",
    description: "Compress files into a ZIP archive instantly.",
    keywords: ["zip files", "create zip", "file compression"],
  alternates: {
    canonical: "https://filepilot.com/tools/zip-files",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
