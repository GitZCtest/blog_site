# Personal Minimalist Blog

A high-performance, minimalist personal blog built with **Next.js**, **Tailwind CSS**, and **MDX**. Designed for developers and designers who value typography and speed.

## Features

- 🎨 **Minimalist Design**: Clean aesthetics with focus on content.
- 🌓 **Dark Mode**: Automatic system detection with manual toggle.
- 🚀 **High Performance**: Static Site Generation (SSG) for blazing fast load times.
- 📝 **MDX Support**: Write posts in Markdown with React component support.
- 🏷️ **Tags System**: Organize content with a flexible tagging system.
- 🔍 **Search**: Client-side instant search.
- 💬 **Comments**: Integrated with Giscus (GitHub Discussions).

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

3.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## Customization

### Content
- **Posts**: Add `.mdx` files to `content/posts/`.
- **Projects**: Update `app/projects/page.tsx` or create a new content source.

### Configuration
- **Site Metadata**: Update `app/layout.tsx`.
- **Comments**: Configure Giscus in `components/comments.tsx` with your GitHub Repo ID.

## Directory Structure

```
.
├── app/                 # Pages (App Router)
├── components/          # React Components
│   ├── ui/              # UI Elements (Cards, Buttons)
│   ├── layout/          # Header, Footer
│   └── ...
├── content/             # MDX Content
├── lib/                 # Utilities (MDX parsing, styles)
└── public/              # Static Assets
```