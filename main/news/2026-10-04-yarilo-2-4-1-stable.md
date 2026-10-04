---
date: 04 Oct 2026
title: "YariloMail 2.4.1: the first stable release"
link: /news/2026-10-04-yarilo-2-4-1-stable
---

# YariloMail 2.4.1: the first stable release

*4 October 2026*

YariloMail 2.4.1 is out, and it is the first release we call **stable**. Until now the project was a beta: configuration keys, the on-disk format and the meaning of the version number could change without notice. From 2.4.1 on, they cannot.

## What "stable" promises

- **Configuration keys keep their meaning.** A key that is removed is answered at startup, never silently ignored; a renamed key keeps working under its old name.
- **The on-disk format holds within a major version**, and the previous minor release can read what a newer one wrote, so a rollback stays possible.
- **The version number means something.** A patch fixes defects, a minor adds features or changes a default and says so in its notes, a major is anything a rollback could not read.

## What is in it

IMAP4rev2 and IMAP4rev1, POP3, LMTP delivery, Submission, Sieve and ManageSieve are complete. JMAP is partial: it reads, synchronises and updates keywords, but does not create or delete messages yet. The [parity matrix](https://doc.yarilomail.org/PARITY) says exactly what is complete, partial and absent.

Each component is its own small process, and every deployment shape — a single host with Docker Compose, or a Kubernetes cluster with directors and sharded backends — is a configuration, not a different build. Internal traffic between components is now protected by mutual TLS with a role per component, and the Helm chart ships network policies for every internal port.

## Upgrading

**Upgrading from 2.3.x needs attention.** Several defaults changed, and some configurations that loaded before now refuse to start with a message saying what to change. Read the upgrade section of the [release notes](https://github.com/yarilomail/yarilo/releases/tag/v2.4.1) before you run `helm upgrade`.

## Get it

- Release and notes: [github.com/yarilomail/yarilo/releases/tag/v2.4.1](https://github.com/yarilomail/yarilo/releases/tag/v2.4.1)
- Image: [`0kaba0/yarilo:2.4.1`](https://hub.docker.com/r/0kaba0/yarilo) on Docker Hub
- Documentation: [doc.yarilomail.org](https://doc.yarilomail.org/), starting with [Install](https://doc.yarilomail.org/INSTALL)
