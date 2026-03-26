"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { routeFormSubmission } from "@/lib/actions/lead-routing";

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "6111 S Gramercy Pl, Suite 4",
    detail: "Los Angeles, CA 90047",
    href: "https://maps.google.com/?q=6111+S+Gramercy+Pl+Los+Angeles+CA+90047",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(951) 877-5196",
    detail: "Mon-Fri 9am-5pm PT",
    href: "tel:+19518775196",
  },
  {
    icon: Mail,
    label: "Email",
    value: "4ever4wardfoundation@gmail.com",
    detail: "We respond within 24 hours",
    href: "mailto:4ever4wardfoundation@gmail.com",
  },
];

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "programs", label: "Programs & Enrollment" },
  { value: "services", label: "IT Services" },
  { value: "volunteer", label: "Volunteering" },
  { value: "partnership", label: "Partnership" },
  { value: "donation", label: "Donations" },
  { value: "media", label: "Media & Press" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await routeFormSubmission({
        formType: "contact",
        formData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          inquiryType: formData.inquiryType,
          subject: formData.subject,
          message: formData.message,
          source: "contact_form",
        },
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        console.error("Failed to submit:", result.error);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <MessageSquare className="h-4 w-4 text-[#C9A84C]" />
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              We&apos;d Love to{" "}
              <span className="text-[#C9A84C]">Hear From You</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              Whether you have questions about our programs, need IT services,
              or want to get involved, we&apos;re here to help.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 -mt-16 relative z-20">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.label === "Address" ? "_blank" : undefined}
                rel={info.label === "Address" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-[#DDDDDD] hover:border-[#C9A84C] transition-all hover:shadow-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FBF6E9] flex items-center justify-center mb-4 group-hover:bg-[#C9A84C] transition-colors">
                  <info.icon className="h-6 w-6 text-[#C9A84C] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-[#888888] mb-1">
                  {info.label}
                </h3>
                <p className="text-lg font-semibold text-[#1A1A1A]">
                  {info.value}
                </p>
                <p className="text-sm text-[#555555] mt-1">{info.detail}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Form Section */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                Visit Our Office
              </h2>
              <div className="aspect-square lg:aspect-[4/3] rounded-xl overflow-hidden bg-[#2D2D2D] relative">
                {/* Google Maps Embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.1234567890123!2d-118.29876543210987!3d33.98765432109876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU5JzE1LjYiTiAxMTjCsDE3JzU1LjYiVw!5e0!3m2!1sen!2sus!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="Forever Forward Office Location"
                />
                {/* Fallback placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#2D2D2D] pointer-events-none opacity-0">
                  <div className="text-center text-white/60">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p>6111 S Gramercy Pl, Suite 4</p>
                    <p>Los Angeles, CA 90047</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-[#EFF4EB] border border-[#7A9A63]">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#5A7247] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">
                      Office Hours
                    </h3>
                    <p className="text-sm text-[#555555] mt-1">
                      Monday - Friday: 9:00 AM - 5:00 PM PT
                      <br />
                      Saturday: By appointment only
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-8 text-center border border-[#DDDDDD]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-[#5A7247]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[#555555]">
                    Thank you for reaching out. We&apos;ll get back to you
                    within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-xl p-6 lg:p-8 border border-[#DDDDDD]"
                >
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Phone
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        What can we help you with? *
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inquiryType: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        required
                      >
                        <option value="">Select an option</option>
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Subject *
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="Brief summary of your inquiry"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        placeholder="Tell us more about how we can help..."
                        className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Looking for Something Specific?"
            subtitle="Here are some quick links to help you find what you need."
            centered
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {[
              {
                title: "Enroll in a Program",
                description: "Apply for Father Forward, Tech-Ready Youth, or other programs",
                href: "/get-involved/enroll",
              },
              {
                title: "Get IT Services",
                description: "Request a free assessment for your nonprofit or school",
                href: "/services",
              },
              {
                title: "Make a Donation",
                description: "Support our mission with a one-time or recurring gift",
                href: "/get-involved/donate",
              },
              {
                title: "Become a Volunteer",
                description: "Give your time and skills to help our community",
                href: "/get-involved/volunteer",
              },
              {
                title: "Partner With Us",
                description: "Explore corporate sponsorships and partnerships",
                href: "/get-involved/partner",
              },
              {
                title: "Attend an Event",
                description: "Join us for Movies on the Menu and other events",
                href: "/events",
              },
            ].map((link, index) => (
              <motion.a
                key={link.title}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="block p-4 rounded-lg border border-[#DDDDDD] hover:border-[#C9A84C] hover:bg-[#FBF6E9] transition-all group"
              >
                <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-[#555555] mt-1">{link.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-12 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555555] italic">
            &ldquo;Every message matters. Whether you&apos;re a father looking
            to transform your career, a nonprofit needing IT support, or someone
            who wants to help, we&apos;re here for you.&rdquo;
          </p>
          <p className="text-[#1A1A1A] font-semibold mt-3">
            — TJ Wilform, Founder
          </p>
        </div>
      </section>
    </>
  );
}
