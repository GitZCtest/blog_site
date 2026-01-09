"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Post } from '@/lib/mdx'

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative p-6 -mx-6 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-900/50">
          {/* Hover indicator */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full transition-all duration-300 group-hover:h-12" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Tags */}
              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {post.metadata.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {post.metadata.title}
              </h3>

              {/* Summary */}
              {post.metadata.summary && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {post.metadata.summary}
                </p>
              )}

              {/* Date */}
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 font-mono">
                <time>{post.metadata.date}</time>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

