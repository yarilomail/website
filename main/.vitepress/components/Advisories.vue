<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../data/advisories.json'
import { filterAdvisories, severities, type Advisory, type Severity } from '../data/advisories.mts'

const advisories = data as Advisory[]

const query = ref('')
const severity = ref<Severity | 'all'>('all')
const filters: (Severity | 'all')[] = ['all', ...severities]

const shown = computed(() => filterAdvisories(advisories, query.value, severity.value))

// Full class strings so UnoCSS can extract them.
const badge: Record<Severity, string> = {
  critical: 'bg-red-700 text-white',
  high: 'bg-red-100 text-red-800',
  moderate: 'bg-amber-100 text-amber-800',
  low: 'bg-gray-100 text-gray-700',
}
</script>

<template>
  <div class="not-prose flex flex-col gap-4">
    <div v-if="advisories.length > 0" class="flex flex-wrap items-center gap-3">
      <input
        v-model="query"
        type="search"
        placeholder="Search advisories"
        aria-label="Search advisories"
        class="flex-1 min-w-48 border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:border-brand"
      />
      <div class="flex flex-wrap gap-1" role="group" aria-label="Filter by severity">
        <button
          v-for="f in filters"
          :key="f"
          type="button"
          :aria-pressed="severity === f"
          class="px-3 py-2 rounded text-base capitalize border transition-colors"
          :class="severity === f ? 'bg-brand text-white border-brand' : 'border-gray-300 text-gray-700 hover:border-brand'"
          @click="severity = f"
        >
          {{ f }}
        </button>
      </div>
    </div>

    <p v-if="advisories.length === 0" class="text-gray-600">
      No advisories have been published yet.
    </p>
    <p v-else-if="shown.length === 0" class="text-gray-600">
      No advisories match.
    </p>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-base">
        <thead class="border-b border-gray-300">
          <tr>
            <th class="py-2 pr-4 font-semibold">CVE</th>
            <th class="py-2 pr-4 font-semibold">Date</th>
            <th class="py-2 pr-4 font-semibold">Severity</th>
            <th class="py-2 font-semibold">Summary</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in shown" :key="a.id" class="border-b border-gray-200 align-top">
            <td class="py-2 pr-4 whitespace-nowrap">
              <a :href="a.link" class="underline hover:text-brand" rel="noopener" target="_blank">{{ a.id }}</a>
            </td>
            <td class="py-2 pr-4 whitespace-nowrap">{{ a.date }}</td>
            <td class="py-2 pr-4">
              <span class="px-2 py-0.5 rounded text-sm capitalize" :class="badge[a.severity]">{{ a.severity }}</span>
            </td>
            <td class="py-2">{{ a.summary }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
