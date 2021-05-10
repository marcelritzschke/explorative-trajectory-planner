function State() {
    this.x = 0;
    this.y = 0;
    this.theta = 0;
    this.v = 0;
}

class Trajectory {
    constructor(states) {
        this.states = states;
        this.prevIdx = 0;
        this.cost = 0;

        if(typeof states === typeof undefined) {
            this.states = [];
        }
    }

    get lastState() {
        return this.states[this.states.length-1];
    };
}