class Node {
  constructor(row, col, value) {
    this._id = String(row) + '-' + String(col);
    this._row = row;
    this._col = col;
    this._value = value;
    this._distanceFromStart = Number.MAX_VALUE; // g
    this._distanceToEnd = Number.MAX_VALUE; // f=g+h
    this._cameFrom = null;
  }

  set distanceFromStart(distance) {
    this._distanceFromStart = distance;
  }
  set distanceToEnd(distance) {
    this._distanceToEnd = distance;
  }
  set cameFrom(from) {
    this._cameFrom = from;
  }

  get id() {
    return this._id;
  }
  get value() {
    return this._value;
  }
  get row() {
    return this._row;
  }
  get col() {
    return this._col;
  }
  get distanceFromStart() {
    return this._distanceFromStart;
  }
  get distanceToEnd() {
    return this._distanceToEnd;
  }
  get cameFrom() {
    return this._cameFrom;
  }
}

class AStar {
  constructor(view, start, end, grid) { // grid = arr[arr[bool]]
    this._view = view;
    this._start = start;
    this._end = end;
    this._grid = grid;
    this._startRow = start[0];
    this._startCol = start[1];
    this._endRow = end[0];
    this._endCol = end[1];
    this._drawnNodes = [];

    this.init();
  }

  init() {
    this._nodes = this._grid.map((row, rowIdx) =>
      row.map((col, colIdx) =>
        new Node(rowIdx, colIdx, col)),
    );
    this._startNode = this._nodes[this._startRow][this._startCol];
    this._endNode = this._nodes[this._endRow][this._endCol];

    this._startNode.distanceFromStart = 0;
    this._startNode.distanceToEnd = this.calculateDistance(this._startRow,
        this._startCol);

    this._openSet = [this._startNode]; // make as min heap
    this._closedSet = [];

    this._endReached = false;
  }

  iterate() {
    if (this._openSet.length > 0 && !this._endReached) {
      const [node, idx] = this.getMinNode(this._openSet);
      this._openSet.splice(idx, 1);
      this._closedSet.push(node);
      this._view.drawNodeAStarVisited(node.row, node.col);
      this._drawnNodes.push(node);

      const neighbors = this.getNeighbors(node, this._nodes);
      neighbors.filter((i) => !this.isInArray(i, this._closedSet))
          .filter((j) => !j.value)
          .forEach((neighbor) => {
            neighbor.distanceFromStart = node.distanceFromStart + 1;
            neighbor.distanceToEnd = neighbor.distanceFromStart +
                this.calculateDistance(neighbor.row, neighbor.col);
            neighbor.cameFrom = node;

            if (neighbor.id === this._endNode.id) {
              this._endReached = true;
            }

            const foundInOpenSet = this._openSet.find((el) =>
              el.id === neighbor.id);
            if (foundInOpenSet === undefined) {
              this._openSet.push(neighbor);
              this._view.drawNodeAStarTentative(neighbor.row, neighbor.col);
              this._drawnNodes.push(neighbor);
            } else if (foundInOpenSet.distanceToEnd > neighbor.distanceToEnd) {
              foundInOpenSet = neighbor;
            }
          });
    }
  }

  isFinished() {
    return this._endReached;
  }

  getPath() {
    if (this._endReached) {
      const path = this.backtrace(this._endNode);
      this.clearNodes();
      return path;
    } else {
      return [];
    }
  }

  clearNodes() {
    this._drawnNodes.forEach((node) => {
      this._view.clearNodeDrawn(node.row, node.col);
    });
  }

  backtrace(node) {
    const result = [[node.row, node.col]];
    let current = node;
    while (current.cameFrom != null) {
      current = current.cameFrom;
      result.unshift([current.row, current.col]);
    }
    return result;
  }

  getMinNode(nodes) {
    let min = nodes[0];
    let idx = 0;
    nodes.forEach((node, id) => {
      if (node.distanceToEnd < min.distanceToEnd) {
        min = node;
        idx = id;
      }
    });
    return [min, idx];
  }

  getNeighbors(node, nodes) {
    const row = node.row;
    const col = node.col;

    const neighbors = [];
    if (row > 0) {
      neighbors.push(nodes[row - 1][col]);
    }
    if (row < nodes.length - 1) {
      neighbors.push(nodes[row + 1][col]);
    }
    if (col > 0) {
      neighbors.push(nodes[row][col - 1]);
    }
    if (col < nodes[0].length - 1) {
      neighbors.push(nodes[row][col + 1]);
    }

    return neighbors;
  }

  calculateDistance(startRow, startCol) {
    return Math.abs(startRow - this._endRow) +
        Math.abs(startCol - this._endCol);
  }

  isInArray(node, nodes) {
    for (let i = 0; i < nodes.length; i++) {
      if (node.id === nodes[i].id) {
        return true;
      }
    }
    return false;
  }
}
module.exports.AStar = AStar;
