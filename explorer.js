class Explorer {
  constructor(ego, goal) {
    this._ego = ego;
    this._goal = goal;
    this._timestep = 2;
    this._intertime = .2;
    this._intersteps = this._timestep/ this._intertime;
    this._steeringAngles = [-.4, -.2, 0, .2, .4];
    this._trajectories = [];
    this._bestTrajectoryIdx = null;
  }

  iterateLayer(layerNumber) {
    if(layerNumber === 0) {
      let newTrajectory = new Trajectory([new State()]);
      this._trajectories.push([newTrajectory]);
    }

    this._trajectories.push([]);
    for(let j=0; j<this._trajectories[layerNumber].length; ++j) {
      let state = Object.assign({}, this._trajectories[layerNumber][j].lastState);
      this._steeringAngles.forEach(item => {
        let newTrajectory = new Trajectory(this.calculateStates(state, item, 1));
        newTrajectory.prevIdx = j;
        this._trajectories[layerNumber+1].push(newTrajectory);
      });
    }
    
    return this._trajectories[layerNumber+1];
  }

  addCostDistanceToGoal() {
    this._trajectories[this._trajectories.length-1].forEach(trajectory => {
      let x = this._goal[0] - trajectory.lastState.x;
      let y = this._goal[1] - trajectory.lastState.y;
      trajectory.cost += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    });
  }

  calculateBestTrajectory() {
    let bestCost = Infinity;
    this._trajectories[this._trajectories.length-1].forEach((trajectory, index) => {
      if(trajectory.cost <= bestCost) {
        bestCost = trajectory.cost;
        this._bestTrajectoryIdx = index;
      }
    });
  }

  getBestTrajectory() {
    let best = [];
    let layerIdx = this._trajectories.length - 1;
    let trajectoryIdx = this._bestTrajectoryIdx;
    while(layerIdx >= 0) {
      let trajectory = this._trajectories[layerIdx][trajectoryIdx];
      best.push(trajectory);
      trajectoryIdx = trajectory.prevIdx;
      layerIdx--;
    }

    return best;
  }

  calculateStates(initialState, theta, veloctity) {
    if(Math.abs(theta) < Number.EPSILON) {
      return this.calculateStraightMove(initialState, veloctity);
    }  
    else {
      return this.calculateCrookedMove(initialState, theta, veloctity);
    }                                                   
  }

  calculateCrookedMove(initialState, theta, veloctity) {
    let states = [initialState];
    for(let i = 0; i < this._intersteps; i++) {
      let newState = Object.assign({}, states[i]);
      newState.x += veloctity * this._intertime * Math.cos(states[i].theta);
      newState.y += veloctity * this._intertime * Math.sin(states[i].theta);
      newState.theta += 0.1 * theta; //TODO: figure out how this works!
      newState.v = veloctity;
      states.push(newState);
    }
    return states;
  }

  calculateStraightMove(initialState, veloctity) {
    let states = [initialState];
    for(let i = 0; i < this._intersteps; i++) {
      let newState = Object.assign({}, states[i]);
      newState.x += veloctity * this._intertime;
      newState.v = veloctity;
      states.push(newState);
    }   
    return states;
  }
}