# Roop · रूप

Standalone, static writing space. Marathi/English UI. No AI brain is connected.

## Publish

This repository is independent of other applications. Publish the `docs` folder from the default branch using GitHub Pages. No API token or backend is needed at runtime. For a project-site URL, all asset links are relative. Keep the source and deployment in this separate repository.

To rebuild: `npm ci && npm run build`. Runtime dependencies are bundled locally; the app loads no CDN scripts, analytics, remote fonts or AI endpoints.

## Privacy boundary

The page and its source are public. It is not an owner-authenticated website. Every visitor can set up a separate local vault in their own browser. An existing local vault opens only with its passphrase. No notes or passphrase are included in the published files.

Only an AES-GCM encrypted envelope (salt, random IV, ciphertext) is written to localStorage. A PBKDF2 SHA-256 key is derived from the user's passphrase with 310,000 iterations; the passphrase and key stay in memory while unlocked and are cleared on lock. The page locks on leaving it or after five idle minutes. A forgotten passphrase has no recovery. Clearing browser data can remove notes. No cross-device sync. Browser/device compromise and a changed or malicious published application are outside this lock's protections.

The first version has a small note budget and reports storage failure rather than pretending a note saved. Before relying on it, save a harmless test, check the status, close/reopen, unlock and confirm the note returns. Prefer a normal Safari/Chrome tab over temporary/private browser mode.

## Moving from another host

Browser storage belongs to its origin. Notes and passphrase from another host do not automatically move here. This installation starts empty. The earlier host is not deleted by this migration.

## Checks

The prepared build passed local browser tests for setup, Marathi/English mixed-text save, ciphertext-only storage, reload lock, correct-passphrase recovery, wrong-passphrase rejection, notes/settings views, erase, language switch and no page errors. Screenshots were inspected at 390px and desktop. The compiled target includes Safari 14 syntax; a real iPhone/WebKit test is still required after deployment. No voice, dictation, external AI, paid service, personalised greeting or server is connected.

## Gated browser-brain trial (revision 2)

This adds an opt-in English-first SmolLM2 135M trial, not a full-quality Marathi assistant. No automatic model download. The unlocked chat offers Check phone first, which checks WebGPU and shader-f16. A supported result is feature detection, not a guarantee of inference. The user's separate Download tiny trial button loads the model from Hugging Face and its WASM runtime from GitHub. Those download hosts see ordinary network metadata. Chat text is passed only to the local engine.

Measured weights manifest: 269,030,016 bytes at https://huggingface.co/mlc-ai/SmolLM2-135M-Instruct-q0f16-MLC/resolve/main/ndarray-cache.json . Runtime and working memory are additional. Engine config uses 512-token context, at most 96 output tokens, and short recent history. The model primarily works in English, may hallucinate, and is not an acceptable substitute for verified factual or professional answers.

Lock interrupts generation and unloads the engine; a generation/session guard discards late replies after lock. Model cache can remain on the device; it contains public weights, not chat. Browser storage may be evicted. Closing the trial during load disables/discards its result but may not stop the current network download. No model choice or AI session is silently resumed.

A service worker caches the app shell for later offline loading. WebLLM caches model artifacts. Full offline inference needs a real target-phone test after first download; it is NOT verified in the build environment. The test GPU lacks shader-f16, and the check correctly refuses the download with no app error. No claim of successful LLM generation on an actual iPhone is made. Public iOS reports describe both tiny-model success and larger-model tab crashes. Use the trial on the actual phone before calling it ready.

Source/license: https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct (Apache 2.0); WebLLM https://github.com/mlc-ai/web-llm (Apache 2.0). Build dependencies are pinned in package-lock.json. Preserve their notices.


## Deployment note

The published bundle file is `docs/6-app.js` (the upload tool prefixed its name). `docs/index.html` and `docs/sw.js` reference it. A fresh `npm run build` writes `docs/app.js`; update those two references if you publish that file instead.
