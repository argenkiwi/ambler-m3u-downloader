---
name: add-ambler-node
description: Add a new node to the TypeScript ambler state machine. Use this skill when the user wants to create a new node in the nodes/ directory, wire it into main.ts, and write tests for it.
metadata:
  author: claude
  version: "1.0"
---

# Add Ambler Node

This skill guides adding a new node to the TypeScript ambler state machine in `/Users/leandro/Code/ambler-m3u-downloader/typescript/`.

## Overview of the Architecture

The ambler state machine consists of:
- `ambler.ts` — defines `Next<S>`, `node()`, `amble()`, and the `Nextable<S>` type
- `state.ts` — defines the global `State` interface `{ m3uFilePath: string | null; urls: string[] }`
- `main.ts` — wires all nodes into a `Record<string, Nextable<State>>` graph and calls `amble()`
- `nodes/` — one file per node, one test file per node

## Step 1: Understand the Node Being Added

Before writing anything:
1. Ask the user what the node should do if not clear.
2. Identify its edges: what nodes does it transition to? (Terminal nodes return `null`.)
3. Identify what state it reads and mutates.
4. Identify what I/O or external calls it makes (these go in `Utils`).

## Step 2: Create the Node File

Create `nodes/<node_name>.ts` using the **namespace pattern**:

```typescript
import { Next, Nextable } from "../ambler.ts";

export namespace NodeName {
  // State fields this node requires
  export interface State {
    someField: string;
  }

  // Edges to other nodes (omit if terminal)
  export type Edges<S> = {
    onSuccess: Nextable<S>;
    onFailure: Nextable<S>; // Add only edges that are used
  };

  // Injectable dependencies for testability (omit if no I/O)
  export type Utils = {
    readLine: () => Promise<string>;
  };

  const defaultUtils: Utils = {
    readLine: async () => { /* real I/O */ return ""; },
  };

  export function create<S extends State>(
    edges: Edges<S>,        // omit if terminal node
    utils: Utils = defaultUtils  // omit if no I/O
  ): Nextable<S> {
    return async (state: S): Promise<Next<S> | null> => {
      // Node logic here
      return new Next(edges.onSuccess, { ...state });
    };
  }
}
```

### Key rules for the node file:

- **Namespace**: Always wrap in `export namespace NodeName { ... }`.
- **State interface**: Declare only the state fields this node needs; the generic `S extends State` handles the full state.
- **Edges type**: One edge per possible transition. Name them `onSuccess`, `onFailure`, `onRead`, `onPrompt`, etc. — use `on` prefix + past or destination concept.
- **Utils type**: Only include I/O or external calls here (file reads/writes, stdin, HTTP). Pure logic does not need Utils.
- **`defaultUtils`**: The real implementation used in production.
- **`create()` factory**: Takes `edges` first, `utils` second (with default). Returns `Nextable<S>`.
- **State immutability**: Always spread state when modifying: `{ ...state, field: newValue }`.
- **Return types**:
  - `Promise<Next<S>>` — always continues (no null possible)
  - `Promise<Next<S> | null>` — may terminate (e.g., menu nodes, terminal nodes)
  - Terminal nodes: return `null` directly (no edges needed)
- **Precondition errors**: Throw `Error` for invalid state that should never happen: `throw new Error("Field is not defined.")`.
- **Parallel async**: Use `Promise.all(array.map(...))` for parallel operations.
- **Self-recursion for re-prompt**: Return `new Next(NodeName.create(edges, utils), state)` to loop back.

### Node type examples by behavior:

**Terminal node** (no edges, returns null):
```typescript
export function create<S extends State>(utils: Utils = defaultUtils): Nextable<S> {
  return async (_state: S): Promise<null> => {
    utils.log("Done!");
    return null;
  };
}
```

**Single-edge linear node**:
```typescript
export function create<S extends State>(edges: Edges<S>, utils: Utils = defaultUtils): Nextable<S> {
  return async (state: S): Promise<Next<S>> => {
    const data = await utils.readData();
    return new Next(edges.onSuccess, { ...state, data });
  };
}
```

**Branching node** (multiple edges):
```typescript
export function create<S extends State>(edges: Edges<S>): Nextable<S> {
  return async (state: S): Promise<Next<S>> => {
    if (someCondition(state)) {
      return new Next(edges.onValid, state);
    }
    return new Next(edges.onInvalid, { ...state, field: null });
  };
}
```

