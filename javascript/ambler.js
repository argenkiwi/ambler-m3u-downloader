export class Next {
    constructor(nextFunc, state) {
        this.nextFunc = nextFunc;
        this.state = state;
    }

    async run() {
        return this.nextFunc(this.state);
    }
}

export async function amble(initial) {
    let next = initial;
    while (next) {
        next = await next.run();
    }
}
