# MBTI Translator Implementation Plan

> Execute inline using executing-plans, with tests for translation boundaries and a final review.

**Goal:** Build the approved native WeChat translator flow and configurable model backend.
**Architecture:** Native pages share scene configuration and a request adapter; a dependency-free Node HTTP service validates inputs and calls a configurable chat-completions provider. Demo mode is explicit and never pretends to translate arbitrary content.
**Tech Stack:** WXML, WXSS, JavaScript, Node 22, node:test.
**Spec:** docs/superpowers/specs/2026-09-06-mbti-translator-design.md

## Constraints
- Three scenes, two modes, 16 types plus unknown, original text up to 2000 characters.
- Retain original intent during refinements; no automatic message sending.
- Keep provider secrets on server; no conversation persistence or body logging.

## Tasks
- [x] 1. Write tests in tests/translation.test.js for empty/oversized input, enums, refinement, invalid model JSON and explicit demo behavior. Run `node --test`; implement server/translation.js and miniprogram/utils/catalog.js until passing.
- [x] 2. Implement server/index.js with POST /api/translate, GET /health, 24KB body cap, request timeout, per-IP throttling and safe errors. Test through a real local HTTP server with injected provider transport; unconfigured live mode returns 503.
- [x] 3. Implement miniprogram/app.*, pages/index/*, pages/result/* and utils/api.js. Input supports examples, MBTI pickers and optional preferences; result supports copying/refinement/back navigation. Test page state with a lightweight WeChat API harness, including failed requests retaining original input.
- [x] 4. Document developer-tool import, local demo, server environment settings, true device checks and release prerequisites. Run all tests, JavaScript syntax checks, JSON parse checks and inspect repository diff. Report actual verification limits.

## Interface contract
`validateInput(body)` returns a sanitized request or throws a public error.
`translate(body, {env, fetchImpl})` resolves `{demo, versions:[{style,text,reason}]}`.
Styles are fixed to 自然直接、温和共情、简短清晰. Refinement adds `previous` and `direction` while retaining `text`.
`createServer(options)` returns an unbound HTTP server for production startup and ephemeral integration testing.

## Verification outcome
12 automated tests pass; JavaScript syntax and JSON configuration checks pass. WeChat compiler/device rendering and live model semantic checks remain pending because developer tools and model credentials are not available.
