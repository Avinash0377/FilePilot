import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "PNG to JPG — Free Converter | FilePilot",
    description: "Convert PNG images to JPG format instantly with compression support.",
    keywords: ["png to jpg", "convert png", "image converter"],
  alternates: {
    canonical: "https://filepilot.online/tools/png-to-jpg",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
