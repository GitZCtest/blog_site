import fs from 'fs'
import path from 'path'

const projectsPath = path.join(process.cwd(), 'content/projects.json')

export type Project = {
    id: string
    title: string
    description: string
    tags: string[]
    github: string
    link: string
    gradient: string
    createdAt: string
}

function ensureProjectsFile() {
    if (!fs.existsSync(projectsPath)) {
        fs.writeFileSync(projectsPath, '[]', 'utf8')
    }
}

export function getAllProjects(): Project[] {
    ensureProjectsFile()
    const content = fs.readFileSync(projectsPath, 'utf8')
    return JSON.parse(content) as Project[]
}

export function getProjectById(id: string): Project | undefined {
    const projects = getAllProjects()
    return projects.find(p => p.id === id)
}

export function saveProjects(projects: Project[]) {
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), 'utf8')
}
