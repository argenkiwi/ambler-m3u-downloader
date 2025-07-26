# Ambler Application Guidelines

When building applications using `ambler.js`, please adhere to the following guidelines to ensure consistency and maintainability.

> IMPORTANT: Never modify the code in `ambler.js`!

## 1. Identify Program Stages (Nodes)

First, break down your program's logic into distinct steps or stages. These will become the "nodes" of your application's flow.

For example, a simple counter application might have the following stages:
- `START`: Initializes the process.
- `STEP`: Performs the counting action.
- `STOP`: Terminates the process.

## 2. Define Nodes

Create a single `object`, typically named `Node`, at the top level of your application (e.g., in `nodes.js` or `main.js`) to define these stages as constants.

```javascript
// nodes.js
const Node = {
    START: 1,
    STEP: 2,
    STOP: 3,
};
module.exports = Node;
```

## 3. Determine Shared State

Decide what data needs to be passed between the different nodes. This will be your "state" object. It can be a simple type (like a `number` for a counter) or a more complex data structure (like an `object` or a custom class).

In the counter example, the state is a number representing the current count.

## 4. Create Node Functions

For each node, create a corresponding function that takes the current `state` as a parameter. Each function should return an `Array` containing:
1. The (potentially modified) `state`.
2. A value that will be used by the `direct` function to decide which node to go to next. This value should NOT be a direct reference to another `Node`.

```javascript
function start(state) {
    console.log("Let's count...");
    return [state, null]; // No direct node reference
}

function step(state) {
    const count = state + 1;
    console.log(`...${count}...`);
    // Return a boolean to decide whether to continue, not a Node
    return [count, Math.random() < 0.5];
}

function stop(state) {
    console.log("...stop.");
    return [state, null]; // No direct node reference
}
```

## 5. Create the `direct` Function

This function acts as the central router for your application. It takes the current `state` and `node` as input and uses the `resolve` function to determine the next step.

The `resolve` function takes two arguments:
1. The result of calling the appropriate node function (the `[state, value]` array).
2. A function that takes the `value` from the node function's result and returns the next `Node` to execute. This is where all routing logic should reside; node functions themselves should not contain direct references to other nodes.

```javascript
const { resolve } = require('./ambler');
const Node = require('./nodes'); // Import the centralized Node definition

async function direct(state, node) {
    if (node === Node.START) {
        // After 'start', always go to 'STEP'
        return resolve(start(state), (_) => Node.STEP);
    } else if (node === Node.STEP) {
        // After 'step', check the boolean to either loop or stop
        return resolve(step(state), (shouldContinue) => (shouldContinue ? Node.STEP : Node.STOP));
    } else if (node === Node.STOP) {
        // 'stop' is the final node, so we return null
        return resolve(stop(state), (_) => null);
    }
}
```

## 6. Start the Application

Finally, in your main execution block, call the `amble` function, passing the initial state, the starting node, and a reference to your `direct` function.

```javascript
const { amble } = require('./ambler');

(async () => {
    // Start with an initial state of 0 at the START node
    await amble(0, Node.START, direct);
})();
```
