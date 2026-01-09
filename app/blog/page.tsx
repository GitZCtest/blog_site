import Link from 'next/link'
import { getAllPosts, Post } from '@/lib/mdx'
import { FadeIn } from '@/components/ui/fade-in'
import { GridPattern, AnimatedGradientOrb } from '@/components/ui/animated-gradient'
import { BookOpen, Calendar } from 'lucide-react'

export const metadata = {
    title: 'Blog | Zhang Chao',
    description: 'Thoughts on design, architecture, and technology.',
}

export default function BlogPage() {
    const posts = getAllPosts()

    // Group posts by year
    const postsByYear = posts.reduce((acc, post) => {
        const year = new Date(post.metadata.date).getFullYear().toString()
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(post)
        return acc
    }, {} as Record<string, Post[]>)

    const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))

    return (
        <div className="relative overflow-hidden min-h-screen">
            {/* Background Elements */}
            <GridPattern />
            <AnimatedGradientOrb className="w-[400px] h-[400px] bg-green-400 -top-32 -right-32" />
            <AnimatedGradientOrb className="w-[300px] h-[300px] bg-blue-400 bottom-1/4 -left-24" />

            <div className="container mx-auto max-w-4xl px-6 py-20 relative">
                <FadeIn>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                Writing
                            </h1>
                        </div>
                    </div>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-16 max-w-lg">
                        A collection of thoughts, tutorials, and notes on building software.
                    </p>
                </FadeIn>

                <div className="space-y-12">
                    {years.map((year, index) => (
                        <FadeIn key={year} delay={index * 0.1}>
                            <section className="relative">
                                {/* Year Badge */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{year}</span>
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800" />
                                </div>

                                {/* Posts */}
                                <div className="space-y-1 pl-2">
                                    {postsByYear[year].map((post) => (
                                        <article key={post.slug} className="group">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="flex items-center justify-between gap-4 py-3 px-4 -mx-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-blue-500 transition-colors shrink-0" />
                                                    <span className="text-[var(--foreground)] font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                        {post.metadata.title}
                                                    </span>
                                                </div>
                                                <time className="text-sm text-gray-400 font-mono shrink-0">
                                                    {new Date(post.metadata.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </time>
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </FadeIn>
                    ))}
                </div>

                {/* Empty State */}
                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No posts yet. Start writing!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

