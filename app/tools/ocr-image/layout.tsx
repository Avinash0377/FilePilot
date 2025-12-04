import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "OCR Image to Text — Extract Text from Images | FilePilot",
    description: "Extract text from images using OCR. Fast and highly accurate.",
    keywords: ["ocr", "image to text", "extract text from image"],
  alternates: {
    canonical: "https://filepilot.com/tools/ocr-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
