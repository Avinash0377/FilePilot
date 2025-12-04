import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">

          {/* Critical Disclaimers */}
          <div className="bg-brand-50 border-l-4 border-brand-600 p-6 rounded-r-xl mb-8">
            <h2 className="text-2xl font-bold text-brand-900 mt-0 mb-4">Important Information</h2>
            <ul className="space-y-3 mb-0">
              <li className="text-brand-800"><strong>We do not claim ownership of your files.</strong> All files you upload remain your property.</li>
              <li className="text-brand-800"><strong>Files are automatically deleted from our servers immediately after processing.</strong> We do not store your files.</li>
              <li className="text-brand-800"><strong>We are not liable for data loss.</strong> Please keep backups of your original files.</li>
            </ul>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              FilePilot ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle your files and data when you use our file conversion services.
            </p>
          </section>

          {/* File Processing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">File Processing & Storage</h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">How We Handle Your Files</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Files are processed entirely on our servers for conversion purposes only</li>
                  <li>Files are automatically deleted immediately after processing is complete</li>
                  <li>We do not store, archive, or backup your files</li>
                  <li>We do not access, view, or analyze the content of your files</li>
                  <li>All file transfers are encrypted using HTTPS</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">File Retention</h3>
                <p>
                  <strong>Temporary Processing:</strong> Files are kept in temporary storage only during the conversion process (typically less than 60 seconds).
                </p>
                <p>
                  <strong>Automatic Deletion:</strong> Once the conversion is complete and you download your file, the original and converted files are immediately deleted from our servers.
                </p>
                <p>
                  <strong>Cleanup System:</strong> Our automated cleanup system ensures any orphaned files (from failed conversions or interrupted sessions) are deleted within 5 minutes.
                </p>
              </div>
            </div>
          </section>

          {/* Data Collection */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data We Collect</h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Technical Information</h3>
                <p>We may collect basic technical information for service improvement and security:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address (for rate limiting and abuse prevention)</li>
                  <li>Browser type and version</li>
                  <li>Device type (desktop/mobile)</li>
                  <li>File type and size (for analytics, not file content)</li>
                  <li>Conversion success/failure rates</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">What We Don't Collect</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal information (name, email, phone number)</li>
                  <li>File contents or metadata</li>
                  <li>User accounts or login credentials</li>
                  <li>Cookies for tracking purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Security</h2>
            <div className="space-y-4 text-slate-700">
              <p>We implement industry-standard security measures to protect your files during processing:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>HTTPS Encryption:</strong> All file transfers are encrypted using SSL/TLS</li>
                <li><strong>Isolated Processing:</strong> Each file is processed in an isolated environment</li>
                <li><strong>Rate Limiting:</strong> Protection against abuse and automated attacks</li>
                <li><strong>Automatic Cleanup:</strong> Immediate deletion of files after processing</li>
                <li><strong>No Third-Party Access:</strong> We do not share your files with any third parties</li>
              </ul>
            </div>
          </section>

          {/* Liability Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Disclaimer of Liability</h2>
            <div className="bg-slate-100 border border-slate-300 p-6 rounded-xl">
              <p className="text-slate-800 font-medium mb-3">
                FilePilot is provided "as is" without warranties of any kind. By using our service, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>We are not liable for any data loss, corruption, or quality issues with converted files</li>
                <li>You are responsible for maintaining backups of your original files</li>
                <li>We do not guarantee 100% uptime or availability of the service</li>
                <li>Conversion quality may vary depending on file complexity and format</li>
                <li>We are not responsible for any damages resulting from the use of our service</li>
                <li>You use this service at your own risk</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Responsibilities</h2>
            <div className="space-y-4 text-slate-700">
              <p>By using FilePilot, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Only upload files that you own or have permission to convert</li>
                <li>Not upload files containing illegal, harmful, or malicious content</li>
                <li>Not attempt to abuse, hack, or disrupt our service</li>
                <li>Maintain backups of your original files before conversion</li>
                <li>Verify the quality and accuracy of converted files before use</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
            <p className="text-slate-700">
              Our service uses open-source conversion tools (FFmpeg, ImageMagick, LibreOffice) running on our servers.
              We do not send your files to any external third-party services or APIs.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-700">
              Our service is not directed to children under 13. We do not knowingly collect information from children.
              If you are under 13, please do not use our service.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-700">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
              Continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-slate-100 rounded-lg">
              <p className="text-slate-800 font-medium">
                Email: <a href="mailto:sudhimallaavinash07@gmail.com" className="text-brand-600 hover:text-brand-700">sudhimallaavinash07@gmail.com</a>
              </p>
            </div>
          </section>

          {/* Summary */}
          <div className="bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-200 p-6 rounded-xl mt-12">
            <h3 className="text-xl font-bold text-brand-900 mb-3">In Summary</h3>
            <p className="text-brand-800 mb-3">
              <strong>Your privacy is our priority.</strong> We process your files securely, delete them immediately after conversion,
              and never store or share your data. You retain full ownership of your files, and we are not liable for any data loss.
            </p>
            <p className="text-brand-700 text-sm mb-0">
              Always keep backups of important files before conversion.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
