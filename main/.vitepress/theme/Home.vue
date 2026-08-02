<script setup lang="ts">
import News from '../components/News.vue'
</script>

<template>
  <!-- Hero: text left, illustration right -->
  <section class="flex flex-col md:flex-row items-center gap-8 py-8">
    <div class="md:w-1/2 flex flex-col gap-6 text-left">
      <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight text-black">
        YariloMail
      </h1>
      <p class="text-2xl md:text-3xl font-semibold text-ink">
        An open-source, high-performance mail server
      </p>
      <p class="text-lg text-gray-600">
        A scalable, standards-compliant mail backend speaking IMAP, POP3, JMAP,
        Submission and SIEVE, with built-in full-text search — a drop-in
        compatible replacement built for modern email hosting.
      </p>
      <div class="flex flex-wrap gap-4 pt-2">
        <a
          href="https://github.com/yarilomail"
          class="inline-block bg-brand hover:bg-branddark text-white font-bold px-6 py-3 rounded transition-colors"
          rel="noopener"
          target="_blank"
        >
          Get started
        </a>
      </div>
    </div>
    <div class="md:w-1/2">
      <img
        src="/hero.webp"
        alt="A user connecting laptop and phone to the YariloMail cloud over IMAP, POP3, SIEVE, Submission and JMAP"
        class="w-full h-auto"
        width="1376"
        height="768"
        fetchpriority="high"
      />
    </div>
  </section>

  <hr class="my-12 border-t border-gray-200 w-full" />

  <!-- News -->
  <section>
    <News />
  </section>

  <hr class="my-12 border-t border-gray-200 w-full" />

  <!-- Features -->
  <section class="max-w-8xl mx-auto w-full">
    <h2 class="text-3xl font-bold mb-10 uppercase">Features</h2>

    <div class="grid md:grid-cols-2 gap-x-12 gap-y-10">
      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-rocket-launch-solid text-xl" />
          High performance
        </h3>
        <p class="text-lg text-gray-700">
          Among the best-performing IMAP servers while supporting standard mailbox
          formats. Mailboxes are transparently indexed for excellent throughput and
          full compatibility.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-user-group-solid text-xl" />
          Flexible authentication
        </h3>
        <p class="text-lg text-gray-700">
          Feature-rich user authentication supporting many different authentication
          databases and mechanisms.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-clipboard-document-check-solid text-xl" />
          Standards compliant
        </h3>
        <p class="text-lg text-gray-700">
          Passes IMAP server standards-compliance tests where many other servers
          fall short.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-arrow-right-end-on-rectangle-solid text-xl" />
          Easy migration
        </h3>
        <p class="text-lg text-gray-700">
          Drop-in compatible with existing deployments, allowing the change to be
          transparent to existing users.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-cloud-solid text-xl" />
          Cluster-ready
        </h3>
        <p class="text-lg text-gray-700">
          Mailboxes and their indexes can be shared across multiple nodes on
          clustered storage while still performing well.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-lock-closed-solid text-xl" />
          Security-focused
        </h3>
        <p class="text-lg text-gray-700">
          Designed with security in mind at every layer. Report vulnerabilities via
          our <a href="/security" class="underline hover:text-brand">security</a> page.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-magnifying-glass-solid text-xl" />
          Full-text search
        </h3>
        <p class="text-lg text-gray-700">
          Built-in FTS engine indexes message bodies and attachments for instant
          server-side search across the whole mailbox.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-server-stack-solid text-xl" />
          Hybrid infrastructure
        </h3>
        <p class="text-lg text-gray-700">
          Runs across hybrid setups — on-prem, cloud or both — with mixed data
          storages: different mailbox formats and storage backends coexist in a
          single deployment.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-user-group-solid text-xl" />
          User-group isolation
        </h3>
        <p class="text-lg text-gray-700">
          Isolate groups of users on dedicated backend groups, each with its own
          storage type — tenant-level separation within one cluster.
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-semibold flex items-center gap-2 text-brand">
          <i class="i-heroicons-code-bracket-square-solid text-xl" />
          Advanced API
        </h3>
        <p class="text-lg text-gray-700">
          A high-quality administration and automation API out of the box —
          manage users, mailboxes and the cluster programmatically.
        </p>
      </div>
    </div>
  </section>
</template>
