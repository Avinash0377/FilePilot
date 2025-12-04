import Container from '@/components/Container';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              ← Back to home
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-charcoal mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                Your Privacy Matters
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At FilePilot, we take your privacy seriously. This policy explains how we handle your files and data when you use our file conversion services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                File Processing
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Files are processed temporarily and automatically deleted after conversion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>We do not store, save, or keep copies of your files</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>All processing happens on our secure servers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Temporary files are deleted immediately after your download</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                No Account Required
              </h2>
              <p className="text-gray-600 leading-relaxed">
                FilePilot does not require you to create an account or log in. You can use all our conversion tools without providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                No Tracking
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We do not use cookies for tracking purposes. We do not collect analytics about your usage patterns or share any data with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                All file transfers between your browser and our servers are encrypted using HTTPS. Your files are never accessible to anyone except you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                File Size Limits
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To ensure optimal performance and security, we limit file uploads to 50MB per file. This helps us maintain fast conversion times and prevents abuse of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this privacy policy or how we handle your data, please feel free to reach out to us.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Last updated: December 2025
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
