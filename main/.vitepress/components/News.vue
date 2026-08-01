<script setup lang="ts">
const newsPages = import.meta.glob('../../news/*.md', { eager: true })

const newsItems = Object.entries(newsPages)
  .map(([, mod]: [string, any]) => {
    const fm = mod.__pageData.frontmatter
    return {
      date: fm?.date ?? '',
      title: fm?.title ?? 'Untitled',
      link: fm?.link ?? '#',
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  .slice(0, 6)
</script>

<template>
  <div class="max-w-8xl mx-auto w-full">
    <h2 class="text-3xl font-bold mb-6 uppercase">News</h2>
    <ul class="space-y-3">
      <li v-for="(item, i) in newsItems" :key="i" class="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
        <span class="text-sm text-gray-500 md:w-40 shrink-0">{{ item.date }}</span>
        <a :href="item.link" class="text-lg hover:text-brand transition-colors" rel="noopener" target="_blank">
          {{ item.title }}
        </a>
      </li>
      <li v-if="newsItems.length === 0" class="text-gray-500">No news yet.</li>
    </ul>
  </div>
</template>
