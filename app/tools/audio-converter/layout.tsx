import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Audio Converter — MP3 ⇆ WAV | FilePilot",
    description: "Convert MP3 to WAV or WAV to MP3 instantly.",
    keywords: ["audio converter", "mp3 to wav", "wav to mp3"],
  alternates: {
    canonical: "https://filepilot.com/tools/audio-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
