<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import Home from './Home.vue'
import Support from './Support.vue'

interface NavItem {
  text: string
  link: string
}

const { theme, frontmatter } = useData()

const nav = (theme.value.nav as NavItem[]) || []
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <div class="max-w-8xl mx-auto w-full px-4">
      <!-- Navbar -->
      <header class="w-full border-b border-gray-200">
        <nav class="flex items-center justify-between py-4">
          <!-- Left: wordmark -->
          <a :href="withBase('/')" class="flex items-center gap-2 no-underline">
            <span class="text-2xl font-extrabold tracking-tight">
              yarilo<span class="text-brand">mail</span>
            </span>
          </a>

          <!-- Right: nav links -->
          <div class="flex items-center gap-6">
            <a
              v-for="item in nav"
              :key="item.link"
              :target="item.link.startsWith('http') ? '_blank' : ''"
              :rel="item.link.startsWith('http') ? 'noopener' : ''"
              :href="item.link.startsWith('http') ? item.link : withBase(item.link)"
              class="text-gray-700 hover:text-brand text-base transition-colors"
            >
              {{ item.text }}
            </a>
          </div>
        </nav>
      </header>

      <!-- Main content -->
      <main class="w-full py-10">
        <Home v-if="frontmatter.home" />
        <Support v-else-if="frontmatter.support" />
        <article v-else class="prose max-w-full text-lg">
          <Content />
        </article>
      </main>
    </div>

    <footer class="mt-auto w-full py-6 text-center text-sm text-gray-500 border-t border-gray-200">
      &copy; yarilomail &middot; open-source mail server &middot;
      <a class="underline hover:text-brand" href="https://github.com/yarilomail/website" rel="noopener" target="_blank">source</a>
    </footer>
  </div>
</template>
