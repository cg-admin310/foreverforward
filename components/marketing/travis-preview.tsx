"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { Bot, User, Send, Sparkles, MessageCircle, ArrowRight, Brain, Heart, Target, ChevronRight } from "lucide-react";

// Message type
interface Message {
  role: "travis" | "user";
  message: string;
  delay: number;
}

// Travis AI Conversation Scripts
const DEMO_CONVERSATIONS: Record<string, Message[]> = {
  program_support: [
    {
      role: "travis",
      message: "Hey there! I'm Travis, your AI mentor here at Forever Forward. I'm here to support you every step of the way. What's on your mind today?",
      delay: 0,
    },
    {
      role: "user",
      message: "I'm feeling a bit overwhelmed with the IT certification material. There's so much to learn.",
      delay: 2500,
    },
    {
      role: "travis",
      message: "I hear you, and that feeling is completely normal! Remember, you're not just learning IT — you're building a new future for yourself and your family. Let's break this down together.",
      delay: 5000,
    },
    {
      role: "travis",
      message: "What specific topic is giving you trouble? We can tackle it in smaller chunks. Sometimes the mountain looks huge until you start taking one step at a time. 💪",
      delay: 8000,
    },
    {
      role: "user",
      message: "Networking concepts are really confusing me. I don't understand how IP addresses work.",
      delay: 11000,
    },
    {
      role: "travis",
      message: "Perfect! IP addresses are like home addresses for computers. Let me share a quick resource that explains it with real-world examples. I also noticed you learn best with visual content, so I found a video that's gotten great feedback from other participants.",
      delay: 14000,
    },
  ],
  career_guidance: [
    {
      role: "travis",
      message: "Welcome back! I've been tracking your progress — you've completed 75% of the curriculum! That's incredible dedication. How are you feeling about the job search ahead?",
      delay: 0,
    },
    {
      role: "user",
      message: "Honestly, nervous. I haven't had a tech job before and I'm not sure I'm ready.",
      delay: 2500,
    },
    {
      role: "travis",
      message: "That honesty takes courage. Here's what I see: You've passed every lab exercise, you've helped three other participants debug their projects, and you've never missed a session. That's not luck — that's you.",
      delay: 5000,
    },
    {
      role: "travis",
      message: "Fun fact: 92% of Father Forward graduates get placed within 90 days. And guess what? They all felt exactly like you do right now. You're right on track. 🎯",
      delay: 8500,
    },
  ],
  resource_finder: [
    {
      role: "travis",
      message: "Hi! I see you're exploring our resource library. I can help you find exactly what you need. What are you looking for today?",
      delay: 0,
    },
    {
      role: "user",
      message: "I need help with my resume. I want to highlight my new IT skills.",
      delay: 2500,
    },
    {
      role: "travis",
      message: "Great timing! I've got just what you need. Here's our IT Career Resume Template that's been optimized for applicant tracking systems. It includes sections specifically designed for career changers like yourself.",
      delay: 5000,
    },
    {
      role: "travis",
      message: "I can also schedule a 1-on-1 resume review session with one of our career coaches. Would you like me to check their availability?",
      delay: 8000,
    },
  ],
};

type ConversationType = "program_support" | "career_guidance" | "resource_finder";

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <motion.div
        className="w-2 h-2 bg-brand-gold rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-brand-gold rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />
      <motion.div
        className="w-2 h-2 bg-brand-gold rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
      />
    </div>
  );
}