**Menu/loop node** (returns null possible):
```typescript
export function create<S extends State>(edges: Edges<S>, utils: Utils = defaultUtils): Nextable<S> {
  return async (state: S): Promise<Next<S> | null> => {
    while (true) {
      const input = await utils.readLine();
      if (input === "quit") return new Next(edges.onExit, state);
      if (input === "go") return new Next(edges.onGo, state);
      console.log("Invalid input.");
    }
  };
}
```

## Step 3: Write the Test File

Create `nodes/<node_name>_test.ts`:

```typescript
import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { NodeName } from "./<node_name>.ts";
import { State } from "../state.ts";
import { Nextable } from "../ambler.ts";

Deno.test("<node_name> should <behavior>", async () => {
  // 1. Create mock utils
  const mockUtils: NodeName.Utils = {
    readLine: async () => "test input",
  };

  // 2. Create capturing edge to verify state
  let capturedState: State | undefined;
  const onSuccess: Nextable<State> = async (state: State) => {
    capturedState = state;
    return null;
  };

  // 3. Create node and call it
  const nodeFunc = NodeName.create({ onSuccess }, mockUtils);
  const next = await nodeFunc(initialState);

  // 4. Execute the next step to capture state
  if (!next) throw new Error("Expected Next, got null");
  await next.run();

  // 5. Assert
  assertEquals(capturedState?.someField, expectedValue);
});
```

### Testing rules:

- **Mock utils inline**: Create `mockUtils` objects matching `NodeName.Utils`.
- **Capturing edges**: Use a `Nextable<State>` that records `capturedState` to verify state transformations.
- **Always call `next.run()`**: The edge's capturing only fires when `next.run()` executes.
- **Test null return**: For terminal nodes, assert `assertEquals(next, null)`.
- **Test error cases**: Use `assertRejects()` for nodes that throw on bad state.
- **Test each branch**: Write a separate `Deno.test()` for each edge/branch.
- **Test self-recursion**: For re-prompt loops, verify the looping behavior with a counter or state tracking.

### Error test pattern:
```typescript
Deno.test("<node_name> throws when field is missing", async () => {
  const onSuccess: Nextable<State> = async (_state) => null;
  const nodeFunc = NodeName.create({ onSuccess });

  await assertRejects(
    () => nodeFunc({ ...initialState, m3uFilePath: null }),
    Error,
    "M3U file path is not defined."
  );
});
```

## Step 4: Wire into main.ts

1. Import the new node at the top of `main.ts`:
   ```typescript
   import { NodeName } from "./nodes/<node_name>.ts";
   ```

2. Add it to the `nodes` record:
   ```typescript
   const nodes: Record<string, Nextable<State>> = {
     // existing entries...
     newNode: node(() => NodeName.create({ onSuccess: nodes.someOther })),
   };
   ```

3. If the new node is referenced by other nodes, add the reference to those nodes' edges too.

4. Update the entry point if the new node should be the first to run:
   ```typescript
   await amble(nodes.newNode, initialState);
   ```

### Wiring rules:
- Always wrap with `node(() => ...)` to allow forward/circular references.
- Choose a short, descriptive key for the `nodes` record (e.g., `check`, `read`, `prompt`, `options`).
- Thread the new node through any existing nodes that should route to it.

## Step 5: Verify

Run the tests:
```bash
deno test nodes/<node_name>_test.ts
```

Run all tests to confirm nothing is broken:
```bash
deno test
```

Run the app to verify the flow works end-to-end:
```bash
deno run --allow-read --allow-net main.ts
```

## File Naming Convention

| What | Convention | Example |
|---|---|---|
| Node file | `snake_case.ts` | `check_m3u_file.ts` |
| Test file | `snake_case_test.ts` | `check_m3u_file_test.ts` |
| Namespace | `PascalCase` | `CheckM3UFile` |
| Edges keys | `on` + PascalCase | `onSuccess`, `onRead`, `onPrompt` |
| `nodes` record key | `camelCase` short name | `check`, `read`, `options` |

## Checklist

- [ ] Node file created at `nodes/<name>.ts` with `namespace`, `State`, `Edges<S>` (if needed), `Utils` (if needed), `create()` factory
- [ ] `defaultUtils` implements real I/O
- [ ] State modifications use spread operator `{ ...state, ... }`
- [ ] Test file created at `nodes/<name>_test.ts` covering happy path and edge cases
- [ ] Imported and added to `nodes` record in `main.ts` using `node(() => ...)` wrapper
- [ ] Existing nodes updated to route to new node if needed
- [ ] `deno test` passes
