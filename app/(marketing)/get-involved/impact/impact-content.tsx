"use client";

import { motion } from "framer-motion";
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
  UserCheck,
  Laptop,
  Film,
  Baby,
  Crown,
  Star,
} from "lucide-react";
import type { ImpactMetric, DonationAllocation } from "@/types/database";

interface ImpactContentProps {
  metrics: ImpactMetric[];
  allocation: DonationAllocation | null;
  tierStats: {
    founding: number;
    champion: number;
    supporter: number;
    friend: number;
    total: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ImpactContent({ metrics, allocation, tierStats }: ImpactContentProps) {
  // Format metrics by type
  const getMetricsByType = (type: string) => metrics.filter(m => m.metric_type === type);
  const programMetrics = getMetricsByType("program_outcome");
  const communityMetrics = getMetricsByType("community_impact");
  const financialMetrics = getMetricsByType("financial");

  // Get icon for metric
  const getMetricIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("graduate") || nameLower.includes("cert")) return GraduationCap;
    if (nameLower.includes("employ") || nameLower.includes("job")) return Briefcase;
    if (nameLower.includes("father") || nameLower.includes("dad")) return UserCheck;
    if (nameLower.includes("famil") || nameLower.includes("child")) return Users;
    if (nameLower.includes("event") || nameLower.includes("movie")) return Film;
    if (nameLower.includes("youth") || nameLower.includes("student")) return Baby;
    if (nameLower.includes("tech") || nameLower.includes("laptop")) return Laptop;
    if (nameLower.includes("client") || nameLower.includes("business")) return Building2;
    return Target;
  };

  // Sample impact stats if no metrics in DB
  const defaultStats = [
    { name: "Program Graduates", value: "150+", icon: GraduationCap, description: "Fathers and youth who completed our programs" },
    { name: "Families Served", value: "500+", icon: Users, description: "Families reached through events and programs" },
    { name: "Employment Rate", value: "85%", icon: Briefcase, description: "Graduates who secured IT positions" },
    { name: "Community Events", value: "25+", icon: Calendar, description: "Movies on the Menu and workshops hosted" },
  ];

  const hasRealMetrics = metrics.length > 0;

