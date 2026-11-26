<script setup lang="ts">
import { withBase } from 'vitepress'

// Every post but the index page itself.
const pages = import.meta.glob(['../../blog/*.md', '!../../blog/index.md'], { eager: true })

const posts = Object.values(pages)
  .map((mod: any) => {
    const fm = mod.__pageData.frontmatter
    return {
      date: fm?.date ?? '',
      title: fm?.title ?? 'Untitled',
      link: fm?.link ?? '#',
      description: fm?.description ?? '',
    }
  })
  // By the date it names, not its text: "15 Aug" sorts after "04 Oct" as a string.
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
</script>

<template>
  <div class="not-prose flex flex-col gap-4 mt-6">
    <a
      v-for="post in posts"
      :key="post.link"
      :href="withBase(post.link)"
      class="flex flex-col gap-1 rounded border border-gray-200 hover:border-brand px-4 py-3 transition-colors no-underline"
    >
      <span class="text-sm text-gray-500">{{ post.date }}</span>
      <span class="text-[19px] leading-snug text-ink font-semibold">{{ post.title }}</span>
      <span class="text-base text-gray-600">{{ post.description }}</span>
    </a>
  </div>
</template>
