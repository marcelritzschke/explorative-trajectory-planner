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

  get cameFrom() {
    return this._cameFrom;
  }
}

class AStar {
  constructor(start, end, grid) { // grid = arr[arr[bool]]
    this._start = start;
    this._end = end;
    this._grid = grid;
    this._startRow = start[0];
    this._startCol = start[1];
    this._endRow = end[0];
    this._endCol = end[1];
  }

  calculatePath() {
    const nodes = this._grid.map((row, rowIdx) =>
      row.map((col, colIdx) =>
        new Node(rowIdx, colIdx, col)),
    );
    const startNode = nodes[this._startRow][this._startCol];
    const endNode = nodes[this._endRow][this._endCol];

    startNode.distanceFromStart = 0;
    startNode.distanceToEnd = this.calculateDistance(this._startRow,
        this._startCol);

    const openSet = [startNode]; // make as min heap
    const closedSet = [];

    let endReached = false;
    while (openSet.length > 0 && !endReached) {
      const [node, idx] = this.getMinNode(openSet);
      openSet.splice(idx, 1);
      closedSet.push(node);

      const neighbors = this.getNeighbors(node, nodes);
      neighbors.filter((i) => !this.isInArray(i, closedSet))
          .filter((j) => !j.value)
          .forEach((neighbor) => {
            neighbor.distanceFromStart = node.distanceFromStart + 1;
            neighbor.distanceToEnd = neighbor.distanceFromStart +
                this.calculateDistance(neighbor.row, neighbor.col);
            neighbor.cameFrom = node;

            if (neighbor.id === endNode.id) {
              endReached = true;
            }

            const foundInOpenSet = openSet.find((el) => el.id === neighbor.id);
            if (foundInOpenSet === undefined) {
              openSet.push(neighbor);
            } else if (foundInOpenSet.distanceToEnd > neighbor.distanceToEnd) {
              foundInOpenSet = neighbor;
            }
          });
    }

    if (endReached) {
      return this.backtrace(endNode);
    } else {
      return [];
    }
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
