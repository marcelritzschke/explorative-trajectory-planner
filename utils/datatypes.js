const Utils = require('./utils').Utils;

const colorMap = new Map([
  ['driven', 'rgb(3,90,32)'],
  ['chosen', 'rgb(3,90,32)'],
  ['colliding', 'rgb(95, 30, 30)'],
  ['trajectory', 'rgb(100, 100, 100)'],
  ['inactive', '#ccc'],
  ['grid', '#ccc'],
  ['background', 'white'],
  ['obstacle', 'rgb(5, 46, 107)'],
  ['goal', 'rgb(6,62,146)'],
  ['ego', 'rgb(3,90,32)'],
  ['transparent', 'rgb(0,0,0,0)'],
  ['navi', 'rgb(5, 46, 107)'],
  ['astartentative', 'rgb(0, 150, 25)'],
  ['astarvisited', 'rgb(0, 83, 21)'],
  ['path', 'rgb(200, 200, 0)'],
]);
module.exports.colorMap = colorMap;

class Pose {
  constructor(x = 0, y = 0, angle = 0) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }
}
module.exports.Pose = Pose;

class State {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.steeringAngle = 0;
    this.v = 0;
    this.t = 0;
    this.isColliding = false;
  }
}
module.exports.State = State;

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
      new Pose(0, width), // Point on middle of car to avoid ghosting
      new Pose(0, -width), // Point on middle of car to avoid ghosting
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
module.exports.CarShape = CarShape;

class Trajectory {
  constructor() {
    this.segments = [];
    this.cost = 0;
    this.origin = [0, 0, 0];
    this.time = 0;
    this.isReachGoal = false;
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
module.exports.Trajectory = Trajectory;

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
module.exports.Segment = Segment;

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
module.exports.BasicObject = BasicObject;

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
module.exports.Obstacle = Obstacle;

class Shape {
  constructor(name, id, fabricObject) {
    this.name = name;
    this.id = id;
    this.fabricObject = fabricObject;
  }
}
module.exports.Shape = Shape;

class ObstacleGrid {
  constructor(width, height, model) {
    this._width = width;
    this._height = height;
    this._model = model;
    this._grid = this.createObstacleGrid();
  }

  createObstacleGrid() {
    const grid = [];

    for (let i=0; i<this._width; ++i) {
      grid.push([]);
      for (let j=0; j<this._height; ++j) {
        grid[i].push(false);
      }
    }

    return grid;
  }

  clear() {
    this._grid = Object.assign({}, this.createObstacleGrid());
  }

  setObstacle(pose) {
    const X = this.getX(pose.x);
    const Y = this.getY(pose.y);
    this._grid[X][Y] = true;
  }

  toggleObstacle(pose) {
    const X = this.getX(pose.x);
    const Y = this.getY(pose.y);
    this._grid[X][Y] = !this._grid[X][Y];
  }

  getX(x) {
    return parseInt(x);
  }

  getY(y) {
    return parseInt(y);
  }

  isColliding(state) {
    let stateGlobal = Object.assign({}, state);

    stateGlobal = Utils.getStateInGlobalSystem(this._model.getEgo(),
        stateGlobal);

    const X = this.getX(stateGlobal.x);
    const Y = this.getY(stateGlobal.y);

    return this._grid[X][Y];
  }

  get grid() {
    return this._grid;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}
module.exports.ObstacleGrid = ObstacleGrid;
