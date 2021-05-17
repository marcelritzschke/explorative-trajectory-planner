// eslint-disable-next-line no-unused-vars
const colorMap = new Map([
  ['driven', 'rgb(3,90,32)'],
  ['chosen', 'rgb(3,90,32)'],
  ['colliding', 'rgb(95, 30, 30)'],
  ['trajectory', 'rgb(100, 100, 100)'],
  ['inactive', '#ccc'],
  ['grid', '#ccc'],
  ['obstacle', 'black'],
  ['goal', 'rgb(6,62,146)'],
  ['ego', 'rgb(3,90,32)'],
  ['transparent', 'rgb(0,0,0,0)'],
  ['navi', 'rgb(5, 46, 107)'],
]);

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
    this.angle = 0;
    this.steeringAngle = 0;
    this.v = 0;
    this.t = 0;
    this.isColliding = false;
  }
}

// eslint-disable-next-line no-unused-vars
class CarShape {
  constructor() {
    this.width = 1.79/ 2;
    this.length = 4.28/ 2;
    this.safetyDistance = .2;
  }

  getCorners(state) {
    const length = this.length / 2 + this.safetyDistance;
    const width = this.width / 2 + this.safetyDistance;
    const corners = [
      new Pose(length, width),
      new Pose(length, -width),
      new Pose(-length, width),
      new Pose(-length, -width),
    ];

    for (const corner of corners) {
      corner.x += this.safetyDistance;
      corner.y += this.safetyDistance;
      const res = Utils.rotatePoint(corner.x, corner.y, state.angle);
      corner.x = res[0] + state.x;
      corner.y = res[1] + state.y;
    }

    return corners;
  }
}

// eslint-disable-next-line no-unused-vars
class Trajectory {
  constructor() {
    this.segments = [];
    this.cost = 0;
    this.origin = [0, 0, 0];
    this.time = 0;
  }

  get lastSegment() {
    return this.segments[this.segments.length-1];
  };

  get isColliding() {
    return this.lastSegment.isColliding;
  }

  push(segment) {
    this.segments.push(segment);
  }

  unshift(segment) {
    this.segments.unshift(segment);
  }
}

// eslint-disable-next-line no-unused-vars
class Segment {
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

  getDeepCopy() {
    const copy = new Segment();
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

  rescale(oldScale, newScale) {
    this.x *= oldScale / newScale;
    this.y *= oldScale / newScale;
  }
}

// eslint-disable-next-line no-unused-vars
class Obstacle extends BasicObject {
  constructor(x, y, angle, width, height) {
    super(x, y, angle);
    this.width = width;
    this.height = height;
  }

  rescale(oldScale, newScale) {
    super.rescale(oldScale, newScale);
    this.width *= oldScale / newScale;
    this.height *= oldScale / newScale;
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
