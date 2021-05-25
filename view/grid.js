const colorMap = require('../utils/datatypes').colorMap;

class Grid {
  constructor(width, height, scale) {
    this._width = width;
    this._height = height;
    this._scale = scale;
    this._X = parseInt(width/ scale);
    this._Y = parseInt(height/ scale);
    this._object = this.createGrid();
  }

  get object() {
    return this._object;
  }

  toggleSquare(row, col) {
    const idx = this._X * col + row;
    if (this._object._objects[idx].fill === colorMap.get('background')) {
      this._object._objects[idx].set({fill: colorMap.get('obstacle')});
    } else {
      this._object._objects[idx].set({fill: colorMap.get('background')});
    }
  }

  setSquareAsObstacle(row, col) {
    const idx = this._X * col + row;
    this._object._objects[idx].set({fill: colorMap.get('obstacle')});
  }

  clear() {
    for (let col=0; col<this._Y; ++col) {
      for (let row=0; row<this._X; ++row) {
        const idx = this._X * col + row;
        this._object._objects[idx].set({fill: colorMap.get('background')});
      }
    }
  }

  createGrid() {
    const lines = this.getLines();
    const squares = this.getSquares();
    const grid = new fabric.Group(squares.concat(lines), {
      selectable: false,
      evented: false,
    });

    return grid;
  }

  getSquares() {
    const squares = [];
    for (let col=0; col<this._Y; ++col) {
      for (let row=0; row<this._X; ++row) {
        squares.push(new fabric.Rect({
          left: row * this._scale,
          top: col * this._scale,
          width: this._scale,
          height: this._scale,
          fill: colorMap.get('background'),
          originX: 'left',
          originY: 'top',
          evented: false,
          selectable: false,
        }));
      }
    }
    return squares;
  }

  getLines() {
    const lines = [];
    const gridSize = this._scale;
    for (let i = 0; i < (this._width / gridSize); i++) {
      lines.push(new fabric.Line([i * gridSize, 0, i * gridSize, this._height],
          {type: 'line', stroke: colorMap.get('grid'), opacity: 0.25}));
      lines.push(new fabric.Line([0, i * gridSize, this._width, i * gridSize],
          {type: 'line', stroke: colorMap.get('grid'), opacity: 0.25}));
    }
    return lines;
  }

  rescale(scale) {
    this._object.forEachObject((obj) => {
      this._object.removeWithUpdate(obj);
    });
    this._scale = scale;
    const lines = this.getLines();
    lines.forEach((line) => {
      this._object.addWithUpdate(line);
    });
  }
};
module.exports.Grid = Grid;
