import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Forever Forward",
  description:
    "Forever Forward Foundation's privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70">Last updated: March 2026</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl p-8 lg:p-12 border border-[#DDDDDD] shadow-sm">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-0 mb-6">
                Introduction
              </h2>
              <p className="text-[#555555] leading-relaxed">
                Forever Forward Foundation (&ldquo;we,&rdquo; &ldquo;our,&rdquo;
                or &ldquo;us&rdquo;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website, use our
                services, or participate in our programs.
              </p>
              <p className="text-[#555555] leading-relaxed">
                As a 501(c)(3) nonprofit organization, we handle your
                information with care and transparency. Please read this policy
                carefully. If you do not agree with the terms of this privacy
                policy, please do not access the site or use our services.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-[#1A1A1A] mt-8 mb-4">
                Information You Provide
              </h3>
              <p className="text-[#555555] leading-relaxed">
                We collect information you voluntarily provide when you:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Register for our programs (Father Forward, Tech-Ready Youth, etc.)</li>
                <li>Request IT services or a free assessment</li>
                <li>Make a donation</li>
                <li>Sign up for our newsletter</li>
                <li>Contact us through forms or email</li>
                <li>Register for events like Movies on the Menu</li>
                <li>Apply to volunteer or partner with us</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                This information may include your name, email address, phone
                number, mailing address, payment information, and any other
                information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold text-[#1A1A1A] mt-8 mb-4">
                Automatically Collected Information
              </h3>
              <p className="text-[#555555] leading-relaxed">
                When you visit our website, we may automatically collect certain
                information including:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website or source</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                How We Use Your Information
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Process program applications and enrollments</li>
                <li>Provide and manage IT services</li>
                <li>Process donations and send tax receipts</li>
                <li>Send newsletters and program updates</li>
                <li>Respond to your inquiries and provide support</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>
                  Send relevant communications about events, programs, and
                  opportunities
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Information Sharing
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Service Providers:</strong> We work with trusted
                  partners who help us operate our programs and services
                  (payment processors, email services, etc.). These partners are
                  contractually bound to protect your information.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law or in response to valid legal
                  processes.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share information
                  with your explicit consent.
                </li>
                <li>
                  <strong>Aggregate Data:</strong> We may share anonymized,
                  aggregate data for reporting and research purposes.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Travis AI
              </h2>
              <p className="text-[#555555] leading-relaxed">
                Our AI assistant, Travis, helps program participants navigate
                their journey. When you interact with Travis:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Conversations are used to provide personalized support and guidance</li>
                <li>
                  Information may be shared with case workers to ensure you
                  receive the best support
                </li>
                <li>
                  We use industry-standard security measures to protect your
                  conversations
                </li>
                <li>
                  Travis may escalate to human staff if it detects urgent needs
                  or safety concerns
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Data Security
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure server infrastructure</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal information by authorized personnel only</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100%
                secure. While we strive to protect your information, we cannot
                guarantee absolute security.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Your Rights and Choices
              </h2>
              <p className="text-[#555555] leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of the personal
                  information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request that we correct
                  inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request that we delete your
                  personal information (subject to legal requirements)
                </li>
                <li>
                  <strong>Opt-Out:</strong> Unsubscribe from marketing
                  communications at any time
                </li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:4ever4wardfoundation@gmail.com"
                  className="text-[#C9A84C] hover:underline"
                >
                  4ever4wardfoundation@gmail.com
                </a>
                .
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Cookies and Tracking
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We use cookies and similar tracking technologies to improve your
                experience on our website. You can control cookies through your
                browser settings. Note that disabling cookies may affect some
                functionality.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Children&apos;s Privacy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                Some of our programs serve minors. When collecting information
                from participants under 18, we require parental or guardian
                consent. We take additional precautions to protect
                children&apos;s information and comply with applicable laws
                including COPPA.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                California Privacy Rights
              </h2>
              <p className="text-[#555555] leading-relaxed">
                California residents have additional rights under the California
                Consumer Privacy Act (CCPA), including the right to know what
                personal information is collected, the right to delete personal
                information, and the right to opt-out of the sale of personal
                information. As noted above, we do not sell personal
                information.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Changes to This Policy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &ldquo;Last updated&rdquo; date. We
                encourage you to review this Privacy Policy periodically.
              </p>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mt-12 mb-6">
                Contact Us
              </h2>
              <p className="text-[#555555] leading-relaxed">
                If you have questions or concerns about this Privacy Policy,
                please contact us:
              </p>
              <div className="bg-[#F5F3EF] rounded-lg p-6 mt-4">
                <p className="text-[#1A1A1A] font-semibold">
                  Forever Forward Foundation
                </p>
                <p className="text-[#555555] mt-2">
                  6111 S Gramercy Pl, Suite 4
                  <br />
                  Los Angeles, CA 90047
                </p>
                <p className="text-[#555555] mt-2">
                  Email:{" "}
                  <a
                    href="mailto:4ever4wardfoundation@gmail.com"
                    className="text-[#C9A84C] hover:underline"
                  >
                    4ever4wardfoundation@gmail.com
                  </a>
                </p>
                <p className="text-[#555555]">
                  Phone:{" "}
                  <a
                    href="tel:+19518775196"
                    className="text-[#C9A84C] hover:underline"
                  >
                    (951) 877-5196
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[#C9A84C] hover:underline font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
