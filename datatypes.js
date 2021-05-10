// eslint-disable-next-line no-unused-vars
class State {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.theta = 0;
    this.v = 0;
    this.isColliding = false;
  }
}

// eslint-disable-next-line no-unused-vars
class Trajectory {
  constructor(states) {
    this.states = states;
    this.prevIdx = 0;
    this.cost = 0;

    if (typeof states === typeof undefined) {
      this.states = [];
    }
  }

  get isColliding() {
    return this.lastState.isColliding;
  }

  get lastState() {
    return this.states[this.states.length-1];
  };
}

// eslint-disable-next-line no-unused-vars
class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  isColliding(state) {
    if (state.x < this.x + this.width/2 &&
      state.x > this.x - this.width/2 &&
      state.y < this.y + this.height/2 &&
      state.y > this.y - this.height/2
    ) {
      return true;
    } else {
      return false;
    }
  }
}

// eslint-disable-next-line no-unused-vars
function Shape(name, id, object) {
  this.name = name;
  this.id = id;
  this.object = object;
}
