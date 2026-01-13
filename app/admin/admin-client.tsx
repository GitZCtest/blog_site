'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import {
    createPost,
    updatePost,
    deletePost,
    uploadPostFile,
    createProject,
    updateProject,
    deleteProject,
    logoutAdmin
} from '@/app/lib/actions';
import {
    ArrowLeft,
    PenLine,
    Upload,
    FileText,
    AlertCircle,
    Sparkles,
    FileEdit,
    Folder,
    Trash2,
    Edit,
    Plus,
    X,
    Github,
    ExternalLink,
    Check,
    AlertTriangle,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '@/lib/mdx';
import { Project } from '@/lib/projects';

type Tab = 'posts' | 'projects' | 'create';
type CreateMode = 'write' | 'upload' | 'project';

// Types for custom dialogs
interface ConfirmDialogState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

interface ToastState {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
}

const GRADIENT_OPTIONS = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue → Cyan' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple → Pink' },
    { value: 'from-green-500 to-emerald-500', label: 'Green → Emerald' },
    { value: 'from-orange-500 to-red-500', label: 'Orange → Red' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo → Purple' },
    { value: 'from-yellow-500 to-orange-500', label: 'Yellow → Orange' },
];

interface AdminPageClientProps {
    posts: Post[];
    projects: Project[];
}

