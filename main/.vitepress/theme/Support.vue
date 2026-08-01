<script setup lang="ts"></script>

<template>
  <h1 class="text-4xl text-brand font-bold my-4 text-center">Support</h1>
  <p class="text-xl text-center max-w-3xl mx-auto text-gray-700">
    YariloMail is a community-driven open-source project. When reporting a problem,
    please first upgrade to the latest release and check whether the issue is
    reproducible there.
  </p>

  <div class="grid md:grid-cols-3 gap-8 mt-10">
    <div class="text-center space-y-3">
      <i class="i-heroicons-bug-ant-solid text-4xl text-brand" />
      <h2 class="text-2xl font-bold">Issue tracker</h2>
      <p class="text-lg text-gray-700">
        Report bugs and request features on
        <a href="https://github.com/yarilomail" class="underline hover:text-brand" rel="noopener" target="_blank">GitHub</a>.
      </p>
    </div>

    <div class="text-center space-y-3">
      <i class="i-heroicons-book-open-solid text-4xl text-brand" />
      <h2 class="text-2xl font-bold">Documentation</h2>
      <p class="text-lg text-gray-700">
        Configuration guides and reference are published in the project
        <a href="https://github.com/yarilomail" class="underline hover:text-brand" rel="noopener" target="_blank">repository</a>.
      </p>
    </div>

    <div class="text-center space-y-3">
      <i class="i-heroicons-shield-check-solid text-4xl text-brand" />
      <h2 class="text-2xl font-bold">Security</h2>
      <p class="text-lg text-gray-700">
        Found a vulnerability? See our
        <a href="/security" class="underline hover:text-brand">security</a> page for
        responsible disclosure.
      </p>
    </div>
  </div>
</template>
