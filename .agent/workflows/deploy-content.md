---
description: How to sync local content (posts and projects) to the production server using scp
---

# Deploy Content to Server

This workflow explains how to sync your local content to the production server after writing blog posts or updating projects locally.

## Prerequisites

1. SSH access to your server
2. Server path where the blog is deployed (e.g., `/var/www/blog_site`)
3. Your server username and hostname

## Step 1: Write Content Locally

Create or edit your MDX files locally in the `content/` directory:

```
content/
├── posts/          # Blog posts (.mdx files)
│   ├── my-new-post.mdx
│   └── another-post.mdx
└── projects.json   # Projects data
```

## Step 2: Test Locally

Before deploying, test your content locally:

```bash
npm run dev
```

Open http://localhost:3000 and verify your changes look correct.

## Step 3: Sync Content to Server

### Option A: Sync Only Blog Posts

```bash
scp -r ./content/posts/*.mdx user@your-server:/path/to/blog_site/content/posts/
```

### Option B: Sync Only Projects Data

```bash
scp ./content/projects.json user@your-server:/path/to/blog_site/content/
```

### Option C: Sync All Content (Recommended)

```bash
# Sync entire content directory
scp -r ./content/* user@your-server:/path/to/blog_site/content/
```

## Step 4: Rebuild on Server (If Using SSG)

If your blog uses Static Site Generation, you need to rebuild after syncing:

```bash
# SSH into your server
ssh user@your-server

# Navigate to blog directory
cd /path/to/blog_site

# Rebuild the site
npm run build

# Restart the server (if using PM2)
pm2 restart blog
```

## Example Commands

Replace these placeholders with your actual values:

| Placeholder | Example Value |
|-------------|---------------|
| `user` | `zhangchao` |
| `your-server` | `192.168.1.100` or `myserver.com` |
| `/path/to/blog_site` | `/var/www/blog` |

### Full Example

```bash
# From your local machine, sync all content
scp -r ./content/* zhangchao@myserver.com:/var/www/blog/content/

# SSH in and rebuild
ssh zhangchao@myserver.com "cd /var/www/blog && npm run build && pm2 restart blog"
```

## Quick Script

You can create a deployment script `deploy.sh` in your project root:

```bash
#!/bin/bash

SERVER="user@your-server"
REMOTE_PATH="/path/to/blog_site"

echo "📦 Syncing content to server..."
scp -r ./content/* $SERVER:$REMOTE_PATH/content/

echo "🔨 Rebuilding on server..."
ssh $SERVER "cd $REMOTE_PATH && npm run build && pm2 restart blog"

echo "✅ Deployment complete!"
```

Make it executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Notes

- The `scp` command overwrites files with the same name
- Use `scp -r` to recursively copy directories
- Add `-v` flag for verbose output if debugging: `scp -rv ...`
- For large files, consider `rsync` instead (more efficient for updates)
