const Utils = require('../utils/utils').Utils;
const Pose = require('../utils/datatypes').Pose;

class ObstacleGrid {
  constructor(numberOfRows, numberOfCols) {
    this._numberOfRows = numberOfRows;
    this._numberOfCols = numberOfCols;
    this._ego = new Pose();

    this._grid = [];
    this.reset();
  }

  reset() {
    this._grid = [];
    for (let row = 0; row < this._numberOfRows; row++) {
      this._grid.push([]);
      for (let col = 0; col < this._numberOfCols; col++) {
        this._grid[row].push(0);
      }
    }
  }

  updateEgo(ego) {
    this._ego = ego;
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

    if (X >= this._numberOfRows || Y >= this._numberOfCols || X < 0 || Y < 0) {
      return true;
    }

    return this._grid[X][Y];
  }

  get grid() {
    return this._grid;
  }

  get width() {
    return this._numberOfRows;
  }

  get height() {
    return this._numberOfCols;
  }
}
module.exports.ObstacleGrid = ObstacleGrid;
