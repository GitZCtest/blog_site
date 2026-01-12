'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { revalidatePath } from 'next/cache';
import { getAllProjects, saveProjects, Project } from '@/lib/projects';

// ============== POST CRUD ==============

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const summary = formData.get('summary') as string;
  const date = formData.get('date') as string;
  const tagsRaw = formData.get('tags') as string;
  const content = formData.get('content') as string;

  if (!title || !slug || !content || !date) {
    return { message: 'Missing required fields' };
  }

  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  const fileContent = matter.stringify(content, {
    title,
    date,
    summary,
    tags
  });

  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

  try {
    fs.writeFileSync(filePath, fileContent);
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin');
    return { message: 'Success', success: true };
  } catch (error) {
    console.error('Failed to write file:', error);
    return { message: 'Failed to save post' };
  }
}

export async function updatePost(prevState: any, formData: FormData) {
  const originalSlug = formData.get('originalSlug') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const summary = formData.get('summary') as string;
  const date = formData.get('date') as string;
  const tagsRaw = formData.get('tags') as string;
  const content = formData.get('content') as string;

  if (!title || !slug || !content || !date || !originalSlug) {
    return { message: 'Missing required fields' };
  }

  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  const fileContent = matter.stringify(content, {
    title,
    date,
    summary,
    tags
  });

  const originalPath = path.join(process.cwd(), 'content/posts', `${originalSlug}.mdx`);
  const newPath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

  try {
    // If slug changed, delete old file
    if (originalSlug !== slug && fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    fs.writeFileSync(newPath, fileContent);
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin');
    revalidatePath(`/blog/${slug}`);
    return { message: 'Success', success: true };
  } catch (error) {
    console.error('Failed to update file:', error);
    return { message: 'Failed to update post' };
  }
}

export async function deletePost(slug: string) {
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin');
    return { message: 'Success', success: true };
  } catch (error) {
    console.error('Failed to delete file:', error);
    return { message: 'Failed to delete post' };
  }
}

export async function uploadPostFile(prevState: any, formData: FormData) {
  const file = formData.get('file') as File;

  if (!file || file.size === 0) {
    return { message: 'No file uploaded' };
  }

  const fileName = file.name;
  if (!fileName.endsWith('.mdx') && !fileName.endsWith('.md')) {
    return { message: 'Invalid file type. Please upload .mdx or .md file' };
  }

  try {
    const fileContent = await file.text();
    const { data, content } = matter(fileContent);

    if (!data.title) {
      return { message: 'File must have a title in frontmatter' };
    }

    const slug = fileName.replace(/\.(mdx|md)$/, '');
    const postsDir = path.join(process.cwd(), 'content/posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const filePath = path.join(postsDir, `${slug}.mdx`);
    fs.writeFileSync(filePath, fileContent);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/tags');
    revalidatePath('/admin');

    return { message: 'Success', success: true };
  } catch (error) {
    console.error('Failed to upload file:', error);
    return { message: 'Failed to process file' };
  }
}

// ============== PROJECT CRUD ==============

export async function createProject(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const tagsRaw = formData.get('tags') as string;
  const github = formData.get('github') as string;
  const link = formData.get('link') as string;
  const gradient = formData.get('gradient') as string;

  if (!title || !description) {
    return { message: 'Title and description are required' };
  }

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  const newProject: Project = {
    id: `proj-${Date.now()}`,
    title,
    description,
    tags,
    github: github || '',
    link: link || '',
    gradient: gradient || 'from-blue-500 to-cyan-500',
    createdAt: new Date().toISOString().split('T')[0]
  };

  try {
    const projects = getAllProjects();
    projects.push(newProject);
    saveProjects(projects);
    revalidatePath('/projects');
    revalidatePath('/admin');
    return { message: 'Success', success: true };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { message: 'Failed to create project' };
  }
}

export async function updateProject(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const tagsRaw = formData.get('tags') as string;
  const github = formData.get('github') as string;
  const link = formData.get('link') as string;
  const gradient = formData.get('gradient') as string;

  if (!id || !title || !description) {
    return { message: 'Missing required fields' };
  }

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  try {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return { message: 'Project not found' };
    }

    projects[index] = {
      ...projects[index],
      title,
      description,
      tags,
      github: github || '',
      link: link || '',
      gradient: gradient || projects[index].gradient
    };

    saveProjects(projects);
    revalidatePath('/projects');
    revalidatePath('/admin');
    return { message: 'Success', success: true };
  } catch (error) {
    console.error('Failed to update project:', error);
    return { message: 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveProjects(filtered);
    revalidatePath('/projects');
    revalidatePath('/admin');
    return { message: 'Success', success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { message: 'Failed to delete project' };
  }
}