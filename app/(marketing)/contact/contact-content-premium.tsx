"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  GraduationCap,
  Server,
  Heart,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routeFormSubmission } from "@/lib/actions/lead-routing";
import { cn } from "@/lib/utils";

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

const quickLinks = [
  {
    title: "Enroll in a Program",
    description: "Father Forward, Tech-Ready Youth, and more",
    href: "/get-involved/enroll",
    icon: GraduationCap,
    color: "gold",
  },
  {
    title: "Get IT Services",
    description: "Free assessment for nonprofits",
    href: "/services",
    icon: Server,
    color: "olive",
  },
  {
    title: "Make a Donation",
    description: "Support our mission",
    href: "/get-involved/donate",
    icon: Heart,
    color: "gold",
  },
  {
    title: "Attend an Event",
    description: "Movies on the Menu and more",
    href: "/events",
    icon: Calendar,
    color: "olive",
  },
];

export function ContactContentPremium() {
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
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section - Split Screen */}
      <section className="relative min-h-[70vh] bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          {/* Left - Content */}
          <div className="relative z-10 flex items-center px-6 sm:px-12 lg:px-16 xl:px-24 pt-32 pb-16 lg:py-0">
            <div className="max-w-lg">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80">
                  <MessageSquare className="h-4 w-4 text-[#C9A84C]" />
                  Get in Touch
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6"
              >
                We&apos;d Love to
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]">
                  Hear From You
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-white/60 leading-relaxed mb-10"
              >
                Whether you have questions about our programs, need IT services, or want to get
                involved—we&apos;re here to help.
              </motion.p>

              {/* Contact Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-4"
              >
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    target={info.label === "Address" ? "_blank" : undefined}
                    rel={info.label === "Address" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C9A84C]/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A84C]/30 transition-colors">
                      <info.icon className="h-6 w-6 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{info.value}</p>
                      <p className="text-sm text-white/50">{info.detail}</p>
                    </div>
                  </a>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative hidden lg:block">
            <Image
              src="/images/authentic/family/family-outdoor-portrait.jpg"
              alt="Forever Forward community"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/20" />

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-24 left-8 bg-white rounded-2xl p-5 shadow-2xl max-w-[280px]"
            >
              <div className="text-[#C9A84C] text-3xl font-serif mb-2">&ldquo;</div>
              <p className="text-[#1A1A1A] font-medium text-sm leading-relaxed">
                Every message matters. We&apos;re here for you.
              </p>
              <p className="text-[#888888] text-xs mt-3">— TJ Wilform, Founder</p>
            </motion.div>
          </div>
        </div>

        {/* Mobile hero overlay */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/authentic/family/family-outdoor-portrait.jpg"
            alt="Forever Forward community"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 to-[#1A1A1A]" />
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-semibold mb-6">
                <Send className="h-4 w-4" />
                Send a Message
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-8">
                How Can We Help?
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-10 text-center border border-[#DDDDDD]"
                >
                  <div className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-[#5A7247]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">Message Sent!</h3>
                  <p className="text-[#555555] leading-relaxed">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl p-8 border border-[#DDDDDD] shadow-sm"
                >
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Phone
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        What can we help you with? *
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) =>
                          setFormData({ ...formData, inquiryType: e.target.value })
                        }
                        className="w-full h-12 rounded-lg border border-[#DDDDDD] bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
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
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Subject *
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="Brief summary of your inquiry"
                        className="h-12"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        placeholder="Tell us more about how we can help..."
                        className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full h-12" size="lg">
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

            {/* Right Side - Map + Office Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map */}
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Visit Our Office</h3>
                <div className="aspect-video rounded-2xl overflow-hidden bg-[#2D2D2D] relative">
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
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-[#EFF4EB] rounded-2xl p-6 border border-[#5A7247]/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#5A7247]/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-[#5A7247]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">Office Hours</h3>
                    <div className="text-sm text-[#555555] space-y-1">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM PT</p>
                      <p>Saturday: By appointment only</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="p-4 rounded-xl bg-white border border-[#DDDDDD] hover:border-[#C9A84C]/30 hover:shadow-md transition-all group"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                          link.color === "gold"
                            ? "bg-[#FBF6E9] group-hover:bg-[#C9A84C]/20"
                            : "bg-[#EFF4EB] group-hover:bg-[#5A7247]/20"
                        )}
                      >
                        <link.icon
                          className={cn(
                            "h-5 w-5",
                            link.color === "gold" ? "text-[#C9A84C]" : "text-[#5A7247]"
                          )}
                        />
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm mb-1 group-hover:text-[#C9A84C] transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-xs text-[#888888]">{link.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
              Whether you&apos;re looking to transform your career, support our mission, or partner
              with us—we&apos;re excited to connect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group px-8">
                <Link href="/get-involved/enroll">
                  Enroll in a Program
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/services">Explore IT Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
