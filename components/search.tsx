"use client"

import * as React from "react"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"

export type SearchPost = {
    slug: string
    metadata: {
        title: string
        summary?: string
        date: string
    }
}

export function Search({ posts }: { posts: SearchPost[] }) {
    const [query, setQuery] = React.useState("")
    const [open, setOpen] = React.useState(false)

    // Filter posts
    const filtered = React.useMemo(() => {
        if (!query) return []
        return posts.filter(post => 
            post.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
            post.metadata.summary?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
    }, [query, posts])

    return (
        <div className="relative hidden sm:block">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all placeholder:text-gray-400"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setOpen(true)
                    }}
                    onBlur={() => setTimeout(() => setOpen(false), 200)}
                    onFocus={() => setOpen(true)}
                />
            </div>
            
            {open && query && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                    {filtered.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">No results found.</div>
                    ) : (
                        <ul>
                            {filtered.map(post => (
                                <li key={post.slug}>
                                    <Link href={`/blog/${post.slug}`} className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <div className="text-sm font-medium text-[var(--foreground)]">{post.metadata.title}</div>
                                        {post.metadata.summary && (
                                            <div className="text-xs text-gray-500 truncate mt-1">{post.metadata.summary}</div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
