<script setup lang="ts">
import News from '../components/News.vue'
</script>

<template>
  <!-- Hero: text left, illustration right -->
  <section class="flex flex-col md:flex-row items-center gap-8 py-8">
    <div class="md:w-5/12 flex flex-col gap-6 text-left">
      <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight">
        Yarilo<span class="text-brand">Mail</span>
      </h1>
      <p class="text-2xl md:text-3xl font-semibold text-ink">
        An open-source, high-performance mail server
      </p>
      <p class="text-lg text-gray-600">
        A scalable, standards-compliant IMAP/POP3 backend — a drop-in compatible
        replacement built for modern email hosting.
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
        <a
          href="/support"
          class="inline-block border border-gray-300 hover:border-brand text-ink font-bold px-6 py-3 rounded transition-colors"
        >
          Support
        </a>
      </div>
    </div>
    <div class="md:w-7/12">
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
    </div>
  </section>
</template>
