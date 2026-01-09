"use client"

import { motion } from 'framer-motion'

export function AnimatedGradientOrb({ className }: { className?: string }) {
    return (
        <motion.div
            className={`absolute rounded-full blur-3xl opacity-20 dark:opacity-10 pointer-events-none ${className}`}
            animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    )
}

export function GridPattern() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg
                className="absolute h-full w-full stroke-gray-200/50 dark:stroke-gray-800/50"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="grid-pattern"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <path d="M.5 40V.5H40" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern)" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
        </div>
    )
}
