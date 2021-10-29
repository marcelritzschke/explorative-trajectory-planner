const Utils = require('../utils/utils').Utils;
const Pose = require('../utils/datatypes').Pose;

class ObstacleGrid {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this._ego = new Pose();
    this._grid = this.createObstacleGrid();
  }

  updateEgo(ego) {
    this._ego = ego;
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

    stateGlobal = Utils.getStateInGlobalSystem(this._ego, stateGlobal);

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
