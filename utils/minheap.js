class MinHeap {
  constructor(elements = []) {
    this._heap = [];
    if (elements instanceof Array) {
      elements.forEach((el) => {
        this.push(el);
      });
    } else {
      // TODO: Throw error
    }
  }

  push(value, identifier = 0, secondary = 0) {
    this._heap.push([value, identifier, secondary]);
    this.siftUp(this._heap.length-1);
  }

  peek() {
    if (!this.isEmpty()) {
      return this._heap[0][0];
    }
    return undefined;
  }

  peekIdentifier() {
    if (!this.isEmpty()) {
      return this._heap[0][1];
    }
    return undefined;
  }

  pop() {
    const ret = this.peek();
    if (ret === undefined) {
      return undefined;
    }
    this.swap(0, this._heap.length-1);
    this._heap.pop();
    this.siftDown(0);
    return ret;
  }

  isEmpty() {
    return this._heap.length === 0;
  }

  siftUp(idx) {
    while (idx > 0) {
      // const parent = this.getParent(idx);
      // const current = this.get(idx);
      if (this.isSmaller(idx, this.getParentIdx(idx))) {
        this.swap(idx, this.getParentIdx(idx));
        idx = this.getParentIdx(idx);
      } else {
        break;
      }
    }
  }

  isSmaller(lidx, ridx) {
    const lvalue = this.get(lidx);
    const rvalue = this.get(ridx);
    if (lvalue < rvalue) {
      return true;
    }

    if (lvalue > rvalue) {
      return false;
    }

    const lsecondary = this.getSecondary(lidx);
    const rsecondary = this.getSecondary(ridx);
    if (lsecondary < rsecondary) {
      return true;
    }

    return false;
  }

  min(lidx, midx, ridx) {
    if (this.isSmaller(lidx, midx) && this.isSmaller(lidx, ridx)) {
      return lidx;
    } if (this.isSmaller(ridx, midx)) {
      return ridx;
    } else {
      return midx;
    }
  }

  siftDown(idx) {
    while (idx < this._heap.length) {
      const min = this.min(idx,
          this.getChildOneIdx(idx),
          this.getChildTwoIdx(idx));

      if (this.getChildOneIdx(idx) === min) {
        this.swap(idx, this.getChildOneIdx(idx));
        idx = this.getChildOneIdx(idx);
      } else if (this.getChildTwoIdx(idx) === min) {
        this.swap(idx, this.getChildTwoIdx(idx));
        idx = this.getChildTwoIdx(idx);
      } else {
        break;
      }
    }
  }

  swap(lidx, ridx) {
    const tmp = this._heap[lidx];
    this._heap[lidx] = this._heap[ridx];
    this._heap[ridx] = tmp;
  }

  getParent(idx) {
    return this.get(this.getParentIdx(idx));
  }

  getParentIdx(idx) {
    return parseInt((idx - 1)/ 2);
  }

  getChildOne(idx) {
    const childIdx = this.getChildOneIdx(idx);
    if (childIdx < this._heap.length) {
      return this.get(childIdx);
    } else {
      return Number.MAX_VALUE;
    }
  }

  getChildOneIdx(idx) {
    return 2*idx + 1;
  }

  getChildTwo(idx) {
    const childIdx = this.getChildTwoIdx(idx);
    if (childIdx < this._heap.length) {
      return this.get(childIdx);
    } else {
      return Number.MAX_VALUE;
    }
  }

  getChildTwoIdx(idx) {
    return 2*idx + 2;
  }

  get(idx) {
    if (idx < this._heap.length) {
      return this._heap[idx][0];
    }
    return Number.MAX_VALUE;
  }

  getSecondary(idx) {
    if (idx < this._heap.length) {
      return this._heap[idx][2];
    }
    return Number.MAX_VALUE;
  }
}
module.exports.MinHeap = MinHeap;
