const Utils = require('../utils/utils').Utils;
const Pose = require('../utils/datatypes').Pose;

class DistanceToGoalGrid {
  constructor(numberOfRows, numberOfCols, obstacleGrid, model) {
    this._numberOfRows = numberOfRows;
    this._numberOfCols = numberOfCols;
    this._obstacleGrid = obstacleGrid;
    this._ego = new Pose();

    this._grid = [];
    for (let row = 0; row < this._numberOfRows; row++) {
      this._grid.push([]);
      for (let col = 0; col < this._numberOfCols; col++) {
        this._grid[row].push(0);
      }
    }
  }

  get grid() {
    return this._grid;
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

    return this._grid[X][Y];
  }

  calculate(path) {
    for (let row = 0; row < this._numberOfRows; row++) {
      for (let col = 0; col < this._numberOfCols; col++) {
        let closest = Number.MAX_VALUE;
        let minDistance = Number.MAX_VALUE;
        path.forEach((node, idx) => {
          const dist = this.calculateDistance(row, col, node[0], node[1]);
          if (dist < minDistance) {
            minDistance = dist;
            closest = idx;
          }
        });
        this._grid[row][col] = path.length - closest - 1;
      }
    }
  }

  calculateDistance(startRow, startCol, endRow, endCol) {
    return Math.abs(startRow - endRow) +
        Math.abs(startCol - endCol);
  }
}
module.exports.DistanceToGoalGrid = DistanceToGoalGrid;
