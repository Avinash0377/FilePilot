'use client';

import Container from '@/components/Container';
import ToolsGrid from '@/components/ToolsGrid';
import { Icons } from '@/components/Icons';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-white">
      {/* Hero Section - Two Column Premium Design */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none opacity-60"></div>

        <Container>
          <div className="relative grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Main Heading with Gradient */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 animate-fade-in-up">
                <span className="block text-slate-900">
                  Transform Your Files
                </span>
                <span className="block text-brand-800 animate-slide-in-right">
                  Instantly & Securely
                </span>
              </h1>

              {/* Tagline */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Professional file conversion tools. <span className="font-semibold text-brand-600">Free forever.</span>
                <br />
                No signup required. Your files stay private.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center lg:justify-start">
                <a
                  href="#tools"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-brand-800 hover:bg-brand-900 text-white font-semibold text-base sm:text-lg rounded-xl hover:shadow-glow transition-all duration-300 hover:-translate-y-1 hover:scale-105 min-h-[44px] touch-manipulation active:scale-95"
                >
                  Browse All Tools
                  <Icons.ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white text-slate-700 font-semibold text-base sm:text-lg rounded-xl border-2 border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-all duration-200 min-h-[44px] touch-manipulation active:scale-95"
                >
                  <Icons.Bolt className="w-5 h-5 text-brand-600" />
                  Quick Start
                </button>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start gap-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Icons.Check className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-slate-900">22+</div>
                    <div className="text-sm text-slate-600">Tools Available</div>
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-2">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Icons.Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-slate-900">100%</div>
                    <div className="text-sm text-slate-600">Free & Private</div>
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Icons.Bolt className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-slate-900">∞</div>
                    <div className="text-sm text-slate-600">Unlimited Use</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Main Logo Container */}
                <div className="relative h-96 flex items-center justify-center">
                  {/* Animated Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-brand-600/20 to-brand-700/20 rounded-full blur-3xl animate-pulse"></div>

                  {/* Center Logo with Breathing Animation */}
                  <div className="relative z-10" style={{ animation: 'logo-breathe 4s ease-in-out infinite' }}>
                    <img
                      src="/logo.png"
                      alt="FilePilot"
                      className="w-80 h-80 object-contain"
                    />
                    {/* Tagline under logo */}
                    <div className="text-center mt-4 space-y-2">
                      <p className="text-lg font-semibold text-slate-900">
                        Your File Conversion Companion
                      </p>
                      <p className="text-sm text-slate-600">
                        Convert • Transform • Optimize
                      </p>
                    </div>
                  </div>

                  {/* Floating File Format Icons with Enhanced Animations */}
                  {/* PDF Icon - Top Left */}
                  <div className="absolute top-0 left-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300" style={{ animation: 'icon-float 6s ease-in-out infinite' }}>
                    <Icons.PdfFile className="w-8 h-8 text-red-600" />
                  </div>

                  {/* Image Icon - Top Right */}
                  <div className="absolute top-12 right-8 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300" style={{ animation: 'icon-float 5s ease-in-out infinite', animationDelay: '0.5s' }}>
                    <Icons.ImageCompress className="w-7 h-7 text-blue-600" />
                  </div>

                  {/* Video Icon - Bottom Left */}
                  <div className="absolute bottom-16 left-12 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300" style={{ animation: 'icon-float 5.5s ease-in-out infinite', animationDelay: '1s' }}>
                    <Icons.VideoConvert className="w-7 h-7 text-purple-600" />
                  </div>

                  {/* Audio Icon - Bottom Right */}
                  <div className="absolute bottom-8 right-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300" style={{ animation: 'icon-float 6.5s ease-in-out infinite', animationDelay: '1.5s' }}>
                    <Icons.AudioConvert className="w-8 h-8 text-pink-600" />
                  </div>

                  {/* Word Icon - Middle Left */}
                  <div className="absolute top-1/2 left-4 w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300" style={{ animation: 'icon-float 5s ease-in-out infinite', animationDelay: '2s' }}>
                    <Icons.WordToPdf className="w-6 h-6 text-green-700" />
                  </div>

                  {/* Archive Icon - Middle Right */}
                  <div className="absolute top-1/3 right-4 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300" style={{ animation: 'icon-float 7s ease-in-out infinite', animationDelay: '2.5s' }}>
                    <Icons.ZipFiles className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Choose Your <span className="text-brand-600">Tool</span>
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Select from our collection of professional-grade conversion tools
            </p>
          </div>
          <ToolsGrid />
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Why Choose FilePilot
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Built for performance, security, and reliability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Icons.Shield,
                title: 'Secure SSL Encryption',
                description: 'All file transfers encrypted with HTTPS. Files auto-deleted after processing.',
              },
              {
                icon: Icons.Bolt,
                title: 'Lightning Fast',
                description: 'Powered by high-performance servers to ensure your conversions happen in seconds, not minutes.',
              },
              {
                icon: Icons.Code,
                title: 'Developer Friendly',
                description: 'Clean API endpoints and comprehensive documentation for seamless integration into your workflow.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-200 hover:scale-[1.01]"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-800">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your files?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of professionals who trust FilePilot for their file conversion needs.
            </p>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-soft-lg hover:shadow-glow hover:-translate-y-0.5"
            >
              Get Started Free
              <Icons.ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </Container>
      </section>

      {/* SEO Tools Directory */}
      <section className="py-16 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
              Complete Tool Directory
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
              {[
                'PDF to Word', 'Word to PDF', 'Merge PDF', 'Split PDF',
                'Compress PDF', 'Images to PDF', 'PDF to PNG', 'JPG to PNG',
                'PNG to JPG', 'Image Compressor', 'Image to WebP', 'Background Remover',
                'PDF to PPT', 'PPT to PDF', 'OCR Image', 'PDF to Text',
                'ZIP Files', 'Unzip Files', 'Audio Converter', 'Video Converter',
                'Video Compressor', 'Add Background'
              ].map((tool, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-300 hover:text-brand-400 transition-colors">
                  <Icons.Check className="w-4 h-4 flex-shrink-0 text-brand-500" />
                  <span className="text-sm">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
