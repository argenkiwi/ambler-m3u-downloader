function resolve(result, direct) {
    const [state, action] = result;
    return [state, direct(action)];
}

async function amble(state, edge, follow) {
    let currentState = state;
    let currentEdge = edge;
    while (currentEdge) {
        [currentState, currentEdge] = await follow(currentState, currentEdge);
    }
    return [currentState, null];
}

module.exports = { amble, resolve };
