---
date: 26 Nov 2026
title: "Dovecot alternative: IMAP and JMAP on Kubernetes"
link: /blog/2026-11-26-dovecot-alternative-kubernetes.html
image: /blog/2026-11-26-dovecot-alternative-kubernetes.png
imageAlt: "Card: Dovecot alternative: IMAP and JMAP on Kubernetes"
description: "YariloMail as a Dovecot alternative on Kubernetes: one workload per component, a director ring, IMAP and JMAP, and a plain list of what is not covered yet."
---

# Dovecot alternative: IMAP and JMAP on Kubernetes

*26 November 2026*

Dovecot is the best-known open-source IMAP server, and for one server it needs no replacement. The question changes when the store has to run as a cluster: Dovecot CE 2.4 [removed the director and the replicator](https://doc.dovecot.org/main/installation/upgrade/2.3-to-2.4.html), which multi-server installations relied on.

YariloMail is an open-source mail server written in Go for that case. It keeps the mailbox formats and the configuration vocabulary an administrator already knows, and it is laid out for Kubernetes from the start. This post says what that means in practice, and lists just as plainly what it does not cover yet.

## What stays the same

- **The mail on disk.** Maildir, sdbox and mdbox are read as they are, so a store is taken over rather than converted. [Migrate from Dovecot: same store, same UIDs](/blog/2026-11-26-migrate-from-dovecot.html) walks through it.
- **The configuration vocabulary.** Settings keep their established names where they mean the same thing, so translating a configuration into `yarilo.yaml` is mechanical for what is covered.
- **The protocols.** IMAP4rev1 and IMAP4rev2, POP3, LMTP, Submission and ManageSieve, with Sieve filtering on delivery and on IMAP events.
- **The MTA.** YariloMail does not receive mail on port 25. Postfix or another MTA stays in front and delivers over LMTP.

## What is different

**Every component is its own workload.** There is no master process and no single binary. Login proxies, session backends, authentication, connection accounting, locking and the quota policy service are separate binaries, each deployed as its own Deployment or StatefulSet. The crash of one pod does not take the others down, and Kubernetes restarts it.

**Routing is built in.** The login proxies terminate TLS, authenticate, and ask the director which backend serves the user. The director answers from a consistent-hash ring, so a user's sessions land on one backend pod, and directors with more than one replica form a ring of their own to share that state. When a backend pod fails, the director routes its users to another pod that mounts the same storage. See [Director](https://doc.yarilomail.org/latest/architecture/director.html).

**The stateless parts scale on their own.** The stateless components scale horizontally with an autoscaler. The backends are a StatefulSet over shared storage, an NFS or CephFS volume mounted read-write by every backend pod; a backend pod carries every protocol, so it is scaled as a whole.

**The cluster's security model is used, not worked around.** Every pod runs non-root with a read-only root filesystem, traffic between components is mutual TLS with a role per component, each internal listener has its own NetworkPolicy, and only the backend mounts the mail.

**JMAP is served next to IMAP.** Mailboxes, messages, threads, search snippets, submission, identities, quota and Sieve scripts over JMAP, with push over EventSource and WebSocket. It runs in the same backend pod as IMAP, over the same mailboxes. The [JMAP page](https://doc.yarilomail.org/latest/protocols/jmap.html) lists each method and the limits that remain.

**Search and metrics come with it.** Full-text search is a service in the backend pod, built on Xapian, with no separate search cluster to run. Prometheus metrics and the `/healthz` and `/readyz` endpoints for the probes are built in.

One Helm chart installs all of it, and the topology is a matter of values, not of a different chart:

```sh
helm install yarilo oci://ghcr.io/yarilomail/charts/yarilo
```

The [installation guide](https://doc.yarilomail.org/latest/installation/) covers the prerequisites: a LoadBalancer, cert-manager, the user database and the storage class.

## What is not covered yet

A migration fails on the feature nobody checked. These are the ones to check, from the [feature coverage](https://doc.yarilomail.org/latest/architecture/parity.html) page, which is updated in the same change that moves a row:

| Area | Not implemented |
|:---|:---|
| Authentication | LDAP, PAM and Lua passdb; GSSAPI, CRAM-MD5, DIGEST-MD5 and client certificates; the older MD5 and SHA1 password schemes |
| Storage | mbox; object storage |
| Clustering | replication between two stores |
| Search | Solr and Elasticsearch engines |
| IMAP | COMPRESS, URLAUTH, CATENATE, fuzzy search; hibernation of idle sessions |
| Delivery | a standalone local-delivery binary: delivery is over LMTP |

Shared and public namespaces work with ACLs, with gaps the coverage page names. Accounts come from SQL (MySQL, PostgreSQL or SQLite), a passwd-file or a static entry, and the SQL queries can be written against a schema you already have.

If your configuration depends on a row of that table, YariloMail is not a replacement for it today, and the coverage page is where a change will show first.

## Who it fits

- You run, or are about to run, mail on Kubernetes and want the store to behave like the rest of the cluster: separate workloads, probes, metrics, network policies, one chart.
- You have a director-based installation and need per-user backend affinity to keep working.
- You want JMAP for a web or mobile client without giving up IMAP for everything else.
- Your accounts are in SQL and your mail is in Maildir, sdbox or mdbox.

It fits less well when one server is enough. A single host is supported, through [Docker Compose](https://doc.yarilomail.org/latest/installation/docker_compose.html), but it is not highly available, and that is the case Dovecot already serves.

## Try it against your own mail

The fastest honest test takes an afternoon: bring up the Compose stack on one host, point it at a copy of one domain's store, and open that mailbox in the client your users have. Then read the coverage page against your configuration, line by line, before you plan anything larger.
