import Link from 'next/link'
import { getAllTags } from '@/lib/mdx'
import { FadeIn } from '@/components/ui/fade-in'
import { GridPattern, AnimatedGradientOrb } from '@/components/ui/animated-gradient'
import { Tag, Hash } from 'lucide-react'

export default function TagsPage() {
  const tags = getAllTags()
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <GridPattern />
      <AnimatedGradientOrb className="w-[350px] h-[350px] bg-purple-400 -top-24 -right-24" />
      <AnimatedGradientOrb className="w-[250px] h-[250px] bg-pink-400 bottom-1/3 -left-16" />

      <div className="container mx-auto max-w-4xl py-20 px-6 relative">
        <FadeIn>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Tags
            </h1>
          </div>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-lg">
            Browse articles by topic.
          </p>
        </FadeIn>

        {sortedTags.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <Hash className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-500">No tags found yet.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3">
              {sortedTags.map((tag, index) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Hash className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {tag}
                  </span>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {tags[tag]}
                  </span>
                </Link>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}

