"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Search,
  AlertTriangle,
  MessageSquare,
  User,
  Clock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Shield,
  Zap,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TravisAlert {
  id: string;
  participant_id: string;
  participant_name: string;
  program: string;
  issue: string;
  severity: "high" | "medium" | "low";
  created_at: string;
  resolved: boolean;
}

interface ParticipantActivity {
  id: string;
  participant_name: string;
  program: string;
  last_interaction: string;
  sentiment: "positive" | "neutral" | "negative";
  messages_count: number;
  topics: string[];
}

const alerts: TravisAlert[] = [
  {
    id: "1",
    participant_id: "p1",
    participant_name: "DeShawn Mitchell",
    program: "Father Forward",
    issue: "Missed 2 consecutive check-ins. Expressed frustration in last conversation.",
    severity: "high",
    created_at: "2026-03-21T14:00:00Z",
    resolved: false,
  },
  {
    id: "2",
    participant_id: "p2",
    participant_name: "Anthony Brown",
    program: "Father Forward",
    issue: "Mentioned struggling with coursework and feeling overwhelmed.",
    severity: "medium",
    created_at: "2026-03-20T10:00:00Z",
    resolved: false,
  },
  {
    id: "3",
    participant_id: "p3",
    participant_name: "Kevin Davis",
    program: "Tech-Ready Youth",
    issue: "Asked about job opportunities - may need career counseling.",
    severity: "low",
    created_at: "2026-03-19T16:00:00Z",
    resolved: false,
  },
];

const recentActivity: ParticipantActivity[] = [
  {
    id: "1",
    participant_name: "Marcus Johnson",
    program: "Father Forward",
    last_interaction: "2 hours ago",
    sentiment: "positive",
    messages_count: 5,
    topics: ["Certification prep", "Study schedule"],
  },
  {
    id: "2",
    participant_name: "James Williams",
    program: "Tech-Ready Youth",
    last_interaction: "5 hours ago",
    sentiment: "neutral",
    messages_count: 3,
    topics: ["Assignment help", "Lab questions"],
  },
  {
    id: "3",
    participant_name: "DeShawn Mitchell",
    program: "Father Forward",
    last_interaction: "1 day ago",
    sentiment: "negative",
    messages_count: 8,
    topics: ["Family challenges", "Time management"],
  },
  {
    id: "4",
    participant_name: "Anthony Brown",
    program: "Father Forward",
    last_interaction: "3 hours ago",
    sentiment: "neutral",
    messages_count: 4,
    topics: ["Coursework", "Childcare"],
  },
];

const stats = {
  total_conversations: 156,
  active_participants: 42,
  avg_sentiment: 78,
  escalations_this_week: 3,
};

export default function TravisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return TrendingUp;
      case "negative":
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50";
      case "negative":
        return "text-red-500 bg-red-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#C9A84C] flex items-center justify-center">
            <Bot className="h-6 w-6 text-[#1A1A1A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Travis AI</h1>
            <p className="text-[#555555]">
              AI case manager dashboard and escalations
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            View All Alerts
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Configure Travis
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Conversations",
            value: stats.total_conversations,
            icon: MessageSquare,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Active Participants",
            value: stats.active_participants,
            icon: User,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Avg Sentiment Score",
            value: `${stats.avg_sentiment}%`,
            icon: Heart,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Escalations This Week",
            value: stats.escalations_this_week,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-white rounded-xl border border-[#DDDDDD]"
        >
          <div className="p-4 border-b border-[#DDDDDD]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="font-semibold text-[#1A1A1A]">Escalation Alerts</h2>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                {alerts.filter((a) => !a.resolved).length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-[#DDDDDD] max-h-[400px] overflow-y-auto">
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                href={`/program-management/participants/${alert.participant_id}`}
                className="block p-4 hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-[#1A1A1A]">
                    {alert.participant_name}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-[#555555] line-clamp-2">{alert.issue}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#888888]">{alert.program}</span>
                  <span className="text-xs text-[#888888]">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-3 border-t border-[#DDDDDD]">
            <Link
              href="/travis/alerts"
              className="flex items-center justify-center gap-1 text-sm text-[#C9A84C] hover:underline"
            >
              View All Alerts
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl border border-[#DDDDDD]"
        >
          <div className="p-4 border-b border-[#DDDDDD]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">Recent Conversations</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                <Input
                  placeholder="Search participants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {recentActivity.map((activity) => {
              const SentimentIcon = getSentimentIcon(activity.sentiment);
              return (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-[#FAFAF8] transition-colors cursor-pointer"
                  onClick={() => setSelectedConversation(activity.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold">
                        {activity.participant_name
                          .split(" ")
                          .map((n) => n.charAt(0))
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1A1A1A]">
                          {activity.participant_name}
                        </p>
                        <p className="text-xs text-[#888888]">{activity.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1 rounded ${getSentimentColor(activity.sentiment)}`}
                      >
                        <SentimentIcon className="h-4 w-4" />
                      </div>
                      <span className="text-xs text-[#888888]">{activity.last_interaction}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activity.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-[#FAFAF8] text-[#555555] text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <MessageSquare className="h-3 w-3 text-[#888888]" />
                    <span className="text-xs text-[#888888]">
                      {activity.messages_count} messages
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Travis Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] rounded-xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-8 w-8 text-[#C9A84C]" />
          <div>
            <h2 className="text-xl font-bold">Travis AI Capabilities</h2>
            <p className="text-white/70 text-sm">Your intelligent case management partner</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            {
              title: "24/7 Support",
              description: "Always available to answer participant questions",
              icon: Clock,
            },
            {
              title: "Sentiment Analysis",
              description: "Detects emotional cues and flags concerns",
              icon: Heart,
            },
            {
              title: "Progress Tracking",
              description: "Monitors Path Forward Plan milestones",
              icon: TrendingUp,
            },
            {
              title: "Smart Escalation",
              description: "Routes urgent issues to case workers",
              icon: AlertTriangle,
            },
          ].map((capability) => (
            <div key={capability.title} className="p-4 bg-white/10 rounded-lg">
              <capability.icon className="h-6 w-6 text-[#C9A84C] mb-2" />
              <h3 className="font-semibold text-white">{capability.title}</h3>
              <p className="text-sm text-white/70 mt-1">{capability.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
