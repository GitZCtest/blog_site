import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export type PostMetadata = {
  title: string
  date: string
  summary?: string
  image?: string
  tags?: string[]
  [key: string]: any
}

export type Post = {
  slug: string
  metadata: PostMetadata
  content: string
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: realSlug,
    metadata: data as PostMetadata,
    content,
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .filter((slug) => slug.endsWith('.mdx'))
    .map((slug) => getPostBySlug(slug))
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.metadata.date > post2.metadata.date ? -1 : 1))
  return posts
}

export function getAllTags() {
  const posts = getAllPosts()
  const tags: Record<string, number> = {}
  posts.forEach((post) => {
    if (post.metadata.tags) {
      post.metadata.tags.forEach((tag) => {
        if (tag in tags) {
          tags[tag] += 1
        } else {
          tags[tag] = 1
        }
      })
    }
  })
  return tags
}
