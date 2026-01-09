"use client"

import { motion } from 'framer-motion'
import { Folder, ExternalLink, Github } from 'lucide-react'
import type { Project } from '@/lib/projects'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
        >
            <div className="group relative h-full p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300">
                {/* Gradient Accent */}
                <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                        <Folder className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex gap-2">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </a>
                        )}
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span
                            key={tag}
                            className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
