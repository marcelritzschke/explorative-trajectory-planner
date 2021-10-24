const Utils = require('../utils/utils').Utils;

class DistanceGrid {
  constructor(numberOfRows, numberOfCols, model) {
    this._numberOfRows = numberOfRows;
    this._numberOfCols = numberOfCols;
    this._model = model;

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

  getX(x) {
    return parseInt(x);
  }

  getY(y) {
    return parseInt(y);
  }

  getDistance(state) {
    let stateGlobal = Object.assign({}, state);

    stateGlobal = Utils.getStateInGlobalSystem(this._model.getEgo(),
        stateGlobal);

    const X = this.getX(stateGlobal.x);
    const Y = this.getY(stateGlobal.y);

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
