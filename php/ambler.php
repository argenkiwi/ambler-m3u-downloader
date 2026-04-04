<?php

class Next {
    private $nextFunc;
    public mixed $state;

    public function __construct(callable $nextFunc, mixed $state) {
        $this->nextFunc = $nextFunc;
        $this->state = $state;
    }

    public function run(): ?Next {
        return ($this->nextFunc)($this->state);
    }
}

function node(callable $factory): callable {
    return fn($state) => $factory()($state);
}

function amble(callable $initial, mixed $state): void {
    $next = $initial($state);
    while ($next !== null) {
        $next = $next->run();
    }
}
