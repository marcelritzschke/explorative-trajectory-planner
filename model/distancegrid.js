const Utils = require('../utils/utils').Utils;
const Pose = require('../utils/datatypes').Pose;

class DistanceGrid {
  constructor(numberOfRows, numberOfCols) {
    this._numberOfRows = numberOfRows;
    this._numberOfCols = numberOfCols;
    this._ego = new Pose();

    this._grid = [];
    this.reset();
  }

  get grid() {
    return this._grid;
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

  getX(x) {
    return parseInt(x);
  }

  getY(y) {
    return parseInt(y);
  }

  getDistance(state) {
    let stateGlobal = Object.assign({}, state);

    stateGlobal = Utils.getStateInGlobalSystem(this._ego, stateGlobal);

    const X = this.getX(stateGlobal.x);
    const Y = this.getY(stateGlobal.y);

    if (X >= this._numberOfRows || Y >= this.numberOfCols || X < 0 || Y < 0) {
      return Number.MAX_VALUE;
    }

    return this._grid[X][Y];
  }

  calculate(path) {
    for (let row = 0; row < this._numberOfRows; row++) {
      for (let col = 0; col < this._numberOfCols; col++) {
        let minDistance = Number.MAX_VALUE;
        path.forEach((node) => {
          const dist = this.calculateDistance(row, col, node[0], node[1]);
          minDistance = Math.min(minDistance, dist);
        });
        this._grid[row][col] = minDistance;
      }
    }
  }

  calculateDistance(startRow, startCol, endRow, endCol) {
    return Math.abs(startRow - endRow) +
        Math.abs(startCol - endCol);
  }
}
module.exports.DistanceGrid = DistanceGrid;
