import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "PDF to PowerPoint — Free Converter | FilePilot",
    description: "Convert PDF files into editable PowerPoint presentations (.pptx).",
    keywords: ["pdf to ppt", "convert pdf to powerpoint"],
  alternates: {
    canonical: "https://filepilot.online/tools/pdf-to-ppt",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
