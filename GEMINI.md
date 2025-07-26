# Ambler Application Guidelines

When building applications using `ambler.py`, please adhere to the following guidelines to ensure consistency and maintainability.

> IMPORTANT: Never modify the code in `ambler.py`!

## 1. Identify Program Stages (Nodes)

First, break down your program's logic into distinct steps or stages. These will become the "nodes" of your application's flow.

For example, a simple counter application might have the following stages:
- `START`: Initializes the process.
- `STEP`: Performs the counting action.
- `STOP`: Terminates the process.

## 2. Define Nodes

Create a class, typically named `Node`, to define these stages as constants.

```python
class Node:
    START = 1
    STEP = 2
    STOP = 3
```

## 3. Determine Shared State

Decide what data needs to be passed between the different nodes. This will be your "state" object. It can be a simple type (like an integer for a counter) or a more complex data structure (like a dictionary or a custom class).

In the counter example, the state is an integer representing the current count.

## 4. Create Node Functions

For each node, create a corresponding function that takes the current `state` as a parameter. Each function should return a tuple containing:
1. The (potentially modified) `state`.
2. A value that will be used to decide which node to go to next. This can be `None` if there's only one possible next step.

```python
import random

def start(state):
    print("Let's count...")
    return state, None

def step(state):
    count = state + 1
    print(f"...{count}...")
    # Return a boolean to decide whether to continue
    return count, random.choice([True, False])

def stop(state):
    print("...stop.")
    return state, None
```

## 5. Create the `direct` Function

This function acts as the central router for your application. It takes the current `state` and `node` as input and uses the `resolve` function to determine the next step.

The `resolve` function takes two arguments:
1. The result of calling the appropriate node function (the `(state, value)` tuple).
2. A lambda function that takes the `value` from the node function's result and returns the next `Node` to execute.

```python
from ambler import resolve

def direct(state, node):
    if node == Node.START:
        # After 'start', always go to 'STEP'
        return resolve(start(state), lambda _: Node.STEP)
    elif node == Node.STEP:
        # After 'step', check the boolean to either loop or stop
        return resolve(step(state), lambda should_continue: Node.STEP if should_continue else Node.STOP)
    elif node == Node.STOP:
        # 'stop' is the final node, so we return None
        return resolve(stop(state), lambda _: None)
```

## 6. Start the Application

Finally, in your main execution block, call the `amble` function, passing the initial state, the starting node, and a reference to your `direct` function.

```python
from ambler import amble

if __name__ == "__main__":
    # Start with an initial state of 0 at the START node
    amble(0, Node.START, direct)
```
