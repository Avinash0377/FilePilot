import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "PowerPoint to PDF — Free Converter | FilePilot",
    description: "Convert PowerPoint files to PDF quickly and securely.",
    keywords: ["ppt to pdf", "powerpoint to pdf"],
  alternates: {
    canonical: "https://filepilot.com/tools/ppt-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
