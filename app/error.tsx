"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">
            Something went wrong
          </h1>
          <p className="text-[#555555] mb-6">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified
            and we&apos;re working on it.
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-[#1A1A1A] rounded-lg text-left">
              <p className="text-xs text-white/60 mb-1">Error Message:</p>
              <p className="text-sm text-red-400 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <>
                  <p className="text-xs text-white/60 mt-2 mb-1">Error Digest:</p>
                  <p className="text-sm text-white/80 font-mono">{error.digest}</p>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button onClick={reset} size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-sm text-[#888888]"
        >
          If this problem persists, please{" "}
          <Link href="/contact" className="text-[#C9A84C] hover:underline">
            contact us
          </Link>{" "}
          for assistance.
        </motion.p>
      </div>
    </div>
  );
}
