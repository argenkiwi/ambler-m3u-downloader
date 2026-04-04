## Guidelines for TypeScript Ambler Applications

### Project Structure

This is a Deno-based application using the **Ambler** pattern (state-machine based control flow).

- **`ambler.ts`**: Core state machine logic.
- **`state.ts`**: Defines the application `State` interface.
- **`main.ts`**: Entry point where nodes are initialized, dependency-injected, and wired together.
- **`nodes/`**: Contains node factories. Each node should be in its own file and handle a specific step of the application logic.
- **`utils/`**: Contains utility functions, side-effect heavy logic (HTTP, FS), and external service clients.
- **`*_test.ts`**: Unit tests for nodes and utilities (Deno auto-discovers these).

### State and Nodes

- **State**: The state of the application is defined as an interface in `state.ts`.
- **Nodes**: Nodes are represented as `async` functions (`Nextable<S>`).
- **Decoupling**: Nodes should not import each other or hardcode side-effect heavy logic. Use the **Factory Pattern** to inject both successor nodes and logic dependencies (like API clients or utilities) during initialization.

### Execution Flow

The current application follows this high-level flow:

```
checkM3UFile → readM3UFile → promptOptions ──┬── listUrls → (loop)
     ↓                                        ├── resolveUrls → saveM3UFile → (loop)
promptM3UFile → (retry)                       └── downloadFiles → null (end)
```

### Node Functions

- A node factory is a function that returns a `Nextable<S>`. Its arguments should include any successor nodes or external logic it needs to execute.
- Each node is an `async` function that takes the current state as input and returns a `Promise<Next<S> | null>`.
- A node function returns a `Next` object to transition to the next node with a (possibly updated) state.
- If a node function returns `null`, the `amble` loop terminates.

### Transitions and Cycles

- Nodes transition to each other by returning a new `Next` instance that encapsulates the next node function and the new state.
- Dependencies between nodes and utilities are wired together in `main.ts`.
- **Handling Cycles**: To handle circular transitions (e.g., a node looping back to a previous one), use function wrappers or `let` variables to defer evaluation of the next node.

```typescript
// Example: Using a function wrapper to handle a cycle back to the main menu in main.ts
const listNode = (state: State) => listUrls({ onSuccess: optionsMenu })(state);

const optionsMenu = promptOptions({
  onList: listNode,
  // ...
});
```

### Example: Node Factory with DI

```typescript
// nodes/my_node.ts
import { Next, Nextable } from "../ambler.ts";
import { State } from "../state.ts";

export function myNode(
  onSuccess: Nextable<State>,
  externalService: (data: string) => Promise<void>
): Nextable<State> {
  return async (state: State): Promise<Next<State>> => {
    await externalService(state.someData);
    return new Next(onSuccess, state);
  };
}
```

### Wiring in `main.ts`

```typescript
import { amble } from "./ambler.ts";
import { State } from "./state.ts";
import { myNode } from "./nodes/my_node.ts";
import { myUtility } from "./utils/my_utility.ts";

const initialState: State = { /* ... */ };

const successNode = async (state: State) => {
  console.log("Done!");
  return null;
};

// Wiring nodes with their dependencies
const startNode = myNode(successNode, myUtility);

if (import.meta.main) {
  await amble(startNode, initialState);
}
```

### Testing Pattern

Dependencies should be injected as mock functions. State transitions are verified by capturing returned `Next` objects.

```typescript
import { assertEquals } from "@std/assert";
import { Next } from "../ambler.ts";
import { myNode } from "./my_node.ts";

Deno.test("myNode transitions to onSuccess", async () => {
  const onSuccess = async (s: any) => null;
  const mockService = async (d: string) => {};
  
  const node = myNode(onSuccess, mockService);
  const next = await node({ someData: "test" } as any);
  
  assertEquals(next instanceof Next, true);
});
```
