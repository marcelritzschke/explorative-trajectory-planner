const MinHeap = require('../utils/minheap').MinHeap;

class Node {
  constructor(row, col, value) {
    this._id = String(row) + '-' + String(col);
    this._row = row;
    this._col = col;
    this._value = value;
    this._distanceFromStart = Number.MAX_VALUE; // g
    this._heuristic = Number.MAX_VALUE; // h
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
  set heuristic(value) {
    this._heuristic = value;
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
  get heuristic() {
    return this._heuristic;
  }
}

class AStar {
  constructor(start, end, grid, draw = false, view = undefined) {
    this._draw = draw;
    this._view = view;
    this._start = start;
    this._end = end;
    this._grid = grid; // arr[arr[bool]]
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
    this._startNode.heuristic = this.calculateDistance(this._startRow,
        this._startCol);
    this._startNode.distanceToEnd = this._startNode.heuristic;

    this._openSet = new MinHeap();
    this._openSet.push(this._startNode, this._startNode.id);
    this._closedSet = [];

    this._endReached = false;
  }

  iterate() {
    if (!this._openSet.isEmpty() && !this._endReached) {
      const node = this.getMinNode();
      this._openSet.pop();
      this._closedSet.push(node);
      this._draw && this._view.drawNodeAStarVisited(node.row, node.col);
      this._drawnNodes.push(node);

      const neighbors = this.getNeighbors(node, this._nodes);
      neighbors.filter((i) => !this.isInArray(i, this._closedSet))
          .filter((j) => !j.value)
          .forEach((neighbor) => {
            // new tentative distance
            const newDist = node.distanceFromStart + 1 + this.calculateDistance(
                neighbor.row, neighbor.col,
            );

            // Check if node was already visited before:
            // If distanceToEnd is not Number.MAX_VALUE anymore, it must be in
            // open set or closed set. Since neighbors have been filtered by
            // closed set, it will be in open set. Remember, in case node
            // will be updated in the following section.
            let isInOpenSet = false;
            if (neighbor.distanceToEnd < Number.MAX_VALUE) {
              isInOpenSet = true;
            }

            // Update node, if the distance to end is shorter from node.
            if (newDist < neighbor.distanceToEnd) {
              neighbor.distanceFromStart = node.distanceFromStart + 1;
              neighbor.heuristic = this.calculateDistance(neighbor.row,
                  neighbor.col);
              neighbor.distanceToEnd = neighbor.distanceFromStart +
                  neighbor.heuristic;
              neighbor.cameFrom = node;
            }

            // Push neighbor to open set or update heap.
            if (!isInOpenSet) {
              this._openSet.push(neighbor.distanceToEnd,
                  neighbor.id, neighbor.heuristic);
              this._draw &&
                this._view.drawNodeAStarTentative(neighbor.row, neighbor.col);
              this._drawnNodes.push(neighbor);
            } else {
              this._openSet.update(neighbor.distanceToEnd,
                  neighbor.id, neighbor.heuristic);
            }

            // TODO: early return if end is reached.
            if (neighbor.id === this._endNode.id) {
              this._endReached = true;
            }
          });
    }
  }

  isFinished() {
    return this._endReached || this._openSet.isEmpty();
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
      this._draw && this._view.clearNodeDrawn(node.row, node.col);
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

  getMinNode() {
    const id = this._openSet.peekIdentifier();
    const row = id.split('-')[0];
    const col = id.split('-')[1];

    return this._nodes[row][col];
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
