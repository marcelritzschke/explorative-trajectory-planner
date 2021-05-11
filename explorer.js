// eslint-disable-next-line no-unused-vars
class Explorer {
  constructor(ego, goal, obstacle) {
    this._ego = ego;
    this._goal = goal;
    this._obstacle = obstacle;
    this._timestep = 2;
    this._intertime = 0.2;
    this._intersteps = this._timestep/ this._intertime;
    this._steeringAngles = [-0.4, -0.2, 0, 0.2, 0.4];
    this._trajectories = [];
    this._bestTrajectoryIdx = null;
  }

  iterateLayer(layerNumber) {
    if (layerNumber === 0) {
      const newTrajectory = new Trajectory([new State()]);
      this._trajectories.push([newTrajectory]);
    }

    this._trajectories.push([]);
    for (let j=0; j<this._trajectories[layerNumber].length; ++j) {
      const state = Object.assign({},
          this._trajectories[layerNumber][j].lastState);

      if (state.isColliding) {
        continue;
      }

      this._steeringAngles.forEach((item) => {
        const newTrajectory = new Trajectory(
            this.calculateStates(state, item, 1));
        newTrajectory.prevIdx = j;
        this._trajectories[layerNumber+1].push(newTrajectory);
      });
    }

    return this._trajectories[layerNumber+1];
  }

  addCostDistanceToGoal() {
    this._trajectories[this._trajectories.length-1].forEach((trajectory) => {
      const x = this._goal[0] - trajectory.lastState.x;
      const y = this._goal[1] - trajectory.lastState.y;
      trajectory.cost += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    });
  }

  calculateBestTrajectory() {
    let bestCost = Infinity;
    this._trajectories[this._trajectories.length-1]
        .forEach((trajectory, index) => {
          if (trajectory.cost <= bestCost) {
            bestCost = trajectory.cost;
            this._bestTrajectoryIdx = index;
          }
        });
  }

  getBestTrajectory() {
    const best = [];
    let layerIdx = this._trajectories.length - 1;
    let trajectoryIdx = this._bestTrajectoryIdx;
    while (layerIdx >= 0) {
      const trajectory = this._trajectories[layerIdx][trajectoryIdx];
      best.push(trajectory);
      trajectoryIdx = trajectory.prevIdx;
      layerIdx--;
    }

    return best;
  }

  isColliding(state) {
    return this._obstacle.isColliding(state);
  }

  calculateStates(initialState, theta, veloctity) {
    if (Math.abs(theta) < Number.EPSILON) {
      return this.calculateStraightMove(initialState, veloctity);
    } else {
      return this.calculateCrookedMove(initialState, theta, veloctity);
    }
  }

  calculateCrookedMove(initialState, theta, veloctity) {
    const states = [initialState];
    for (let i = 0; i < this._intersteps; i++) {
      const newState = Object.assign({}, states[i]);
      newState.x += veloctity * this._intertime * Math.cos(states[i].theta);
      newState.y += veloctity * this._intertime * Math.sin(states[i].theta);
      newState.theta += 0.1 * theta; // TODO: figure out how this works!
      newState.v = veloctity;
      newState.isColliding |= this.isColliding(newState);
      states.push(newState);
    }

    // Remove initial state since it is already in previous segment
    // states.splice(0, 1);

    return states;
  }

  calculateStraightMove(initialState, veloctity) {
    const states = [initialState];
    for (let i = 0; i < this._intersteps; i++) {
      const newState = Object.assign({}, states[i]);
      newState.x += veloctity * this._intertime;
      newState.v = veloctity;
      newState.isColliding |= this.isColliding(newState);
      states.push(newState);
    }
    return states;
  }
}
