## Guidelines for TypeScript Ambler Applications

### State and Nodes

- **State**: The state of the application can be any TypeScript type. It should
  be defined as an interface.
- **Nodes**: Nodes are represented as `async` functions (`Nextable<S>`).
- **Decoupling**: Nodes should not import each other or hardcode side-effect heavy logic. Use the **Factory Pattern** to inject both successor nodes and logic dependencies (like API clients or utilities) during initialization.

### Node Functions

- A node factory is a function that returns a `Nextable<S>`. Its arguments should include any successor nodes or external logic it needs to execute.
- Each node is an `async` function that takes the current state as input and returns a `Promise<Next<S> | null>`.
- A node function returns a `Next` object to transition to the next node with a (possibly updated) state.
- If a node function returns `null`, the `amble` loop terminates.

### Transitions

- Nodes transition to each other by returning a new `Next` instance that encapsulates the next node function and the new state.
- Dependencies between nodes are wired together in a central location (e.g., `main.ts`).

```typescript
import { amble, Next, Nextable } from "./ambler.ts";

// 1. Define Shared State
interface State {
  count: number;
}

// 2. Create Node Factories
function start(onSuccess: Nextable<State>): Nextable<State> {
  return async (state: State) => {
    console.log("Let's count...");
    return new Next(onSuccess, state);
  };
}

function step(onRepeat: Nextable<State>, onStop: Nextable<State>): Nextable<State> {
  return async (state: State) => {
    const newCount = state.count + 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`...${newCount}...`);
    
    const nextNode = Math.random() < 0.5 ? onRepeat : onStop;
    return new Next(nextNode, { count: newCount });
  };
}

const stop: Nextable<State> = async (state: State) => {
  console.log("...stop.");
  return null;
};

// 3. Start and Wire the Application
const initialState: State = { count: 0 };

if (import.meta.main) {
  // Use let/wrappers for circular references if needed
  let stepNode: Nextable<State>;
  stepNode = step((state) => stepNode(state), stop);
  
  const startNode = start(stepNode);

  await amble(startNode, initialState);
}
```
