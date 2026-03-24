"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Film,
  Utensils,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

// Placeholder event data - will be replaced with Supabase
const featuredEvent = {
  id: "1",
  title: "Movies on the Menu: Space Jam Night",
  type: "movies_on_menu",
  date: "April 12, 2024",
  time: "5:00 PM - 9:00 PM",
  location: "Forever Forward Community Center",
  address: "6111 S Gramercy Pl, Los Angeles, CA 90047",
  movie: "Space Jam: A New Legacy",
  menu: "Basketball-themed dinner: Slam Dunk Sliders, Courtside Fries, Championship Cookies",
  price: 25,
  capacity: 75,
  spotsLeft: 28,
  description:
    "Join us for an unforgettable evening of food, film, and family fun! Our Movies on the Menu series pairs blockbuster movies with themed dinners—creating the perfect opportunity for fathers to bond with their kids.",
};

const upcomingEvents = [
  {
    id: "2",
    title: "Father Forward Info Session",
    type: "orientation",
    date: "April 18, 2024",
    time: "6:30 PM",
    location: "Online (Zoom)",
    price: 0,
    description: "Learn about our flagship workforce development program for fathers.",
  },
  {
    id: "3",
    title: "Tech-Ready Youth Open House",
    type: "orientation",
    date: "April 25, 2024",
    time: "4:00 PM",
    location: "Forever Forward Center",
    price: 0,
    description: "Tour our facilities and meet instructors. For youth ages 16+ and parents.",
  },
  {
    id: "4",
    title: "Movies on the Menu: Superhero Double Feature",
    type: "movies_on_menu",
    date: "May 10, 2024",
    time: "4:00 PM - 10:00 PM",
    location: "Forever Forward Community Center",
    price: 35,
    description: "Double feature event with themed dinner. Black Panther + Spider-Verse!",
  },
  {
    id: "5",
    title: "Community Job Fair",
    type: "job_fair",
    date: "May 18, 2024",
    time: "10:00 AM - 3:00 PM",
    location: "TBD",
    price: 0,
    description: "Connect with employers looking to hire program graduates and community members.",
  },
];

const pastEventHighlights = [
  {
    title: "Movies on the Menu: Sonic Night",
    date: "March 2024",
    attendees: 68,
  },
  {
    title: "Father Forward Graduation - Cohort 4",
    date: "February 2024",
    attendees: 45,
  },
  {
    title: "Holiday Family Celebration",
    date: "December 2023",
    attendees: 120,
  },
];

const eventTypeLabels: Record<string, string> = {
  movies_on_menu: "Movies on the Menu",
  orientation: "Info Session",
  workshop: "Workshop",
  job_fair: "Job Fair",
  community: "Community Event",
};

