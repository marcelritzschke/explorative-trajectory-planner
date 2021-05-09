function State() {
    this.x = 0;
    this.y = 0;
    this.theta = 0;
    this.v = 0;
}

class Trajectory {
    constructor(states) {
        if(typeof states === typeof undefined) {
            this.states = [];
        }
        else {
            this.states = states;
        }
    }

    get lastState() {
        return this.states[this.states.length-1];
    };
}