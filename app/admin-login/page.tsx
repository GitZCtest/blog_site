'use client';

import { useActionState, useEffect } from 'react';
import { loginAdmin } from '@/app/lib/actions';
import { Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(loginAdmin, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin');
        }
    }, [state, router]);

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900" />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-4"
            >
                <div className="p-8 rounded-3xl glass shadow-2xl shadow-black/10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            管理员登录
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                            请输入密码以访问管理面板
                        </p>
                    </div>

                    {/* Form */}
                    <form action={formAction} className="space-y-6">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="输入管理员密码"
                                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                                autoFocus
                            />
                        </div>

                        {/* Error message */}
                        {state?.message && !state.success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{state.message}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25"
                        >
                            {isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>验证中...</span>
                                </>
                            ) : (
                                <>
                                    <span>进入管理面板</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    仅限管理员访问
                </p>
            </motion.div>
        </div>
    );
}
