"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Building2,
  Heart,
  Ticket,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ReportType =
  | "program_outcomes"
  | "financial_summary"
  | "msp_service"
  | "donation_summary"
  | "event_attendance"
  | "workforce_utilization";

interface ReportConfig {
  id: ReportType;
  name: string;
  description: string;
  icon: typeof FileText;
  color: string;
  bg: string;
}

const reportTypes: ReportConfig[] = [
  {
    id: "program_outcomes",
    name: "Program Outcomes",
    description: "Enrollment, completion rates, certifications, demographics",
    icon: GraduationCap,
    color: "text-[#5A7247]",
    bg: "bg-[#EFF4EB]",
  },
  {
    id: "financial_summary",
    name: "Financial Summary",
    description: "Revenue by source, monthly trends, outstanding receivables",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: "msp_service",
    name: "MSP Service Report",
    description: "Clients served, revenue per client, SLA performance",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "donation_summary",
    name: "Donation Summary",
    description: "Donor stats, gift history, recurring vs one-time",
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    id: "event_attendance",
    name: "Event Attendance",
    description: "Event stats, ticket sales, check-in rates",
    icon: Ticket,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: "workforce_utilization",
    name: "Workforce Utilization",
    description: "Technician assignments, hours logged, availability",
    icon: Users,
    color: "text-[#C9A84C]",
    bg: "bg-[#FBF6E9]",
  },
];

// Sample data for charts
const programData = {
  enrollment: [
    { program: "Father Forward", enrolled: 45, completed: 38, rate: 84 },
    { program: "Tech-Ready Youth", enrolled: 32, completed: 28, rate: 88 },
    { program: "Making Moments", enrolled: 120, completed: 120, rate: 100 },
    { program: "Script to Screen", enrolled: 18, completed: 15, rate: 83 },
  ],
  certifications: { passed: 52, failed: 8, pending: 12 },
  demographics: {
    fathers: 45,
    youth: 32,
    families: 120,
    students: 18,
  },
};

const financialData = {
  revenue: {
    msp: 45000,
    donations: 12500,
    events: 3200,
    grants: 25000,
    total: 85700,
  },
  monthly: [
    { month: "Jan", amount: 12400 },
    { month: "Feb", amount: 15200 },
    { month: "Mar", amount: 18500 },
  ],
  outstanding: 8500,
};