export default function AdminPageClient({ posts, projects }: AdminPageClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const [createMode, setCreateMode] = useState<CreateMode>('write');

    // Edit states
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Custom dialog states
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });
    const [toast, setToast] = useState<ToastState>({
        isVisible: false,
        message: '',
        type: 'success'
    });

    // Form states
    const [writeState, writeAction, isWritePending] = useActionState(createPost, null);
    const [uploadState, uploadAction, isUploadPending] = useActionState(uploadPostFile, null);
    const [updatePostState, updatePostAction, isUpdatePostPending] = useActionState(updatePost, null);
    const [projectState, projectAction, isProjectPending] = useActionState(createProject, null);
    const [updateProjectState, updateProjectAction, isUpdateProjectPending] = useActionState(updateProject, null);

    // File upload
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Show toast helper
    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    // Auto-hide toast
    useEffect(() => {
        if (toast.isVisible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, isVisible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.isVisible]);

    useEffect(() => {
        if (writeState?.success || uploadState?.success || updatePostState?.success || projectState?.success || updateProjectState?.success) {
            showToast('操作成功!', 'success');
            setSelectedFile(null);
            setEditingPost(null);
            setEditingProject(null);
        }
    }, [writeState, uploadState, updatePostState, projectState, updateProjectState]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.mdx') || file.name.endsWith('.md')) {
                setSelectedFile(file);
            } else {
                showToast('请上传 .mdx 或 .md 文件', 'error');
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleDeletePost = (slug: string) => {
        setConfirmDialog({
            isOpen: true,
            title: '删除文章',
            message: '确定要删除这篇文章吗？此操作无法撤销。',
            onConfirm: async () => {
                await deletePost(slug);
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                showToast('文章已删除', 'success');
                window.location.reload();
            }
        });
    };

    const handleDeleteProject = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: '删除项目',
            message: '确定要删除这个项目吗？此操作无法撤销。',
            onConfirm: async () => {
                await deleteProject(id);
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                showToast('项目已删除', 'success');
                window.location.reload();
            }
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl" />
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast.isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className="fixed top-6 left-1/2 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
                        style={{
                            backgroundColor: toast.type === 'success' ? 'rgb(34 197 94)' :
                                toast.type === 'error' ? 'rgb(239 68 68)' : 'rgb(234 179 8)'
                        }}
                    >
                        {toast.type === 'success' && <Check className="w-5 h-5 text-white" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
                        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-white" />}
                        <span className="text-white font-medium">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {confirmDialog.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={closeConfirmDialog}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-center mb-2">{confirmDialog.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center text-sm">{confirmDialog.message}</p>
                            </div>
                            <div className="flex border-t border-gray-200 dark:border-gray-800">
                                <button
                                    onClick={closeConfirmDialog}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={confirmDialog.onConfirm}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-gray-200 dark:border-gray-800"
                                >
                                    确认删除
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto max-w-5xl py-10 px-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        返回首页
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            管理面板
                        </h1>
                    </div>
                    <button
                        onClick={async () => {
                            await logoutAdmin();
                            window.location.href = '/admin-login';
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        退出登录
                    </button>
                </div>

                {/* Main Tabs */}
                <div className="flex gap-2 mb-8 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'posts'
                            ? 'bg-white dark:bg-gray-900 text-[var(--foreground)] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <FileEdit className="w-4 h-4" />
                        文章管理
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects'
                            ? 'bg-white dark:bg-gray-900 text-[var(--foreground)] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Folder className="w-4 h-4" />
                        项目管理
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'create'
                            ? 'bg-white dark:bg-gray-900 text-[var(--foreground)] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Plus className="w-4 h-4" />
                        新建
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {/* Posts List */}
                    {activeTab === 'posts' && (
                        <motion.div
                            key="posts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-bold mb-4">所有文章 ({posts.length})</h2>

                            {posts.length === 0 ? (
                                <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                    <p className="text-gray-500">暂无文章</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {posts.map(post => (
                                        <div
                                            key={post.slug}
                                            className="flex items-center justify-between p-4 rounded-xl glass"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate">{post.metadata.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {post.metadata.date} · {post.slug}.mdx
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => setEditingPost(post)}
                                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePost(post.slug)}
                                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Projects List */}
                    {activeTab === 'projects' && (
                        <motion.div
                            key="projects"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-bold mb-4">所有项目 ({projects.length})</h2>

                            {projects.length === 0 ? (
                                <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <Folder className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                    <p className="text-gray-500">暂无项目</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {projects.map(project => (
                                        <div
                                            key={project.id}
                                            className="p-4 rounded-xl glass"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                                                    <Folder className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingProject(project)}
                                                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-medium">{project.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                                            <div className="flex gap-2 mt-3">
                                                {project.github && (
                                                    <a href={project.github} target="_blank" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                                                        <Github className="w-3 h-3" /> GitHub
                                                    </a>
                                                )}
                                                {project.link && (
                                                    <a href={project.link} target="_blank" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                                                        <ExternalLink className="w-3 h-3" /> Demo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Create New */}
                    {activeTab === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Create Mode Tabs */}
                            <div className="flex gap-2 mb-6 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 w-fit">
                                <button
                                    onClick={() => setCreateMode('write')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${createMode === 'write'
                                        ? 'bg-white dark:bg-gray-900 text-[var(--foreground)] shadow-sm'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    <PenLine className="w-3.5 h-3.5" />
                                    写文章
                                </button>
                                <button
                                    onClick={() => setCreateMode('upload')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${createMode === 'upload'
                                        ? 'bg-white dark:bg-gray-900 text-[var(--foreground)] shadow-sm'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    上传文件
                                </button>
                                <button
                                    onClick={() => setCreateMode('project')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${createMode === 'project'
                                        ? 'bg-white dark:bg-gray-900 text-[var(--foreground)] shadow-sm'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    <Folder className="w-3.5 h-3.5" />
                                    新项目
                                </button>
                            </div>

                            {/* Write Post Form */}
                            {createMode === 'write' && (
                                <form action={writeAction} className="space-y-6">
                                    <div className="p-6 rounded-2xl glass shadow-xl shadow-black/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">标题</label>
                                                <input name="title" required className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="文章标题" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Slug (文件名)</label>
                                                <input name="slug" required className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="my-new-post" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">日期</label>
                                                <input name="date" type="date" required className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">标签 (逗号分隔)</label>
                                                <input name="tags" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="nextjs, design, life" />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium mb-2">摘要</label>
                                            <textarea name="summary" rows={2} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="简短描述..." />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">内容 (MDX)</label>
                                            <textarea name="content" required rows={15} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="# Hello World..." />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-4">
                                        {writeState?.message && !writeState.success && (
                                            <p className="flex items-center gap-2 text-red-500 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                {writeState.message}
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isWritePending}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-blue-500/25"
                                        >
                                            {isWritePending ? '发布中...' : '发布文章'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Upload File Form */}
                            {createMode === 'upload' && (
                                <form action={uploadAction} className="space-y-6">
                                    <div
                                        className={`p-6 rounded-2xl border-2 border-dashed transition-all glass ${dragActive ? 'border-blue-500 bg-blue-50/50' : selectedFile ? 'border-green-500 bg-green-50/50' : 'border-gray-300 dark:border-gray-700'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input ref={fileInputRef} type="file" name="file" accept=".mdx,.md" onChange={handleFileSelect} className="hidden" />

                                        <div className="text-center py-12">
                                            {selectedFile ? (
                                                <>
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                                        <FileText className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <p className="text-lg font-medium text-green-600 mb-2">{selectedFile.name}</p>
                                                    <p className="text-sm text-gray-500 mb-4">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                                    <button type="button" onClick={() => setSelectedFile(null)} className="text-sm text-gray-500 hover:text-red-500">移除文件</button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-lg font-medium mb-2">拖拽 MDX 文件到这里</p>
                                                    <p className="text-sm text-gray-500 mb-4">或点击选择文件</p>
                                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                                        选择文件
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-4">
                                        {uploadState?.message && !uploadState.success && (
                                            <p className="flex items-center gap-2 text-red-500 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                {uploadState.message}
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isUploadPending || !selectedFile}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-green-500/25"
                                        >
                                            {isUploadPending ? '上传中...' : '上传并发布'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Create Project Form */}
                            {createMode === 'project' && (
                                <form action={projectAction} className="space-y-6">
                                    <div className="p-6 rounded-2xl glass shadow-xl shadow-black/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">项目名称</label>
                                                <input name="title" required className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none transition-all" placeholder="My Awesome Project" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">渐变色</label>
                                                <select name="gradient" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none transition-all">
                                                    {GRADIENT_OPTIONS.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium mb-2">描述</label>
                                            <textarea name="description" required rows={3} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none transition-all resize-none" placeholder="项目简介..." />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">GitHub 链接</label>
                                                <input name="github" type="url" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none transition-all" placeholder="https://github.com/..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">在线演示链接</label>
                                                <input name="link" type="url" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none transition-all" placeholder="https://..." />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">标签 (逗号分隔)</label>
                                            <input name="tags" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none transition-all" placeholder="React, TypeScript, Tailwind" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-4">
                                        {projectState?.message && !projectState.success && (
                                            <p className="flex items-center gap-2 text-red-500 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                {projectState.message}
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isProjectPending}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-orange-500/25"
                                        >
                                            {isProjectPending ? '创建中...' : '创建项目'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Post Modal */}
                {editingPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-bold">编辑文章</h3>
                                <button onClick={() => setEditingPost(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form action={updatePostAction} className="p-6 space-y-4">
                                <input type="hidden" name="originalSlug" value={editingPost.slug} />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">标题</label>
                                        <input name="title" required defaultValue={editingPost.metadata.title} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Slug</label>
                                        <input name="slug" required defaultValue={editingPost.slug} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">日期</label>
                                        <input name="date" type="date" required defaultValue={editingPost.metadata.date} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">标签</label>
                                        <input name="tags" defaultValue={editingPost.metadata.tags?.join(', ')} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">摘要</label>
                                    <textarea name="summary" rows={2} defaultValue={editingPost.metadata.summary || ''} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 resize-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">内容</label>
                                    <textarea name="content" required rows={10} defaultValue={editingPost.content} className="w-full px-3 py-2 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-700 resize-none" />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setEditingPost(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                                        取消
                                    </button>
                                    <button type="submit" disabled={isUpdatePostPending} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50">
                                        {isUpdatePostPending ? '保存中...' : '保存更改'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Edit Project Modal */}
                {editingProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-bold">编辑项目</h3>
                                <button onClick={() => setEditingProject(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form action={updateProjectAction} className="p-6 space-y-4">
                                <input type="hidden" name="id" value={editingProject.id} />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">项目名称</label>
                                        <input name="title" required defaultValue={editingProject.title} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">渐变色</label>
                                        <select name="gradient" defaultValue={editingProject.gradient} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                                            {GRADIENT_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">描述</label>
                                    <textarea name="description" required rows={3} defaultValue={editingProject.description} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 resize-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">GitHub</label>
                                        <input name="github" type="url" defaultValue={editingProject.github} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">演示链接</label>
                                        <input name="link" type="url" defaultValue={editingProject.link} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">标签</label>
                                    <input name="tags" defaultValue={editingProject.tags.join(', ')} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                                        取消
                                    </button>
                                    <button type="submit" disabled={isUpdateProjectPending} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50">
                                        {isUpdateProjectPending ? '保存中...' : '保存更改'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
