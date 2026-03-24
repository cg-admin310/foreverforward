"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Bot,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  Award,
  Target,
  BookOpen,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const sampleParticipant = {
  id: "1",
  first_name: "Marcus",
  last_name: "Johnson",
  email: "marcus.j@email.com",
  phone: "(323) 555-0123",
  program: "father_forward",
  cohort: "Cohort 12",
  status: "active",
  current_week: 6,
  assigned_to: "TJ Wilform",
  enrollment_date: "2026-02-01",
  expected_graduation: "2026-03-29",
  certifications: [
    { name: "Google IT Support Certificate", status: "in_progress", progress: 65 },
    { name: "CompTIA A+", status: "not_started", progress: 0 },
  ],
  path_forward_plan: {
    career_goal: "IT Support Technician",
    short_term_goals: [
      { goal: "Complete Week 6 coursework", completed: false },
      { goal: "Pass CompTIA A+ practice exam", completed: false },
      { goal: "Schedule Google Cert exam", completed: false },
    ],
    long_term_goals: [
      { goal: "Obtain Google IT Support Certificate", completed: false },
      { goal: "Secure internship with MSP client", completed: false },
      { goal: "Full-time IT Support position", completed: false },
    ],
    barriers: ["Transportation to testing center", "Childcare during evening classes"],
    support_plan:
      "Connect with A New Day Foundation for laptop donation. Explore remote testing options for certifications.",
  },
  travis_summary: {
    last_interaction: "2 days ago",
    sentiment: "positive",
    key_topics: ["Certification prep", "Work-life balance", "Childcare challenges"],
    escalation_needed: false,
  },
  children: [
    { name: "Jayden", age: 8, relationship: "son" },
    { name: "Aaliyah", age: 5, relationship: "daughter" },
  ],
};

const checkins = [
  {
    id: 1,
    date: "Mar 20, 2026",
    type: "weekly",
    notes:
      "Marcus is making great progress. Completed Week 5 assignments ahead of schedule. Expressed some concerns about balancing study time with parenting responsibilities. Discussed strategies for time management.",
    case_worker: "TJ Wilform",
  },
  {
    id: 2,
    date: "Mar 13, 2026",
    type: "weekly",
    notes:
      "Good session. Marcus passed the Week 4 assessment with 85%. He's engaged and asking good questions. Connected him with childcare resources from our partner network.",
    case_worker: "TJ Wilform",
  },
];

const activities = [
  { id: 1, message: "Completed Week 5 module assessment", time: "Mar 18, 2026", type: "achievement" },
  { id: 2, message: "Travis check-in: Discussed certification prep strategy", time: "Mar 17, 2026", type: "travis" },
  { id: 3, message: "Submitted homework assignment", time: "Mar 15, 2026", type: "progress" },
  { id: 4, message: "Attended live session: Networking Fundamentals", time: "Mar 14, 2026", type: "attendance" },
];

const documents = [
  { id: 1, name: "Enrollment Agreement", type: "pdf", date: "Feb 1, 2026" },
  { id: 2, name: "Week 4 Assessment Results", type: "pdf", date: "Mar 13, 2026" },
];

type TabType = "overview" | "path_forward" | "checkins" | "travis" | "certifications" | "documents" | "activity";

