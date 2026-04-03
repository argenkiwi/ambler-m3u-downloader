# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Run the application
deno run main.ts

# Run with a specific M3U file
deno run main.ts playlist.m3u

# Run tests
deno test

# Run a single test file
deno test nodes/download_files_test.ts

# Development with hot reload
deno task dev
```

## Architecture

This is a Deno/TypeScript CLI tool for downloading M3U playlists (with special support for Khinsider game soundtrack URLs). It is built on the **Ambler** pattern — a custom state-machine framework defined in `ambler.ts`.

### Core Framework (`ambler.ts`)

Three key constructs:

- **`Nextable<S>`** — type alias for `(state: S) => Promise<Next<S> | null>`
- **`Next<S>`** — wraps the next node function and state to execute
- **`amble<S>()`** — the execution loop: runs nodes until one returns `null`

### Node Pattern

Each feature is a **node factory** — a function that accepts successor nodes and dependencies, and returns a `Nextable<S>`. Nodes never import each other; all wiring happens in `main.ts`.

```typescript
function myNode(onSuccess: Nextable<State>, dep: SomeDep): Nextable<State> {
  return async (state: State) => {
    // do work
    return new Next(onSuccess, updatedState);
    // or return null to end the program
  };
}
```

For circular references (e.g., looping back to self), use a `let` wrapper in `main.ts`:

```typescript
let nodeRef: Nextable<State>;
nodeRef = myNode((state) => nodeRef(state), dep);
```

### Execution Flow

```
checkM3UFile → readM3UFile → promptOptions ──┬── listUrls → (loop)
     ↓                                        ├── resolveUrls → saveM3UFile → (loop)
promptM3UFile → (retry)                       └── downloadFiles → null (end)
```

### State (`state.ts`)

```typescript
interface State {
  m3uFilePath: string | null;
  urls: string[];
}
```

### Directory Structure

- `ambler.ts` — framework core
- `state.ts` — shared state interface
- `main.ts` — dependency injection and application wiring
- `nodes/` — one file per node (feature step)
- `utils/` — side-effectful helpers (HTTP fetch, file download) injected into nodes
- `*_test.ts` / `nodes/*_test.ts` — test files (Deno auto-discovers `*_test.ts`)

### Testing Pattern

Dependencies are injected as mock functions; state transitions are verified by capturing returned `Next` objects:

```typescript
Deno.test("...", async () => {
  const mockDep = async (...) => { ... };
  const node = nodeFactory(mockSuccessor, mockDep);
  const next = await node(initialState);
  assertEquals(next?.state, expectedState);
});
```
