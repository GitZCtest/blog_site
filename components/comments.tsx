"use client"

// import Giscus from '@giscus/react';
// import { useTheme } from 'next-themes';

export function Comments() {
  // const { theme } = useTheme();

  // Giscus is disabled until configured
  // TODO: Configure Giscus
  // 1. Visit https://giscus.app/
  // 2. Follow instructions to get your repoId and categoryId
  // 3. Uncomment and replace the values below

  return (
    <div className="py-8">
      <h3 className="text-lg font-bold mb-4">Comments</h3>
      <div className="p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Comments are coming soon. Configure Giscus to enable discussions.
        </p>
      </div>
      {/* 
      <Giscus
        id="comments"
        repo="YOUR_USERNAME/YOUR_REPO"
        repoId="YOUR_REPO_ID"
        category="General"
        categoryId="YOUR_CATEGORY_ID"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === 'dark' ? 'transparent_dark' : 'light'}
        lang="en"
        loading="lazy"
      />
      */}
    </div>
  );
}
