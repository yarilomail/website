<script setup lang="ts"></script>

<template>
  <h1 class="type-h1 mb-6">Support</h1>
  <p class="type-body">
    YariloMail is a community-driven open-source project. When reporting a problem,
    please first upgrade to the latest release and check whether the issue is
    reproducible there.
  </p>

  <div class="mt-10 flex flex-col gap-8">
    <div class="flex gap-5">
      <i class="i-heroicons-bug-ant-solid text-4xl text-brand shrink-0" />
      <div class="flex flex-col gap-2">
        <h2 class="type-h2">Issue tracker</h2>
        <p class="type-body">
          Report bugs and request features on
          <a href="https://github.com/yarilomail/yarilo/issues" class="underline hover:text-brand" rel="noopener" target="_blank">GitHub</a>.
        </p>
      </div>
    </div>

    <div class="flex gap-5">
      <i class="i-heroicons-book-open-solid text-4xl text-brand shrink-0" />
      <div class="flex flex-col gap-2">
        <h2 class="type-h2">Documentation</h2>
        <p class="type-body">
          Configuration guides and protocol reference are published in the
          <a href="https://doc.yarilomail.org/" class="underline hover:text-brand" rel="noopener" target="_blank">project documentation</a>.
        </p>
      </div>
    </div>

    <div class="flex gap-5">
      <i class="i-heroicons-shield-check-solid text-4xl text-brand shrink-0" />
      <div class="flex flex-col gap-2">
        <h2 class="type-h2">Security</h2>
        <p class="type-body">
          Found a vulnerability? See our
          <a href="/security" class="underline hover:text-brand">security</a> page for
          responsible disclosure.
        </p>
      </div>
    </div>
  </div>
</template>
