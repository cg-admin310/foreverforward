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
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProgramOutcomesReport,
  FinancialSummaryReport,
  MspServiceReport,
  DonationSummaryReport,
  EventAttendanceReport,
} from "@/lib/actions/reports";

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

interface ReportsClientProps {
  programOutcomes: ProgramOutcomesReport | null;
  financialSummary: FinancialSummaryReport | null;
  mspService: MspServiceReport | null;
  donationSummary: DonationSummaryReport | null;
  eventAttendance: EventAttendanceReport | null;
}

export function ReportsClient({
  programOutcomes,
  financialSummary,
  mspService,
  donationSummary,
  eventAttendance,
}: ReportsClientProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType>("program_outcomes");
  const [dateRange, setDateRange] = useState("all_time");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // In production, this would re-fetch data with the selected date range
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const handleExportPDF = () => {
    // In production, this would generate a PDF of the current report
    alert("PDF export coming soon!");
  };

  const handleExportCSV = () => {
    // In production, this would export data as CSV
    alert("CSV export coming soon!");
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case "program_outcomes":
        if (!programOutcomes) {
          return <EmptyState message="No program data available" />;
        }
        return (
          <div className="space-y-6">
            {/* Enrollment by Program */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Enrollment by Program</h3>
              {programOutcomes.enrollmentByProgram.length > 0 ? (
                <div className="space-y-4">
                  {programOutcomes.enrollmentByProgram.map((program) => (
                    <div key={program.program} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#555555]">{program.programName}</span>
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
              ) : (
                <p className="text-sm text-[#888888]">No enrollment data yet</p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Enrolled</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {programOutcomes.totalEnrolled}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Completed</p>
                <p className="text-2xl font-bold text-[#5A7247]">
                  {programOutcomes.totalCompleted}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Currently Active</p>
                <p className="text-2xl font-bold text-[#C9A84C]">{programOutcomes.totalActive}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Certifications Passed</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {programOutcomes.certificationsPassed}
                </p>
              </div>
            </div>

            {/* Certification Stats */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Certification Performance</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{programOutcomes.certificationsPassed}</p>
                  <p className="text-sm text-[#888888]">Passed</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-600">{programOutcomes.certificationsFailed}</p>
                  <p className="text-sm text-[#888888]">Failed</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">{programOutcomes.certificationsPending}</p>
                  <p className="text-sm text-[#888888]">Pending</p>
                </div>
                <div className="text-center p-4 bg-[#FBF6E9] rounded-lg">
                  <p className="text-3xl font-bold text-[#C9A84C]">{programOutcomes.passRate}%</p>
                  <p className="text-sm text-[#888888]">Pass Rate</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "financial_summary":
        if (!financialSummary) {
          return <EmptyState message="No financial data available" />;
        }
        return (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "MSP Revenue", value: financialSummary.revenue.msp, color: "text-blue-600" },
                { label: "Donations", value: financialSummary.revenue.donations, color: "text-pink-600" },
                { label: "Events", value: financialSummary.revenue.events, color: "text-purple-600" },
                { label: "Total Revenue", value: financialSummary.revenue.total, color: "text-[#C9A84C]" },
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
              {financialSummary.revenue.total > 0 ? (
                <div className="flex items-end justify-around h-48 gap-4">
                  {[
                    { label: "MSP", value: financialSummary.revenue.msp, color: "bg-blue-500" },
                    { label: "Donations", value: financialSummary.revenue.donations, color: "bg-pink-500" },
                    { label: "Events", value: financialSummary.revenue.events, color: "bg-purple-500" },
                  ].map((item) => {
                    const maxValue = Math.max(
                      financialSummary.revenue.msp,
                      financialSummary.revenue.donations,
                      financialSummary.revenue.events
                    );
                    const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
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
              ) : (
                <p className="text-sm text-[#888888] text-center py-8">No revenue data yet</p>
              )}
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Monthly Revenue Trend</h3>
              {financialSummary.monthlyTrend.some((m) => m.amount > 0) ? (
                <div className="flex items-end justify-around h-32 gap-4">
                  {financialSummary.monthlyTrend.map((month, i) => {
                    const maxAmount = Math.max(...financialSummary.monthlyTrend.map((m) => m.amount));
                    const height = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
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
              ) : (
                <p className="text-sm text-[#888888] text-center py-8">No monthly data yet</p>
              )}
            </div>

            {/* Outstanding & Donors */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#FBF6E9] rounded-xl border border-[#C9A84C]/30 p-4">
                <p className="text-sm text-[#555555]">Outstanding Receivables</p>
                <p className="text-2xl font-bold text-[#C9A84C]">
                  ${financialSummary.outstanding.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#EFF4EB] rounded-xl border border-[#5A7247]/30 p-4">
                <p className="text-sm text-[#555555]">Recurring Donors</p>
                <p className="text-2xl font-bold text-[#5A7247]">
                  {financialSummary.recurringDonors}
                </p>
              </div>
            </div>
          </div>
        );

      case "msp_service":
        if (!mspService) {
          return <EmptyState message="No MSP service data available" />;
        }
        return (
          <div className="space-y-6">
            {/* MSP Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Clients", value: mspService.activeClients, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Monthly Recurring", value: `$${mspService.mrr.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                { label: "Avg Revenue/Client", value: `$${mspService.avgRevenuePerClient.toLocaleString()}`, icon: TrendingUp, color: "text-[#C9A84C]", bg: "bg-[#FBF6E9]" },
                { label: "Pipeline Value", value: `$${mspService.pipelineValue.toLocaleString()}`, icon: BarChart3, color: "text-[#5A7247]", bg: "bg-[#EFF4EB]" },
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
              {mspService.clientsByRevenue.length > 0 ? (
                <div className="space-y-4">
                  {mspService.clientsByRevenue.map((client, i) => {
                    const maxRevenue = Math.max(...mspService.clientsByRevenue.map((c) => c.revenue));
                    return (
                      <div key={client.name} className="flex items-center justify-between">
                        <span className="text-sm text-[#555555]">{client.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(client.revenue / maxRevenue) * 100}%` }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="h-full bg-[#5A7247] rounded-full"
                            />
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">
                            ${client.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#888888]">No client revenue data yet</p>
              )}
            </div>

            {/* Pipeline Stats */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#555555]">Leads in Pipeline</p>
                  <p className="text-xl font-bold text-[#1A1A1A]">{mspService.leadsInPipeline}</p>
                </div>
                <div>
                  <p className="text-sm text-[#555555]">Estimated Pipeline Value</p>
                  <p className="text-xl font-bold text-[#C9A84C]">${mspService.pipelineValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "donation_summary":
        if (!donationSummary) {
          return <EmptyState message="No donation data available" />;
        }
        return (
          <div className="space-y-6">
            {/* Donation Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Donations</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{donationSummary.totalDonations}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Amount</p>
                <p className="text-2xl font-bold text-[#C9A84C]">${donationSummary.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Recurring Donors</p>
                <p className="text-2xl font-bold text-pink-600">{donationSummary.recurringDonors}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Average Donation</p>
                <p className="text-2xl font-bold text-[#5A7247]">${donationSummary.avgDonation.toLocaleString()}</p>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Monthly Donations</h3>
              {donationSummary.donationsByMonth.some((m) => m.amount > 0) ? (
                <div className="flex items-end justify-around h-32 gap-4">
                  {donationSummary.donationsByMonth.map((month, i) => {
                    const maxAmount = Math.max(...donationSummary.donationsByMonth.map((m) => m.amount));
                    const height = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
                    return (
                      <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="w-full max-w-20 bg-pink-500 rounded-t"
                        />
                        <span className="text-sm text-[#888888]">{month.month}</span>
                        <span className="text-xs font-semibold">${(month.amount / 1000).toFixed(1)}k ({month.count})</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#888888] text-center py-8">No donation data yet</p>
              )}
            </div>

            {/* Top Donors */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Top Donors</h3>
              {donationSummary.topDonors.length > 0 ? (
                <div className="space-y-4">
                  {donationSummary.topDonors.map((donor, i) => (
                    <div key={donor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[#555555]">{donor.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-[#888888]">{donor.count} gifts</span>
                        <span className="text-sm font-semibold text-[#C9A84C]">
                          ${donor.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#888888]">No donor data yet</p>
              )}
            </div>
          </div>
        );

      case "event_attendance":
        if (!eventAttendance) {
          return <EmptyState message="No event data available" />;
        }
        return (
          <div className="space-y-6">
            {/* Event Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Events</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{eventAttendance.totalEvents}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Total Attendees</p>
                <p className="text-2xl font-bold text-purple-600">{eventAttendance.totalAttendees}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Ticket Revenue</p>
                <p className="text-2xl font-bold text-[#C9A84C]">${eventAttendance.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <p className="text-sm text-[#888888]">Avg Attendance</p>
                <p className="text-2xl font-bold text-[#5A7247]">{eventAttendance.avgAttendance}</p>
              </div>
            </div>

            {/* Event List */}
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Recent Events</h3>
              {eventAttendance.eventStats.length > 0 ? (
                <div className="space-y-4">
                  {eventAttendance.eventStats.map((event) => (
                    <div key={event.name} className="flex items-center justify-between py-2 border-b border-[#DDDDDD] last:border-0">
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{event.name}</p>
                        <p className="text-sm text-[#888888]">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-600">{event.attendees}</p>
                          <p className="text-xs text-[#888888]">attendees</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#C9A84C]">${event.revenue.toLocaleString()}</p>
                          <p className="text-xs text-[#888888]">revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#888888]">No event data yet</p>
              )}
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
          <Button onClick={handleExportPDF}>
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
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#DDDDDD] p-12 text-center">
      <FileText className="h-12 w-12 text-[#888888] mx-auto mb-4" />
      <h3 className="font-semibold text-[#1A1A1A] mb-2">No Data Yet</h3>
      <p className="text-[#888888]">{message}</p>
    </div>
  );
}
