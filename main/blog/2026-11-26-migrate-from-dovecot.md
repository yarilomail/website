---
date: 26 Nov 2026
title: "Migrate from Dovecot: same store, same UIDs"
link: /blog/2026-11-26-migrate-from-dovecot.html
image: /blog/2026-11-26-migrate-from-dovecot.png
imageAlt: "Card: Migrate from Dovecot: same store, same UIDs"
description: "Three ways to move a Dovecot mail store to YariloMail: adopt mdbox or sdbox in place and keep the UIDs, import into a new store, or point at a Maildir tree."
---

# Migrate from Dovecot: same store, same UIDs

*26 November 2026*

Replacing an IMAP server usually means copying every mailbox over IMAP. It takes days on a large store, the messages get new UIDs, and every client downloads its mail again. If the mail lies on disk in one of Dovecot's formats, none of that is necessary: YariloMail reads Maildir, sdbox and mdbox as they are, and for the two dbox formats it can take over the store where it lies.

This post walks through the three routes, what each one carries over, and what stops it. The reference for every flag is the [migration page](https://doc.yarilomail.org/latest/installation/migration.html) of the documentation.

## Pick a route

| Your store | Route | What is written |
|:---|:---|:---|
| mdbox or sdbox, and YariloMail replaces Dovecot over it | **Adopt in place** | the folder indexes only; the messages stay where they are |
| mdbox or sdbox, and the source has to stay readable | **Import** with `yarilo-migrate --src dbox-ref` | a new store; the source is never written to |
| Maildir | **Point at the tree** | nothing is copied; two backfills add identifiers and conversations |

Adoption is the one that keeps a client from resynchronising, because it is the only one that keeps the UIDs.

## Adopt the store in place

Stop Dovecot, point the YariloMail deployment at the store, and open a folder. The first open reads Dovecot's index for that folder, writes YariloMail's beside it, and removes Dovecot's. The messages are not copied, moved or rewritten: the new map records point at the same storage files at the same offsets.

What comes across:

| | |
|:---|:---|
| messages, in their folders, nested folders and non-ASCII names included | yes |
| flags and keywords | yes |
| UIDs and UIDVALIDITY | yes, unchanged |
| the next UID a folder hands out | yes |
| per-message identifiers (GUID) | yes |
| subscriptions | yes |
| ACLs, quota state | no |

A client that reconnects finds the UIDs it left and fetches nothing again.

Three things to know before you do it:

- **It is one-way, for the whole store, from the first open.** Dovecot will not find a folder it can no longer name. Going back means a restore, so take a snapshot or a backup first.
- **Dovecot must be stopped,** and the store must not be shared with it: adoption rewrites index files Dovecot would otherwise be writing.
- **The store must be writable.** A read-only snapshot or a replica is refused, naming the directory. Import that kind of store instead.

A folder is converted once, on its first open, under the folder's write lock, so a delivery that arrives mid-conversion waits for it. On a folder of three thousand messages that wait is tens of milliseconds. A folder nobody opens is never converted and keeps addressing its mail through Dovecot's map, which stays on disk until no such folder is left.

Adoption refuses rather than guesses. An mdbox folder whose map is missing is refused, because its messages cannot be located and a folder served empty is the one answer nobody checks. A folder whose index cannot be read is refused by name. The details are in [Adopting the store in place](https://doc.yarilomail.org/latest/installation/migration.html#adoption-this-server-takes-over-the-store-in-place).

## Import into a new store

When the two servers have to coexist for a while, or the mail is going to other storage, read the Dovecot store and write a fresh one:

```sh
# /srv/old-mail/example.com/alice/... is alice@example.com
yarilo-migrate --src dbox-ref --dst mdbox --config /etc/yarilo/yarilo.yaml \
  --from /srv/old-mail --to /var/mail --dry-run
```

`--dry-run` prints what would happen and writes nothing. Run it first, then run the same command without it. The source is never written to, so the import can run against a copy.

Messages, folders, flags, keywords, GUIDs and received dates come across. UIDs and UIDVALIDITY do not: the messages go through the destination's own save path, so clients resynchronise each account once. Subscriptions, ACLs and quota state are not carried.

The source has to be Dovecot's default dbox layout: a folder is a directory under `mailboxes/` with its messages in `dbox-Mails` beneath it. Stop Dovecot for the run, since the importer reads files a running server is still writing.

Read the summary line before telling anyone the migration is done:

```
migration complete migrated=1204 from_index=1198 from_store_scan=6
                   folders_with_index=14 folders_scanned=1
```

`from_store_scan` counts messages recovered from an mdbox folder that had no index. They arrive with their body, GUID and received date, but with no flags and no keywords, and in the folder where each was first saved. A large number there means the folder indexes were not copied along with the store. See [Importing into a new store](https://doc.yarilomail.org/latest/installation/migration.html#import-src-dbox-ref-reads-their-store-and-writes-ours).

## Maildir: point at the tree

A Maildir mailbox is its files, so there is nothing to adopt or import. Point YariloMail at the tree, then fill in what Maildir does not carry, in this order:

```sh
# 1. Stable identifiers. Threading keys on these.
yarilo-migrate --guid-backfill --config /etc/yarilo/yarilo.yaml --dry-run
yarilo-migrate --guid-backfill --config /etc/yarilo/yarilo.yaml

# 2. Conversations, now that every message can be named.
yarilo-migrate --thread-backfill --config /etc/yarilo/yarilo.yaml --dry-run
yarilo-migrate --thread-backfill --config /etc/yarilo/yarilo.yaml
```

The order matters: threading skips a message that has no GUID yet.

## After an adoption or an import: conversations

Conversations are recorded at delivery time, so mail that was already in the store is in none until you say so. GUIDs came across on both routes, which leaves one command:

```sh
yarilo-migrate --thread-backfill --config /etc/yarilo/yarilo.yaml --user alice@example.com --dry-run
yarilo-migrate --thread-backfill --config /etc/yarilo/yarilo.yaml
```

It holds the same per-account lock a delivery takes, so it is safe to run against a live store. Until it has run, IMAP `THREAD` returns one message per thread and JMAP `Thread/get` reports single-message threads for the old mail.

## What the store does not settle

The mail is the largest part of a migration, not the whole of it.

- **Configuration.** Settings keep their established names where they mean the same thing, so translating `dovecot.conf` into `yarilo.yaml` is mechanical for what is covered. [Feature coverage](https://doc.yarilomail.org/latest/architecture/parity.html) lists what is complete, partial and absent. Read it against your configuration before you plan a date.
- **Where each user lives.** Path templates such as `%{user | sha1 % 256 | hex(2)}` hash the same way byte for byte, so a hashed directory layout keeps every user in the bucket they already have. See [path templates](https://doc.yarilomail.org/latest/storage/#path-templates).
- **Accounts.** The passdb chain has SQL, passwd-file and static drivers, and its SQL queries can be written against a schema you already have. See [Authentication](https://doc.yarilomail.org/latest/auth/).
- **SMTP.** YariloMail does not receive mail on port 25. The MTA in front of it, such as Postfix, stays and delivers over LMTP. See [Installation](https://doc.yarilomail.org/latest/installation/).

## A dry run on a copy

Whichever route fits, rehearse it on a copy of one domain: snapshot the store, run the import with `--dry-run` or adopt the copy, open the account in the client your users have, and compare folder counts and unread counts with the original. The rehearsal costs an hour, and a restore of a production store costs far more.
