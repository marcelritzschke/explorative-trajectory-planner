// eslint-disable-next-line no-unused-vars
class Pose {
  constructor(x = 0, y = 0, angle = 0) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }
}

// eslint-disable-next-line no-unused-vars
class State {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.theta = 0;
    this.v = 0;
    this.t = 0;
    this.isColliding = false;
  }
}

// eslint-disable-next-line no-unused-vars
class Trajectory {
  constructor(states) {
    this.states = states;
    this.prevIdx = 0;
    this.cost = 0;
    this.origin = [0, 0, 0];
    this.time = 0;

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

  getDeepCopy() {
    const copy = new Trajectory();
    copy.prevIdx = this.prevIdx;
    copy.cost = this.cost;
    this.states.forEach((state) => {
      const cpy = Object.assign({}, state);
      copy.states.push(cpy);
    });
    return copy;
  }
}

class BasicObject {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }
}

// eslint-disable-next-line no-unused-vars
class Obstacle extends BasicObject {
  constructor(x, y, angle, width, height) {
    super(x, y, angle);
    this.width = width;
    this.height = height;
  }

  isColliding(state) {
    const mid = Utils.rotatePoint(this.x, this.y, this.angle);
    const point = Utils.rotatePoint(state.x, state.y, this.angle);

    if (point[0] < mid[0] + this.height/2 &&
      point[0] > mid[0] - this.height/2 &&
      point[1] < mid[1] + this.width/2 &&
      point[1] > mid[1] - this.width/2
    ) {
      return true;
    } else {
      return false;
    }
  }
}

// eslint-disable-next-line no-unused-vars
class Shape {
  constructor(name, id, fabricObject, object = null) {
    this.name = name;
    this.id = id;
    this.fabricObject = fabricObject;
    this.object = object;
  }
}
