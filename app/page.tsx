import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { FadeIn } from '@/components/ui/fade-in'
import { AnimatedGradientOrb, GridPattern } from '@/components/ui/animated-gradient'
import { PostCard } from '@/components/ui/post-card'
import { ArrowRight, Github, Twitter, Mail, Sparkles } from 'lucide-react'

export default function Home() {
  const posts = getAllPosts().slice(0, 5)

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <GridPattern />
      <AnimatedGradientOrb className="w-[500px] h-[500px] bg-blue-400 -top-48 -right-48" />
      <AnimatedGradientOrb className="w-[400px] h-[400px] bg-purple-400 top-1/2 -left-32" />

      <div className="container mx-auto max-w-4xl px-6 py-20 md:py-32 relative">
        {/* Hero Section */}
        <FadeIn>
          <section className="mb-24 md:mb-32">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-100 dark:border-blue-900/50 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Available for freelance work</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Design.<br />Code.<br />Minimal.
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mb-10">
              I'm <span className="text-[var(--foreground)] font-medium">Zhang Chao</span>, an architect and designer building digital gardens. Exploring the intersection of aesthetics and technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-medium bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg shadow-black/5 dark:shadow-white/5"
              >
                Read Blog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                View Projects
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Connect</span>
              <div className="flex gap-2">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                  <Github className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-[var(--foreground)] transition-colors" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                  <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-[var(--foreground)] transition-colors" />
                </a>
                <a href="mailto:hello@example.com" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-[var(--foreground)] transition-colors" />
                </a>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Recent Writing Section */}
        <section>
          {/* Section Header */}
          <FadeIn delay={0.2}>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <h2 className="text-2xl font-bold tracking-tight">Recent Writing</h2>
              </div>
              <Link href="/blog" className="group text-sm font-medium text-gray-500 hover:text-[var(--foreground)] flex items-center gap-1 transition-colors">
                View all
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>

          {/* Posts Grid */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {posts.length === 0 && (
            <FadeIn delay={0.3}>
              <div className="text-center py-16">
                <p className="text-gray-500">No posts yet. Start writing!</p>
              </div>
            </FadeIn>
          )}
        </section>
      </div>
    </div>
  );
}