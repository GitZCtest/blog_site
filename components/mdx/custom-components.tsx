
import React from 'react'

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export const CustomMDXComponents = {
    h2: ({ children }: { children: React.ReactNode }) => {
        const id = typeof children === 'string' ? slugify(children) : ''
        return <h2 id={id} className="scroll-mt-24">{children}</h2>
    },
    h3: ({ children }: { children: React.ReactNode }) => {
        const id = typeof children === 'string' ? slugify(children) : ''
        return <h3 id={id} className="scroll-mt-24">{children}</h3>
    },
    // You can add more custom components here (e.g., CodeBlock, Image)
}
