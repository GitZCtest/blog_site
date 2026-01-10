import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { getAllPosts } from '@/lib/mdx'
import { Search } from '@/components/search'

export async function Header() {
  const posts = getAllPosts()
  const searchPosts = posts.map(post => ({
    slug: post.slug,
    metadata: {
      title: post.metadata.title,
      summary: post.metadata.summary,
      date: post.metadata.date
    }
  }))

  return (
    <header className="sticky top-0 z-50 w-full glass rounded-none border-t-0 border-x-0 border-b border-gray-200/20 dark:border-gray-800/50 transition-colors">
      <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tighter text-xl shrink-0 mr-4">
          ZC.
        </Link>
        <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Home</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Blog</Link>
            <Link href="/tags" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Tags</Link>
            <Link href="/projects" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Projects</Link>
          </nav>
          <Search posts={searchPosts} />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}