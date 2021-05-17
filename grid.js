// eslint-disable-next-line no-unused-vars
class Grid {
  constructor(width, height, scale) {
    this._width = width;
    this._height = height;
    this._scale = scale;
    this._object = this.createGrid();
  }

  get object() {
    return this._object;
  }

  createGrid() {
    const lines = this.getLines();
    const grid = new fabric.Group(lines, {
      selectable: false,
      evented: false,
      opacity: 0.25,
    });

    return grid;
  }

  getLines() {
    const lines = [];
    const gridSize = this._scale;
    for (let i = 0; i < (this._width / gridSize); i++) {
      lines.push(new fabric.Line([i * gridSize, 0, i * gridSize,
        this._height], {type: 'line', stroke: colorMap.get('grid')}));
      lines.push(new fabric.Line([0, i * gridSize,
        this._width, i * gridSize], {type: 'line',
        stroke: colorMap.get('grid')}));
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
