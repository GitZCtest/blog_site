import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Comments } from '@/components/comments'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { CustomMDXComponents } from '@/components/mdx/custom-components'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params

  let post
  try {
    post = getPostBySlug(slug)
  } catch (e) {
    notFound()
  }

  // Identify Headings for TOC (Simple regex-based)
  const headings = post.content.match(/^#{2,3} .+/gm)?.map(heading => {
    const level = heading.match(/^#+/)?.[0].length || 2
    const text = heading.replace(/^#+ /, '')
    const id = text.toLowerCase().replace(/[^\w-]+/g, '-')
    return { level, text, id }
  }) || []

  return (
    <>
      <ReadingProgress />
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:gap-12 max-w-6xl mx-auto">

          {/* Left Sidebar (TOC) - Desktop Only */}
          <aside className="hidden lg:block w-64 shrink-0 order-last">
            <div className="sticky top-24">
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">On this page</h4>
              <ul className="space-y-2 text-sm">
                {headings.map(h => (
                  <li key={h.id} style={{ paddingLeft: (h.level - 2) * 16 }}>
                    <a href={`#${h.id}`} className="text-gray-500 hover:text-[var(--foreground)] transition-colors block py-0.5">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <article className="prose dark:prose-invert prose-lg max-w-none">
              <header className="mb-8 not-prose">
                <div className="flex gap-2 mb-4">
                  {post.metadata.tags?.map(tag => (
                    <Link key={tag} href={`/tags/${tag}`} className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-[var(--foreground)]">{post.metadata.title}</h1>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-mono flex gap-4">
                  <time>{post.metadata.date}</time>
                  <span>•</span>
                  <span>{Math.ceil(post.content.length / 500)} min read</span>
                </div>
              </header>
              <MDXRemote source={post.content} components={CustomMDXComponents} />
            </article>

            <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
              <Comments />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}