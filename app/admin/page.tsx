import { getAllPosts } from '@/lib/mdx'
import { getAllProjects } from '@/lib/projects'
import AdminPageClient from './admin-client'

export const metadata = {
    title: 'Admin | Zhang Chao',
    description: 'Blog administration panel',
}

export default function AdminPage() {
    const posts = getAllPosts()
    const projects = getAllProjects()

    return <AdminPageClient posts={posts} projects={projects} />
}
