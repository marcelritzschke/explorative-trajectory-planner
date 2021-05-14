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
    const grid = new fabric.Group([], {
      selectable: false,
      evented: false,
      opacity: 0.25,
    });
    this.addLinesToGrid(grid);

    return grid;
  }

  addLinesToGrid(grid) {
    const gridSize = this._scale;
    for (let i = 0; i < (this._width / gridSize); i++) {
      grid.addWithUpdate(new fabric.Line([i * gridSize, 0, i * gridSize,
        this._height], {type: 'line', stroke: colorMap.get('grid')}));
      grid.addWithUpdate(new fabric.Line([0, i * gridSize,
        this._width, i * gridSize], {type: 'line',
        stroke: colorMap.get('grid')}));
    }
  }

  rescale(scale) {
    this._object.forEachObject((obj) => {
      this._object.removeWithUpdate(obj);
    });
    this._scale = scale;
    this.addLinesToGrid(this._object);
  }
};
