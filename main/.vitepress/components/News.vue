<script setup lang="ts">
import { ref, computed } from 'vue'

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

// Fixed-height slider: 3 cards per page on desktop, arrows + dots.
const perPage = 3
const page = ref(0)
const pageCount = computed(() => Math.max(1, Math.ceil(newsItems.length / perPage)))
const visible = computed(() =>
  newsItems.slice(page.value * perPage, page.value * perPage + perPage),
)
const prev = () => { page.value = (page.value - 1 + pageCount.value) % pageCount.value }
const next = () => { page.value = (page.value + 1) % pageCount.value }
</script>

<template>
  <div class="max-w-8xl mx-auto w-full">
    <h2 class="text-3xl font-bold mb-6 uppercase">News</h2>

    <div class="flex items-center gap-2">
      <button
        v-if="pageCount > 1"
        class="shrink-0 text-2xl text-gray-400 hover:text-brand transition-colors px-2"
        aria-label="Previous news"
        @click="prev"
      >&lsaquo;</button>

      <!-- fixed height so a growing news list never stretches the page -->
      <div class="flex-1 h-32 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <a
            v-for="(item, i) in visible"
            :key="page + '-' + i"
            :href="item.link"
            rel="noopener"
            target="_blank"
            class="flex flex-col justify-center gap-1 rounded border border-gray-200 hover:border-brand px-4 py-3 transition-colors overflow-hidden"
          >
            <span class="text-sm text-gray-500">{{ item.date }}</span>
            <span class="text-lg leading-snug line-clamp-2">{{ item.title }}</span>
          </a>
        </div>
      </div>

      <button
        v-if="pageCount > 1"
        class="shrink-0 text-2xl text-gray-400 hover:text-brand transition-colors px-2"
        aria-label="Next news"
        @click="next"
      >&rsaquo;</button>
    </div>

    <div v-if="pageCount > 1" class="flex justify-center gap-2 mt-4">
      <button
        v-for="p in pageCount"
        :key="p"
        class="h-2.5 w-2.5 rounded-full transition-colors"
        :class="p - 1 === page ? 'bg-brand' : 'bg-gray-300 hover:bg-gray-400'"
        :aria-label="`News page ${p}`"
        @click="page = p - 1"
      />
    </div>
  </div>
</template>
