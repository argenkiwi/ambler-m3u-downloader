# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-language implementations of an M3U playlist downloader, all following the same state machine architecture based on the `amble` function. Languages: JavaScript, PHP, Python, Ruby, TypeScript (Deno).

## Commands

### JavaScript (`javascript/`)
```bash
npm install
npm start                        # run app
npm test                         # run all tests
node --test nodes/resolve_urls.test.js  # run single test file
```

### PHP (`php/`)
```bash
composer install
php main.php [file.m3u]
php vendor/bin/phpunit           # run all tests
php vendor/bin/phpunit tests/ResolveUrlsTest.php  # run single test
```

### Python (`python/`)
```bash
uv sync                          # install deps (uses UV, not pip)
python main.py [file.m3u]
pytest                           # run all tests
pytest nodes/test_resolve_urls.py  # run single test file
```

### Ruby (`ruby/`)
```bash
bundle install
ruby main.rb [file.m3u]
ruby -Ilib:test test/test_resolve_urls.rb  # run single test
```

### TypeScript (`typescript/`)
```bash
deno run --allow-read --allow-net main.ts [file.m3u]
deno test                        # run all tests
deno test nodes/resolve_urls_test.ts  # run single test
```

## Architecture

### Core Pattern: The Amble State Machine

Every language implements the same three primitives in `ambler.{js,php,py,rb,ts}`:

- **`Next<S>`** — a state transition: holds a `nextFunc` (the next node to run) and the current `state`
- **`node(factory)`** — wraps a factory function that returns a node; enables lazy initialization and forward references (critical for loops)
- **`amble(initialNode, initialState)`** — the event loop: calls `next.run()` repeatedly until `null` is returned

### State Shape

```typescript
{ m3uFilePath: string | null, urls: string[] }
```

### Node Signature

Every node is an async function: `(state) => Promise<Next<S> | null>`

Nodes accept an `edges` object (routing to other nodes) and an optional `utils` object (injectable dependencies for testing, defaults to real I/O).

### Application Flow (8 nodes)

```
CheckM3UFile → [valid] → ReadM3UFile → PromptOptions
             → [invalid] → PromptM3UFile → CheckM3UFile

PromptOptions → ListUrls → PromptOptions
             → ResolveUrls → SaveM3UFile → PromptOptions
             → DownloadFiles → null (terminates)
             → quit → null (terminates)
```

`ResolveUrls` is only offered when URLs contain `https://downloads.khinsider.com/game-soundtracks`. `DownloadFiles` is only offered when there are no khinsider URLs remaining. Resolving and downloading run in parallel across all URLs.

### Naming Conventions by Language

| Language   | Nodes             | Files              |
|------------|-------------------|--------------------|
| JavaScript | camelCase         | camelCase          |
| TypeScript | camelCase         | camelCase          |
| Python     | snake_case        | snake_case         |
| PHP        | snake_case        | snake_case         |
| Ruby       | PascalCase module | snake_case         |

### Directory Layout (per language)

```
<lang>/
  ambler.{ext}      # Next class, node(), amble()
  state.{ext}       # State type definition (Python, TypeScript)
  main.{ext}        # Entry point — wires all nodes together
  nodes/            # One file per node + test files
  utils/            # resolve_khinsider_url, download_file(s)
```
