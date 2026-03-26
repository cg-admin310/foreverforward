import { Suspense } from "react";
import Link from "next/link";
import {
  Heart,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImpactMetrics, getCurrentAllocation, getDonorTierStats } from "@/lib/actions/donations";
import { ImpactContent } from "./impact-content";

export const metadata = {
  title: "Impact Dashboard | Forever Forward",
  description:
    "See how your donations are making a difference. Track the real-world impact of Forever Forward programs on fathers, families, and communities in Los Angeles.",
  keywords: [
    "nonprofit impact",
    "donation transparency",
    "community impact",
    "workforce development",
    "father engagement",
  ],
};

// Loading skeleton
function ImpactSkeleton() {
  return (
    <div className="animate-pulse space-y-8 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="mt-12 h-64 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default async function ImpactDashboardPage() {
  const [metricsResult, allocationResult, tierStatsResult] = await Promise.all([
    getImpactMetrics(),
    getCurrentAllocation(),
    getDonorTierStats(),
  ]);

  const metrics = metricsResult.data || [];
  const allocation = allocationResult.data || null;
  const tierStats = tierStatsResult.data || { founding: 0, champion: 0, supporter: 0, friend: 0, total: 0 };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#C9A84C]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#5A7247]/5 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Target className="h-4 w-4 text-[#C9A84C]" />
              Transparency Report
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Impact,{" "}
              <span className="text-[#C9A84C]">Measured</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              Every dollar you invest in Forever Forward creates real, measurable change.
              See exactly where your support goes and the lives you&apos;re helping transform.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Impact Content */}
      <Suspense fallback={<ImpactSkeleton />}>
        <ImpactContent
          metrics={metrics}
          allocation={allocation}
          tierStats={tierStats}
        />
      </Suspense>

      {/* Join Our Donor Community */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join {tierStats.total > 0 ? tierStats.total : "Our"} Donors Making a Difference
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Your investment helps Black fathers build careers in tech, supports families through
              community events, and creates pathways to economic stability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/donate">
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/contact">
                  Become a Partner
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Commitment */}
      <section className="py-16 lg:py-20 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <Sparkles className="h-8 w-8 text-[#C9A84C] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">
              Our Transparency Commitment
            </h2>
            <p className="text-[#555555] leading-relaxed">
              As a 501(c)(3) nonprofit, we believe in complete financial transparency.
              This dashboard is updated regularly with real data from our programs.
              Have questions? We&apos;re always happy to provide additional details about
              how your contributions are being used.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="text-[#C9A84C] hover:text-[#A68A2E] font-semibold inline-flex items-center gap-1"
              >
                Contact us for more details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
