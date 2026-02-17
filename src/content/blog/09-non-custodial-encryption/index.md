---
title: "What If Your Cloud Provider Literally Could Not Read Your Files?"
description: "How non-custodial encryption lets you store data with any provider while keeping the keys to yourself."
date: "Aug 16 2024"
---

**TL;DR:** Non-custodial encryption lets you store files with any cloud provider without the provider being able to read them. Your blockchain wallet derives a one-time encryption key, encrypts everything client-side, and the key is thrown away — never stored, never transmitted. A second technique lets you share individual files from an encrypted package without decrypting the rest.

## The problem with trusting cloud providers

You upload a photo to Google Drive. Google can see it. Their engineers can access it during debugging. Their ML pipelines can scan it for content moderation. Law enforcement can request it with a subpoena, and [Google received over 150,000 such requests in the first half of 2024 alone](https://transparencyreport.google.com/user-data/overview). If an insider goes rogue or a system gets misconfigured, your data is exposed. Just ask the [100 million Capital One customers](https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/) whose records were accessed through a cloud infrastructure vulnerability in 2019.

The obvious objection: yes, you *can* encrypt files before uploading. GPG, VeraCrypt, whatever you like. But you won't. Not consistently. Manual encryption means managing keys and passphrases yourself, remembering which key decrypts which file, backing up keyrings, and doing all of this every single time you save something. Almost nobody does this.

Non-custodial encryption is a different approach. The service that stores your data never has access to the decryption keys. Keys are generated on your device, used once, and discarded from memory. The storage provider only ever sees ciphertext.

Here's the interesting part: there's a technique that makes this practical by using something millions of people already have: a blockchain wallet.

## The 30-second version

Think of your wallet's private key as a unique wax seal ring. When you want to encrypt a file, the server gives you a fresh block of wax (a random token). You press your ring into the wax, creating a unique impression (a symmetric encryption key). You use that impression to lock a box around your data.

The locksmith who made the wax never touched your ring. The warehouse storing the locked box never sees what's inside. And the wax impression is melted after use.

Mapped to real components: the ring is your private key, the wax block is a server-issued token, the impression is a derived [AES-CBC](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_block_chaining_(CBC)) key, and the locked box is your encrypted data. The server knows which token it issued, but without your ring, it can't reproduce the impression.

## Under the hood

### Encrypting a file

The encryption flow works in seven steps:

1. The client sends an encryption request to the remote server.
2. The server generates a random token unique to this session and returns it.
3. The client's blockchain wallet signs the token using [`ECDSA`](https://datatracker.ietf.org/doc/html/rfc6979) (Elliptic Curve Digital Signature Algorithm). The wallet ([MetaMask](https://docs.metamask.io/wallet/how-to/sign-data/), for example) pops up a confirmation dialog so you explicitly authorize the signing.
4. The resulting cryptographic signature is fed into [`PBKDF2`](https://datatracker.ietf.org/doc/html/rfc8018) (Password-Based Key Derivation Function 2) to produce a symmetric encryption key (`AES-CBC`).
5. The client encrypts the files with this key.
6. Encrypted files are sent to the storage provider.
7. The symmetric key and signature are deleted from memory. They're never transmitted to the server or stored anywhere.

Decryption is straightforward. The same private key signing the same token always produces the same signature. The same signature always derives the same symmetric key. So when you need your files back, the server provides the same token, your wallet signs it again, and the client re-derives the identical key. Deterministic. No key storage needed.

What if you lose access to your wallet? The system supports recovery through [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing). Your private key is split into multiple shares distributed across independent servers: one share on your device, one on a remote authentication server, and one on a recovery device. A threshold number of shares (for example, 2 out of 3) can reconstruct the key. No single server holds enough to recover it alone.

### Going granular: encrypting objects, not blobs

The encryption flow above works well for a batch of files, but it has a problem. Say you export your data from Google using [Google Takeout](https://takeout.google.com/). You get a zip file containing emails, photos, documents, chat logs. If you encrypt that zip as a single blob with one key, sharing a single photo means decrypting the entire archive, extracting the file, re-encrypting the subset, and sending it. Expensive and impractical.

The solution: encrypt each data object independently. Every file in the package gets its own token from the server and its own derived key. The container structure (the folder hierarchy) stays intact and unencrypted. The contents of each file are opaque.

After encrypting all objects, the system generates a **metadata file**, a JSON index mapping each encrypted object to its token, name, scope (which data source it came from), and storage URL. This metadata file is encrypted with the user's public key, so only you can read it. It's your personal catalog of everything you've encrypted, browsable without decrypting the underlying files.

The system also publishes a **schema**, a description of *categories* of data you have ("email messages," "photos from 2023," "chat logs") without revealing the actual content. Third parties can browse this schema to understand what data you hold and what they might want to request.

The exchange flow ties it together. A third party (a research firm, an advertiser, an app) browses the published schema, finds something relevant, and requests access to specific objects. You get a notification. You approve or deny. If you approve, only the approved objects are decrypted and delivered. The requesting party receives the cryptographic signature for only those specific tokens, derives the keys, and decrypts just those objects.

Your private key is never shared. The third party only gets your signature for the tokens you approved.

## What this looks like in practice

Walk through a concrete scenario. You export your social media data: posts, messages, photos, profile info. You run it through the encryption pipeline. Each file gets its own token and key. The encrypted package goes to a storage provider. You have a metadata file listing everything, and a published schema saying "this user has posts, direct messages, photos, and profile data."

A research firm studying public discourse browses the schema. They want your posts but nothing else. They submit a request through the exchange platform. You get a notification: "Research Corp wants access to your posts." You approve posts, deny messages and photos.

The system provides the research firm with your signature for only the post-related tokens. They derive the keys for those objects, decrypt just the posts, and get to work. Your messages and photos remain encrypted and untouched.

At no point did the storage provider see your plaintext data. The server that generates tokens never had your private key. The research firm never had access to anything you didn't approve. Nobody had the full dataset or the master key, because there is no master key.

## The catch

This is not a silver bullet. Some honest caveats.

The entire scheme hangs on having a blockchain wallet. For Web3-native users, that's fine. For everyone else, it means downloading MetaMask or [Web3Auth](https://web3auth.io/docs/), understanding signing prompts, and backing up seed phrases. I think the wallet dependency is the biggest barrier to adoption outside Web3-native audiences. Per-object key derivation via PBKDF2 compounds the friction. The slowness is a security feature, not a bug, but when you're encrypting a package with thousands of small files, each needing its own token-sign-derive cycle, the time adds up.

Trust isn't eliminated here, just shifted. The server generates the tokens. If it's compromised and starts issuing predictable ones, the security model weakens. The exchange platform handles your signature after you approve a request — you're trusting it to deliver only what you approved and to discard the signature afterward. Shamir's Secret Sharing adds another layer of coordination risk: recovery shares need to be held by genuinely independent, reliably available, secure servers. If two of three share-holders are compromised, your key is exposed.

## Further reading

The techniques described here are covered by two US patents. Full filings:

- [US 11,831,407 — Non-Custodial Techniques for Data Encryption and Decryption](/docs/patents/11831407.pdf)
- [US 12,047,496 — Noncustodial Techniques for Granular Encryption and Decryption](/docs/patents/12047496.pdf)

Related specs and resources:

- [RFC 8018 — PBKDF2 Specification](https://datatracker.ietf.org/doc/html/rfc8018)
- [RFC 6979 — Deterministic ECDSA](https://datatracker.ietf.org/doc/html/rfc6979)
- [Shamir's Secret Sharing (Wikipedia)](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing)
- [MetaMask — Signing Data](https://docs.metamask.io/wallet/how-to/sign-data/)
- [Web3Auth Documentation](https://web3auth.io/docs/)
