import { getAllPosts, getAllTags } from '@/lib/mdx'
import { PostCard } from '@/components/ui/post-card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export async function generateStaticParams() {
  const tags = getAllTags()
  return Object.keys(tags).map((tag) => ({
    tag: tag,
  }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
    const params = await props.params;
    const { tag } = params
    const decodedTag = decodeURIComponent(tag)
    const posts = getAllPosts().filter(post => post.metadata.tags?.includes(decodedTag))

    return (
        <div className="container mx-auto max-w-3xl py-20 px-6">
             <Link href="/tags" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Tags
            </Link>
             <h1 className="text-4xl font-bold tracking-tighter mb-8 capitalize">#{decodedTag}</h1>
             <div className="space-y-2">
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
             </div>
        </div>
    )
}