export default function ParticipantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [newCheckin, setNewCheckin] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "at_risk":
        return "bg-red-100 text-red-600";
      case "graduated":
        return "bg-[#EFF4EB] text-[#5A7247]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "path_forward", label: "Path Forward" },
    { key: "checkins", label: "Check-ins" },
    { key: "travis", label: "Travis AI" },
    { key: "certifications", label: "Certifications" },
    { key: "documents", label: "Documents" },
    { key: "activity", label: "Activity" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/program-management/participants"
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Participants
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-bold text-2xl">
              {sampleParticipant.first_name.charAt(0)}
              {sampleParticipant.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                {sampleParticipant.first_name} {sampleParticipant.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs font-medium rounded-full">
                  Father Forward
                </span>
                <span className="text-sm text-[#555555]">{sampleParticipant.cohort}</span>
                <span className="text-[#888888]">•</span>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    sampleParticipant.status
                  )}`}
                >
                  {sampleParticipant.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Check-in
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#1A1A1A]">Program Progress</span>
          <span className="text-sm text-[#888888]">
            Week {sampleParticipant.current_week} of 8
          </span>
        </div>
        <div className="h-3 bg-[#DDDDDD] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C9A84C] to-[#5A7247] rounded-full transition-all"
            style={{ width: `${(sampleParticipant.current_week / 8) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#888888]">
          <span>Started: {new Date(sampleParticipant.enrollment_date).toLocaleDateString()}</span>
          <span>Expected Graduation: {new Date(sampleParticipant.expected_graduation).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#DDDDDD] overflow-x-auto">
        <nav className="flex gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#C9A84C] text-[#C9A84C]"
                  : "border-transparent text-[#888888] hover:text-[#555555]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Mail className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Email</p>
                      <p className="text-sm text-[#1A1A1A]">{sampleParticipant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Phone className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Phone</p>
                      <p className="text-sm text-[#1A1A1A]">{sampleParticipant.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Family Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Family</h2>
                <div className="space-y-3">
                  {sampleParticipant.children.map((child, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#EFF4EB] flex items-center justify-center text-[#5A7247] font-semibold">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{child.name}</p>
                        <p className="text-xs text-[#888888]">
                          {child.age} years old • {child.relationship}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-[#DDDDDD]"
              >
                <div className="p-4 border-b border-[#DDDDDD]">
                  <h2 className="font-semibold text-[#1A1A1A]">Recent Activity</h2>
                </div>
                <div className="divide-y divide-[#DDDDDD]">
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="p-4 flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activity.type === "travis"
                            ? "bg-[#FBF6E9] text-[#C9A84C]"
                            : activity.type === "achievement"
                            ? "bg-[#EFF4EB] text-[#5A7247]"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {activity.type === "travis" ? (
                          <Bot className="h-4 w-4" />
                        ) : activity.type === "achievement" ? (
                          <Award className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-[#1A1A1A]">{activity.message}</p>
                        <p className="text-xs text-[#888888] mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "path_forward" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Career Goal */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-[#C9A84C]" />
                  <h2 className="font-semibold text-[#1A1A1A]">Career Goal</h2>
                </div>
                <p className="text-lg font-medium text-[#1A1A1A]">
                  {sampleParticipant.path_forward_plan.career_goal}
                </p>
              </div>

              {/* Short-term Goals */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Short-term Goals</h2>
                <div className="space-y-3">
                  {sampleParticipant.path_forward_plan.short_term_goals.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-lg">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.completed ? "bg-[#5A7247]" : "bg-[#DDDDDD]"
                        }`}
                      >
                        {item.completed && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <span className={`text-sm ${item.completed ? "text-[#888888] line-through" : "text-[#1A1A1A]"}`}>
                        {item.goal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-term Goals */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Long-term Goals</h2>
                <div className="space-y-3">
                  {sampleParticipant.path_forward_plan.long_term_goals.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-lg">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.completed ? "bg-[#5A7247]" : "bg-[#DDDDDD]"
                        }`}
                      >
                        {item.completed && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <span className={`text-sm ${item.completed ? "text-[#888888] line-through" : "text-[#1A1A1A]"}`}>
                        {item.goal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Barriers & Support */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Barriers & Support Plan</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#888888] mb-2">Identified Barriers</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleParticipant.path_forward_plan.barriers.map((barrier, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full"
                        >
                          {barrier}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#888888] mb-2">Support Plan</p>
                    <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                      {sampleParticipant.path_forward_plan.support_plan}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "checkins" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Add Check-in */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Add Check-in Note</h2>
                <Textarea
                  placeholder="Record your check-in notes..."
                  value={newCheckin}
                  onChange={(e) => setNewCheckin(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <Button size="sm" disabled={!newCheckin.trim()}>
                    Save Check-in
                  </Button>
                </div>
              </div>

              {/* Check-in History */}
              <div className="bg-white rounded-xl border border-[#DDDDDD]">
                <div className="p-4 border-b border-[#DDDDDD]">
                  <h2 className="font-semibold text-[#1A1A1A]">Check-in History</h2>
                </div>
                <div className="divide-y divide-[#DDDDDD]">
                  {checkins.map((checkin) => (
                    <div key={checkin.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#888888]" />
                          <span className="text-sm font-medium text-[#1A1A1A]">{checkin.date}</span>
                          <span className="px-2 py-0.5 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded-full capitalize">
                            {checkin.type}
                          </span>
                        </div>
                        <span className="text-xs text-[#888888]">{checkin.case_worker}</span>
                      </div>
                      <p className="text-sm text-[#555555]">{checkin.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "travis" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Travis Summary */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-[#C9A84C]" />
                  <h2 className="font-semibold text-[#1A1A1A]">Travis AI Summary</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Last Interaction</p>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {sampleParticipant.travis_summary.last_interaction}
                    </p>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Overall Sentiment</p>
                    <p className="text-sm font-medium text-green-600 capitalize">
                      {sampleParticipant.travis_summary.sentiment}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-[#888888] mb-2">Key Topics Discussed</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleParticipant.travis_summary.key_topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#FBF6E9] text-[#C9A84C] text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Conversation */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6 text-center">
                <Bot className="h-12 w-12 text-[#C9A84C] mx-auto mb-3" />
                <h3 className="font-medium text-[#1A1A1A] mb-2">Travis Conversation History</h3>
                <p className="text-sm text-[#888888] mb-4">
                  View the full conversation between this participant and Travis AI
                </p>
                <Button>View Full Conversation</Button>
              </div>
            </motion.div>
          )}

          {activeTab === "certifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD]">
                <h2 className="font-semibold text-[#1A1A1A]">Certifications</h2>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {sampleParticipant.certifications.map((cert, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#C9A84C]" />
                        <span className="font-medium text-[#1A1A1A]">{cert.name}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          cert.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : cert.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cert.status.replace("_", " ")}
                      </span>
                    </div>
                    {cert.status === "in_progress" && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5A7247] rounded-full"
                            style={{ width: `${cert.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#888888]">{cert.progress}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                <h2 className="font-semibold text-[#1A1A1A]">Documents</h2>
                <Button variant="outline" size="sm">
                  Upload Document
                </Button>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <FileText className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1A1A1A]">{doc.name}</p>
                        <p className="text-xs text-[#888888]">{doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD]">
                <h2 className="font-semibold text-[#1A1A1A]">Activity Timeline</h2>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "travis"
                          ? "bg-[#FBF6E9] text-[#C9A84C]"
                          : activity.type === "achievement"
                          ? "bg-[#EFF4EB] text-[#5A7247]"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {activity.type === "travis" ? (
                        <Bot className="h-4 w-4" />
                      ) : activity.type === "achievement" ? (
                        <Award className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#1A1A1A]">{activity.message}</p>
                      <p className="text-xs text-[#888888] mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Worker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Case Worker</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-semibold">
                TW
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{sampleParticipant.assigned_to}</p>
                <p className="text-xs text-[#888888]">Case Worker</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Attendance</span>
                <span className="text-sm font-semibold text-[#5A7247]">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Assignment Completion</span>
                <span className="text-sm font-semibold text-[#5A7247]">88%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Assessment Avg</span>
                <span className="text-sm font-semibold text-[#C9A84C]">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Travis Interactions</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">12</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Mail className="h-4 w-4" />
                Send Email
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Phone className="h-4 w-4" />
                Call Participant
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Award className="h-4 w-4" />
                Generate Certificate
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <FileText className="h-4 w-4" />
                Generate Progress Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
