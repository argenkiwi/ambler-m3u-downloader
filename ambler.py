def resolve(result, direct):
    state, action = result
    return state, direct(action)

def amble(state, edge, follow):
    current_state = state
    current_edge = edge
    while current_edge is not None:
        current_state, current_edge = follow(current_state, current_edge)
    return current_state, None
