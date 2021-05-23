class StateFilter {
  constructor(view, numberOfStatesPerLayer) {
    this._view = view;
    this._numberOfStatesPerLayer = numberOfStatesPerLayer;
  }


  getFilteredStates(segments) {
    if (segments.length <= this._numberOfStatesPerLayer) {
      return segments;
    }

    const extrema = this.getExtremeValues(segments);
    const xMin = extrema[0];
    const xMax = extrema[1];
    const yMin = extrema[2];
    const yMax = extrema[3];

    const ratio = (xMax - xMin) / (yMax - yMin);

    const Y = parseInt(Math.sqrt(this._numberOfStatesPerLayer / ratio));
    const X = parseInt(ratio * Y);
    const deltaX = (xMax - xMin) / X;
    const deltaY = (yMax - yMin) / Y;

    // const filter = new Filter(xMin, yMin, deltaX, deltaY, X, Y);
    // this._view.drawFilter(filter);

    const sorted = new Array(X);
    for (let i=0; i<X; i++) {
      const arr = [];
      for (let j=0; j<Y; ++j) {
        arr.push([]);
      }
      sorted[i] = arr;
    }

    segments.forEach((segment) => {
      const state = segment.lastState;

      const x = (state.x - xMin) / deltaX;
      const y = (state.y - yMin) / deltaY;

      sorted[Math.trunc(x)][Math.trunc(y)].push(segment);
    });

    const bestTrajectories = [];
    for (let i=0; i<X; ++i) {
      for (let j=0; j<Y; ++j) {
        sorted[i][j].length &&
        bestTrajectories.push(this.getBestTrajectory(sorted[i][j]));
      }
    }

    return bestTrajectories;
  }

  getExtremeValues(segments) {
    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;

    segments.forEach((segment) => {
      const state = segment.lastState;

      if (state.x < xMin) {
        xMin = state.x - .001;
      }
      if (state.x > xMax) {
        xMax = state.x + .001;
      }
      if (state.y < yMin) {
        yMin = state.y - .001;
      }
      if (state.y > yMax) {
        yMax = state.y + .001;
      }
    });

    return [xMin, xMax, yMin, yMax];
  }

  getBestTrajectory(trajectories) {
    let best = 0;
    let cost = Infinity;
    trajectories.forEach((trajectory, index) => {
      if (trajectory.cost < cost) {
        best = index;
        cost = trajectory.cost;
      }
    });

    return trajectories[best];
  }
}
module.exports.StateFilter = StateFilter;
