"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, LayoutDashboard, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto text-center">
        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">
            Dashboard Error
          </h1>
          <p className="text-[#555555] mb-6">
            Something went wrong while loading this page. Try refreshing or navigate
            back to the dashboard.
          </p>
        </motion.div>

        {/* Error Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 p-4 bg-[#FAFAF8] rounded-xl border border-[#DDDDDD] text-left"
        >
          <div className="flex items-start gap-3">
            <Bug className="h-5 w-5 text-[#888888] flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-[#888888] mb-1">Error Details</p>
              <p className="text-sm text-[#1A1A1A] font-mono break-all">
                {error.message || "Unknown error occurred"}
              </p>
              {error.digest && (
                <p className="text-xs text-[#888888] mt-2">
                  Reference: {error.digest}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3"
        >
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-sm text-[#888888]"
        >
          If this error continues, contact your system administrator.
        </motion.p>
      </div>
    </div>
  );
}
