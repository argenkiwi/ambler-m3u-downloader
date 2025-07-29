## Guidelines for TypeScript Ambler Applications

### State and Nodes

- **State**: The state of the application can be any TypeScript type. It should
  be defined as an interface.
- **Nodes**: Nodes should be represented using a TypeScript `enum` for type
  safety and clarity.

### Node Functions

- Each node should have a corresponding `async` function that takes the current
  state as input and returns a tuple containing the new state and the next node
  to transition to. If the next node is `null`, the `amble` function will
  terminate.

### Dispatching

- A `switch` statement within an `async` function (e.g., `direct`) should be
  used to map nodes to their corresponding functions. This provides a clean and
  efficient way to dispatch to the correct function based on the current node.

```typescript
import { amble } from "./ambler.ts";

// 1. Define Nodes
enum Node {
  START,
  STEP,
  STOP,
}

// 2. Define Shared State
interface State {
  count: number;
}

// 3. Create Node Functions
async function start(state: State): Promise<[State, Node]> {
  console.log("Let's count...");
  return [state, Node.STEP];
}

async function step(state: State): Promise<[State, Node | null]> {
  const newCount = state.count + 1;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`...${newCount}...`);
  return [{ count: newCount }, Math.random() < 0.5 ? Node.STEP : Node.STOP];
}

async function stop(state: State): Promise<[State, null]> {
  console.log("...stop.");
  return [state, null];
}

// 4. Start the Application (direct function and amble call)
async function direct(state: State, node: Node): Promise<[State, Node | null]> {
  switch (node) {
    case Node.START:
      return await start(state);
    case Node.STEP:
      return await step(state);
    case Node.STOP:
      return await stop(state);
    default:
      throw new Error(`Unknown node: ${node}`);
  }
}

const initialState: State = { count: 0 };

if (import.meta.main) {
  await amble(initialState, Node.START, direct);
}
```