  return (
    <>
      {/* Key Impact Numbers */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
              Impact at a Glance
            </h2>
            <p className="text-[#555555] max-w-2xl mx-auto">
              Real numbers, real lives changed. These metrics represent the tangible
              outcomes of your generous support.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {hasRealMetrics ? (
              metrics.slice(0, 8).map((metric) => {
                const Icon = getMetricIcon(metric.metric_name);
                return (
                  <motion.div
                    key={metric.id}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FBF6E9] flex items-center justify-center mb-4 group-hover:bg-[#C9A84C] transition-colors">
                      <Icon className="h-6 w-6 text-[#C9A84C] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-4xl font-bold text-[#1A1A1A] mb-2">
                      {metric.metric_value.toLocaleString()}
                      {metric.metric_unit && (
                        <span className="text-lg text-[#888888] font-normal ml-1">
                          {metric.metric_unit}
                        </span>
                      )}
                    </p>
                    <p className="font-semibold text-[#1A1A1A] mb-1">{metric.metric_name}</p>
                    {metric.description && (
                      <p className="text-sm text-[#888888]">{metric.description}</p>
                    )}
                  </motion.div>
                );
              })
            ) : (
              defaultStats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FBF6E9] flex items-center justify-center mb-4 group-hover:bg-[#C9A84C] transition-colors">
                    <stat.icon className="h-6 w-6 text-[#C9A84C] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-4xl font-bold text-[#1A1A1A] mb-2">{stat.value}</p>
                  <p className="font-semibold text-[#1A1A1A] mb-1">{stat.name}</p>
                  <p className="text-sm text-[#888888]">{stat.description}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Fund Allocation */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                Where Your Dollar Goes
              </h2>
              <p className="text-[#555555] mb-8">
                We believe in transparency. Here&apos;s exactly how we allocate every dollar
                you contribute to Forever Forward.
              </p>

              {/* Allocation Breakdown */}
              <div className="space-y-4">
                {[
                  {
                    name: "Programs",
                    percent: allocation?.programs_percent || 70,
                    amount: allocation?.programs_amount || null,
                    color: "bg-[#5A7247]",
                    description: "Direct support for Father Forward, Tech-Ready Youth, and all educational programs",
                  },
                  {
                    name: "Operations",
                    percent: allocation?.operations_percent || 15,
                    amount: allocation?.operations_amount || null,
                    color: "bg-[#C9A84C]",
                    description: "Facilities, equipment, and program materials",
                  },
                  {
                    name: "Community Events",
                    percent: allocation?.events_percent || 10,
                    amount: allocation?.events_amount || null,
                    color: "bg-[#7A9A63]",
                    description: "Movies on the Menu, workshops, and family gatherings",
                  },
                  {
                    name: "Administration",
                    percent: allocation?.admin_percent || 5,
                    amount: allocation?.admin_amount || null,
                    color: "bg-[#A68A2E]",
                    description: "Essential overhead and compliance",
                  },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#1A1A1A]">{item.name}</span>
                      <span className="text-[#555555]">
                        {item.percent}%
                        {item.amount && (
                          <span className="text-[#888888] text-sm ml-2">
                            (${item.amount.toLocaleString()})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-3 bg-[#EEEEEE] rounded-full overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                    <p className="text-sm text-[#888888]">{item.description}</p>
                  </div>
                ))}
              </div>

              {allocation && (
                <p className="mt-6 text-sm text-[#888888]">
                  Based on allocation period: {new Date(allocation.period_start).toLocaleDateString()} -{" "}
                  {new Date(allocation.period_end).toLocaleDateString()}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Visual Pie Chart Representation */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Donut Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Programs - 70% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#5A7247"
                    strokeWidth="20"
                    strokeDasharray={`${(allocation?.programs_percent || 70) * 2.2} 220`}
                    strokeDashoffset="0"
                    className="transition-all duration-1000"
                  />
                  {/* Operations - 15% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="20"
                    strokeDasharray={`${(allocation?.operations_percent || 15) * 2.2} 220`}
                    strokeDashoffset={`${-((allocation?.programs_percent || 70) * 2.2)}`}
                    className="transition-all duration-1000"
                  />
                  {/* Events - 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#7A9A63"
                    strokeWidth="20"
                    strokeDasharray={`${(allocation?.events_percent || 10) * 2.2} 220`}
                    strokeDashoffset={`${-(((allocation?.programs_percent || 70) + (allocation?.operations_percent || 15)) * 2.2)}`}
                    className="transition-all duration-1000"
                  />
                  {/* Admin - 5% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#A68A2E"
                    strokeWidth="20"
                    strokeDasharray={`${(allocation?.admin_percent || 5) * 2.2} 220`}
                    strokeDashoffset={`${-(((allocation?.programs_percent || 70) + (allocation?.operations_percent || 15) + (allocation?.events_percent || 10)) * 2.2)}`}
                    className="transition-all duration-1000"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-[#1A1A1A]">
                      {allocation?.programs_percent || 70}%
                    </p>
                    <p className="text-[#555555]">to Programs</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donor Community */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
              Our Donor Community
            </h2>
            <p className="text-[#555555] max-w-2xl mx-auto">
              Thank you to every donor who believes in our mission. Together, we&apos;re
              building a movement for economic empowerment.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                tier: "Founding Partners",
                count: tierStats.founding,
                icon: Crown,
                color: "bg-gradient-to-br from-[#C9A84C] to-[#A68A2E]",
                textColor: "text-white",
                description: "$10,000+/year",
              },
              {
                tier: "Champions",
                count: tierStats.champion,
                icon: Award,
                color: "bg-gradient-to-br from-[#5A7247] to-[#3D5030]",
                textColor: "text-white",
                description: "$2,500+/year",
              },
              {
                tier: "Supporters",
                count: tierStats.supporter,
                icon: Star,
                color: "bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A]",
                textColor: "text-white",
                description: "$500+/year",
              },
              {
                tier: "Friends",
                count: tierStats.friend,
                icon: Heart,
                color: "bg-white border-2 border-[#DDDDDD]",
                textColor: "text-[#1A1A1A]",
                description: "All Contributors",
              },
            ].map((tier, index) => (
              <motion.div
                key={tier.tier}
                variants={itemVariants}
                className={`rounded-2xl p-6 ${tier.color} hover:shadow-xl transition-all`}
              >
                <tier.icon className={`h-10 w-10 ${tier.textColor} mb-4 ${tier.tier === "Friends" ? "text-[#C9A84C]" : ""}`} />
                <p className={`text-4xl font-bold ${tier.textColor} mb-1`}>
                  {tier.count > 0 ? tier.count : "-"}
                </p>
                <p className={`font-semibold ${tier.textColor} mb-1`}>{tier.tier}</p>
                <p className={`text-sm ${tier.textColor} opacity-70`}>{tier.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Program Outcomes */}
      {programMetrics.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                Program Outcomes
              </h2>
              <p className="text-[#555555] max-w-2xl mx-auto">
                Measuring success through real career placements, certifications earned,
                and families strengthened.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {programMetrics.map((metric) => {
                const Icon = getMetricIcon(metric.metric_name);
                return (
                  <motion.div
                    key={metric.id}
                    variants={itemVariants}
                    className="bg-[#FAFAF8] rounded-2xl p-6 border border-[#DDDDDD]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#EFF4EB] flex items-center justify-center shrink-0">
                        <Icon className="h-7 w-7 text-[#5A7247]" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-[#1A1A1A]">
                          {metric.metric_value.toLocaleString()}
                          {metric.metric_unit && <span className="text-lg text-[#888888]"> {metric.metric_unit}</span>}
                        </p>
                        <p className="font-semibold text-[#1A1A1A]">{metric.metric_name}</p>
                        {metric.description && (
                          <p className="text-sm text-[#888888] mt-1">{metric.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