export default function EventsPage() {
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
              <Calendar className="h-4 w-4 text-[#C9A84C]" />
              Community Events
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Where Families{" "}
              <span className="text-[#C9A84C]">Come Together</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              From our signature Movies on the Menu series to workshops and job
              fairs—our events create opportunities for connection, learning, and fun.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Featured Event */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-[#C9A84C] fill-[#C9A84C]" />
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                Featured Event
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#DDDDDD]"
          >
            <div className="grid lg:grid-cols-2">
              {/* Image Placeholder */}
              <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center">
                <div className="text-center text-[#1A1A1A]/80">
                  <Film className="h-16 w-16 mx-auto mb-4" />
                  <span className="font-semibold">Event Image</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-10">
                <Badge variant="gold" className="mb-4">
                  {eventTypeLabels[featuredEvent.type]}
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-4">
                  {featuredEvent.title}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-[#555555]">
                    <Calendar className="h-5 w-5 text-[#C9A84C]" />
                    <span>{featuredEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#555555]">
                    <Clock className="h-5 w-5 text-[#C9A84C]" />
                    <span>{featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#555555]">
                    <MapPin className="h-5 w-5 text-[#C9A84C]" />
                    <span>{featuredEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#555555]">
                    <Film className="h-5 w-5 text-[#C9A84C]" />
                    <span>Featuring: {featuredEvent.movie}</span>
                  </div>
                  <div className="flex items-start gap-3 text-[#555555]">
                    <Utensils className="h-5 w-5 text-[#C9A84C] mt-0.5" />
                    <span>{featuredEvent.menu}</span>
                  </div>
                </div>

                <p className="text-[#555555] leading-relaxed mb-6">
                  {featuredEvent.description}
                </p>

                <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-[#FBF6E9]">
                  <div>
                    <span className="text-2xl font-bold text-[#1A1A1A]">
                      ${featuredEvent.price}
                    </span>
                    <span className="text-[#888888] ml-1">per person</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#5A7247] font-medium">
                      {featuredEvent.spotsLeft} spots left
                    </span>
                    <span className="text-[#888888] text-sm block">
                      of {featuredEvent.capacity} total
                    </span>
                  </div>
                </div>

                <Button size="lg" className="w-full">
                  <Ticket className="h-5 w-5 mr-2" />
                  Get Tickets
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Mark your calendar for these community gatherings."
          />

          <div className="mt-12 space-y-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-colors group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Date Badge */}
                  <div className="shrink-0 w-20 h-20 rounded-xl bg-[#1A1A1A] flex flex-col items-center justify-center text-center">
                    <span className="text-[#C9A84C] text-sm font-medium">
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="text-white text-2xl font-bold">
                      {event.date.split(" ")[1].replace(",", "")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge
                          variant={
                            event.type === "movies_on_menu" ? "gold" : "default"
                          }
                          size="sm"
                          className="mb-2"
                        >
                          {eventTypeLabels[event.type]}
                        </Badge>
                        <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                          {event.title}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        {event.price === 0 ? (
                          <span className="text-[#5A7247] font-semibold">
                            Free
                          </span>
                        ) : (
                          <span className="text-[#1A1A1A] font-semibold">
                            ${event.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[#555555] mt-2">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#888888]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0">
                    <Button variant={event.price === 0 ? "secondary" : "default"}>
                      {event.price === 0 ? "Register" : "Get Tickets"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Movies on the Menu Spotlight */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                Our Signature Series
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
                Movies on the Menu
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                It started as a simple idea: what if movie night could be more
                than just a movie? What if it could be a full experience—a
                themed dinner, a community gathering, and quality time with the
                people who matter most?
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Every Movies on the Menu event pairs a family-friendly
                blockbuster with a custom dinner menu. We handle the cooking, the
                screening, and the details—you just show up ready to make
                memories.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Themed dinner included in ticket price",
                  "Family-style seating to encourage connection",
                  "Big-screen movie experience",
                  "Activities and games for kids",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <Star className="h-4 w-4 text-[#C9A84C] fill-[#C9A84C]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/get-involved/enroll">
                  Sign Up for Event Updates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center">
                <div className="text-center text-[#1A1A1A]/80">
                  <Film className="h-20 w-20 mx-auto mb-4" />
                  <span className="font-semibold text-lg">Event Gallery</span>
                </div>
              </div>
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FBF6E9] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A1A1A]">500+</p>
                    <p className="text-sm text-[#888888]">Attendees in 2024</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 lg:py-24 bg-[#F5F3EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Recent Event Highlights"
            subtitle="A look back at some of our favorite community moments."
            centered
          />

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {pastEventHighlights.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center border border-[#DDDDDD]"
              >
                <div className="w-16 h-16 rounded-full bg-[#FBF6E9] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#C9A84C]">
                    {event.attendees}
                  </span>
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-[#888888]">{event.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">
              Want to Host an Event With Us?
            </h2>
            <p className="text-[#555555] mb-8">
              We partner with organizations, sponsors, and community leaders to
              create impactful events. Let&apos;s talk about how we can collaborate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/partner">Become a Partner</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