// Message bubble component
function MessageBubble({ message, isTyping }: { message: Message; isTyping?: boolean }) {
  const isTravis = message.role === "travis";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isTravis ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isTravis
            ? "bg-gradient-to-br from-brand-gold to-brand-gold-dark shadow-lg shadow-brand-gold/20"
            : "bg-brand-olive/20 border border-brand-olive/30"
        }`}
      >
        {isTravis ? (
          <Bot className="w-5 h-5 text-brand-black" />
        ) : (
          <User className="w-5 h-5 text-brand-olive" />
        )}
      </div>

      {/* Message */}
      <div
        className={`max-w-[80%] ${
          isTravis
            ? "bg-white/80 backdrop-blur-sm border border-brand-border rounded-2xl rounded-tl-md"
            : "bg-brand-olive/10 border border-brand-olive/20 rounded-2xl rounded-tr-md"
        } px-4 py-3 shadow-sm`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <p className="text-brand-black text-sm leading-relaxed">{message.message}</p>
        )}
      </div>
    </motion.div>
  );
}

// Conversation selector tabs
function ConversationTabs({
  active,
  onChange,
}: {
  active: ConversationType;
  onChange: (type: ConversationType) => void;
}) {
  const tabs = [
    { id: "program_support" as ConversationType, label: "Learning Support", icon: Brain },
    { id: "career_guidance" as ConversationType, label: "Career Guidance", icon: Target },
    { id: "resource_finder" as ConversationType, label: "Resources", icon: Sparkles },
  ];

  return (
    <div className="flex gap-2 p-1 bg-brand-warm/50 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            active === tab.id
              ? "bg-white text-brand-black shadow-sm"
              : "text-brand-text-medium hover:text-brand-black"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Main Travis Preview Component
export function TravisPreview() {
  const [conversationType, setConversationType] = useState<ConversationType>("program_support");
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const currentConversation = DEMO_CONVERSATIONS[conversationType];

  // Reset and play conversation when type changes or comes into view
  useEffect(() => {
    if (!isInView) return;

    setVisibleMessages(0);
    setIsTyping(false);
    setIsPlaying(true);
  }, [conversationType, isInView]);

  // Auto-play conversation
  useEffect(() => {
    if (!isPlaying || visibleMessages >= currentConversation.length) {
      if (visibleMessages >= currentConversation.length) {
        setIsPlaying(false);
      }
      return;
    }

    const nextMessage = currentConversation[visibleMessages];
    const prevDelay = visibleMessages > 0 ? currentConversation[visibleMessages - 1].delay : 0;
    const timeUntilNext = nextMessage.delay - prevDelay;

    // Show typing indicator for Travis messages
    if (nextMessage.role === "travis" && visibleMessages > 0) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
      }, timeUntilNext - 1500);

      const messageTimeout = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => prev + 1);
      }, timeUntilNext);

      return () => {
        clearTimeout(typingTimeout);
        clearTimeout(messageTimeout);
      };
    } else {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => prev + 1);
      }, visibleMessages === 0 ? 500 : timeUntilNext);

      return () => clearTimeout(timeout);
    }
  }, [isPlaying, visibleMessages, currentConversation]);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isTyping]);

  const handleReplay = () => {
    setVisibleMessages(0);
    setIsTyping(false);
    setIsPlaying(true);
  };

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-offwhite via-brand-gold-bg/30 to-brand-offwhite" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-medium text-brand-gold-dark">AI-Powered Support</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-6">
            Meet <span className="text-brand-gold">Travis</span>
          </h2>
          <p className="text-lg text-brand-text-medium leading-relaxed">
            Your AI mentor, available 24/7. Travis provides personalized guidance, finds resources,
            tracks your progress, and celebrates every milestone with you. Like having a supportive
            friend who happens to know everything about IT.
          </p>
        </motion.div>

        {/* Main Preview Area */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/20 via-brand-olive/10 to-brand-gold/20 rounded-3xl blur-xl opacity-60" />

            {/* Chat Window */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-brand-gold/20 shadow-2xl shadow-brand-black/5 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-black to-brand-black-soft px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center">
                      <Bot className="w-6 h-6 text-brand-black" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-brand-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Travis AI</h3>
                    <p className="text-brand-gold text-sm">Your Personal Mentor</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-brand-gold" />
                  <span className="text-white/60 text-sm">Here to help</span>
                </div>
              </div>

              {/* Conversation Tabs */}
              <div className="px-6 py-4 border-b border-brand-border/50">
                <ConversationTabs active={conversationType} onChange={setConversationType} />
              </div>

              {/* Messages Area */}
              <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-brand-warm/30">
                <AnimatePresence mode="popLayout">
                  {currentConversation.slice(0, visibleMessages).map((msg, idx) => (
                    <MessageBubble key={`${conversationType}-${idx}`} message={msg} />
                  ))}
                  {isTyping && (
                    <MessageBubble
                      key="typing"
                      message={{ role: "travis", message: "", delay: 0 }}
                      isTyping
                    />
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area (decorative) */}
              <div className="px-6 py-4 border-t border-brand-border/50 bg-white/50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-brand-warm rounded-xl px-4 py-3 text-brand-text-light text-sm">
                    Type your message to Travis...
                  </div>
                  <button
                    onClick={handleReplay}
                    className="p-3 bg-brand-gold rounded-xl text-brand-black hover:bg-brand-gold-dark transition-colors"
                    aria-label="Replay conversation"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: MessageCircle,
                title: "Always Available",
                description: "Get support any time, day or night. Travis never sleeps.",
              },
              {
                icon: Brain,
                title: "Personalized Learning",
                description: "Travis adapts to your pace and learning style.",
              },
              {
                icon: Heart,
                title: "Emotional Support",
                description: "More than tech help — real encouragement when you need it.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-brand-border/50"
              >
                <div className="p-2 bg-brand-gold/10 rounded-lg">
                  <feature.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-black mb-1">{feature.title}</h4>
                  <p className="text-sm text-brand-text-medium">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              href="/get-involved/enroll"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-black font-semibold rounded-xl hover:bg-brand-gold-dark transition-all duration-300 shadow-lg shadow-brand-gold/25 hover:shadow-xl hover:shadow-brand-gold/30 hover:-translate-y-0.5 group"
            >
              <span>Join a Program & Meet Travis</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-4 text-sm text-brand-text-medium">
              Travis is available to all Forever Forward program participants
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Compact version for embedding in other pages
export function TravisPreviewCompact() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const conversation = DEMO_CONVERSATIONS.program_support.slice(0, 3);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % conversation.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, conversation.length]);

  return (
    <div ref={containerRef} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-gold/20 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-brand-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center">
          <Bot className="w-5 h-5 text-brand-black" />
        </div>
        <div>
          <h3 className="font-semibold text-brand-black">Travis AI</h3>
          <p className="text-xs text-brand-gold">Always here for you</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="min-h-[80px]"
        >
          <p className="text-sm text-brand-text-medium leading-relaxed">
            "{conversation[currentMessageIndex].message}"
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-4">
        {conversation.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentMessageIndex ? "bg-brand-gold" : "bg-brand-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default TravisPreview;