const mspData = {
  clients: 12,
  mrr: 38000,
  avgRevenue: 3167,
  slaCompliance: 98.5,
};

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("program_outcomes");
  const [dateRange, setDateRange] = useState("this_month");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case "program_outcomes":
        return (
          <div className="space-y-6">
            {/* Enrollment by Program */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Enrollment by Program</h3>
              <div className="space-y-4">
                {programData.enrollment.map((program) => (
                  <div key={program.program} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#555555]">{program.program}</span>
                      <span className="text-sm text-[#888888]">
                        {program.completed}/{program.enrolled} completed ({program.rate}%)
                      </span>
                    </div>
                    <div className="h-3 bg-[#DDDDDD] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5A7247] rounded-full transition-all"
                        style={{ width: `${program.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Enrolled</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {programData.enrollment.reduce((sum, p) => sum + p.enrolled, 0)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Completed</p>
                <p className="text-2xl font-bold text-[#5A7247]">
                  {programData.enrollment.reduce((sum, p) => sum + p.completed, 0)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Certifications Passed</p>
                <p className="text-2xl font-bold text-[#C9A84C]">{programData.certifications.passed}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Pass Rate</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {Math.round(
                    (programData.certifications.passed /
                      (programData.certifications.passed + programData.certifications.failed)) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>

            {/* Demographics */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Participant Demographics</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(programData.demographics).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-[#FAFAF8] rounded-lg">
                    <p className="text-3xl font-bold text-[#C9A84C]">{value}</p>
                    <p className="text-sm text-[#888888] capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "financial_summary":
        return (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "MSP Revenue", value: financialData.revenue.msp, color: "text-blue-600" },
                { label: "Donations", value: financialData.revenue.donations, color: "text-pink-600" },
                { label: "Events", value: financialData.revenue.events, color: "text-purple-600" },
                { label: "Grants", value: financialData.revenue.grants, color: "text-green-600" },
                { label: "Total Revenue", value: financialData.revenue.total, color: "text-[#C9A84C]" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-[#DDDDDD] p-4"
                >
                  <p className="text-sm text-[#888888]">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>
                    ${item.value.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Revenue by Source Chart */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Revenue by Source</h3>
              <div className="flex items-end justify-around h-48 gap-4">
                {[
                  { label: "MSP", value: financialData.revenue.msp, color: "bg-blue-500" },
                  { label: "Grants", value: financialData.revenue.grants, color: "bg-green-500" },
                  { label: "Donations", value: financialData.revenue.donations, color: "bg-pink-500" },
                  { label: "Events", value: financialData.revenue.events, color: "bg-purple-500" },
                ].map((item) => {
                  const height = (item.value / financialData.revenue.msp) * 100;
                  return (
                    <div key={item.label} className="flex flex-col items-center gap-2 flex-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5 }}
                        className={`w-full max-w-16 ${item.color} rounded-t`}
                      />
                      <span className="text-xs text-[#888888]">{item.label}</span>
                      <span className="text-sm font-semibold">${(item.value / 1000).toFixed(1)}k</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Monthly Revenue Trend</h3>
              <div className="flex items-end justify-around h-32 gap-4">
                {financialData.monthly.map((month, i) => {
                  const height = (month.amount / 20000) * 100;
                  return (
                    <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="w-full max-w-20 bg-[#C9A84C] rounded-t"
                      />
                      <span className="text-sm text-[#888888]">{month.month}</span>
                      <span className="text-sm font-semibold">${(month.amount / 1000).toFixed(1)}k</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outstanding */}
            <div className="bg-[#FBF6E9] rounded-xl border border-[#C9A84C]/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#555555]">Outstanding Receivables</p>
                  <p className="text-2xl font-bold text-[#C9A84C]">
                    ${financialData.outstanding.toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        );

      case "msp_service":
        return (
          <div className="space-y-6">
            {/* MSP Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Clients", value: mspData.clients, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Monthly Recurring", value: `$${mspData.mrr.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                { label: "Avg Revenue/Client", value: `$${mspData.avgRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-[#C9A84C]", bg: "bg-[#FBF6E9]" },
                { label: "SLA Compliance", value: `${mspData.slaCompliance}%`, icon: BarChart3, color: "text-[#5A7247]", bg: "bg-[#EFF4EB]" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-[#DDDDDD] p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#888888]">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Client Revenue Breakdown */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Revenue by Client</h3>
              <div className="space-y-4">
                {[
                  { name: "LA Youth Services", revenue: 8500 },
                  { name: "Watts Community Center", revenue: 6200 },
                  { name: "Compton Unified", revenue: 5800 },
                  { name: "South LA Health", revenue: 4500 },
                  { name: "Others (8)", revenue: 13000 },
                ].map((client, i) => (
                  <div key={client.name} className="flex items-center justify-between">
                    <span className="text-sm text-[#555555]">{client.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(client.revenue / 8500) * 100}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="h-full bg-[#5A7247] rounded-full"
                        />
                      </div>
                      <span className="text-sm font-semibold w-20 text-right">
                        ${client.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-12 text-center">
            <FileText className="h-12 w-12 text-[#888888] mx-auto mb-4" />
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Report Coming Soon</h3>
            <p className="text-[#888888]">
              This report type is under development. Check back soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Reports</h1>
          <p className="text-[#555555]">Generate and export organizational reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Data
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report, index) => (
          <motion.button
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedReport(report.id)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedReport === report.id
                ? "border-[#C9A84C] bg-[#FBF6E9] shadow-md"
                : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${report.bg}`}>
                <report.icon className={`h-5 w-5 ${report.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A1A]">{report.name}</h3>
                <p className="text-sm text-[#888888] mt-1">{report.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#888888]">
            <Calendar className="h-4 w-4" />
            <span>Date Range:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "this_month", label: "This Month" },
              { value: "last_month", label: "Last Month" },
              { value: "this_quarter", label: "This Quarter" },
              { value: "this_year", label: "This Year" },
              { value: "all_time", label: "All Time" },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range.value
                    ? "bg-[#C9A84C] text-[#1A1A1A]"
                    : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <motion.div
        key={selectedReport}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderReportContent()}
      </motion.div>

      {/* Export Options */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#888888]">Export as:</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Schedule Report
            </Button>
            <Button variant="outline" size="sm">
              Email Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
