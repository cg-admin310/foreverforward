"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/shared/badge";

interface BlogPreviewCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  image?: string;
  index?: number;
}

export function BlogPreviewCard({
  title,
  excerpt,
  category,
  date,
  readTime,
  slug,
  image,
  index = 0,
}: BlogPreviewCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${slug}`} className="block">
        {/* Image */}
        <div className="aspect-video rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] mb-4 overflow-hidden relative">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#C9A84C]/20 to-[#5A7247]/20">
              <span className="text-white/40 text-sm font-medium">
                {category}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/10 transition-colors duration-300" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="gold" size="sm">
            {category}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-[#888888]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-[#555555] text-sm leading-relaxed line-clamp-2 mb-3">
          {excerpt}
        </p>

        {/* CTA */}
        <span className="inline-flex items-center gap-1 text-[#5A7247] font-medium text-sm group-hover:text-[#C9A84C] transition-colors">
          Read Article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.article>
  );
}
