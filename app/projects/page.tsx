import { getAllProjects } from '@/lib/projects'
import { FadeIn } from '@/components/ui/fade-in'
import { GridPattern, AnimatedGradientOrb } from '@/components/ui/animated-gradient'
import { Folder, ExternalLink, Github } from 'lucide-react'
import { ProjectCard } from '@/components/ui/project-card'

export const metadata = {
  title: 'Projects | Zhang Chao',
  description: 'Things I have built and am working on.',
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <GridPattern />
      <AnimatedGradientOrb className="w-[450px] h-[450px] bg-orange-400 -top-32 -right-32" />
      <AnimatedGradientOrb className="w-[350px] h-[350px] bg-yellow-400 bottom-1/4 -left-24" />

      <div className="container mx-auto max-w-4xl py-20 px-6 relative">
        <FadeIn>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Projects
            </h1>
          </div>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-lg">
            Things I've built and am working on.
          </p>
        </FadeIn>

        {projects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <Folder className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500">No projects yet. Add some from the admin panel!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


