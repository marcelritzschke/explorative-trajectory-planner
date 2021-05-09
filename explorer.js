class Explorer {
  constructor() {
    this._timestep = 2;
    this._intertime = .2;
    this._intersteps = this._timestep/ this._intertime;
    this._steeringAngles = [-.4, -.2, 0, .2, .4];
    this._trajectories = [];
  }

  iterateLayer(layerNumber) {
    if(layerNumber === 0) {
      let newTrajectory = new Trajectory([new State()]);
      this._trajectories.push([newTrajectory]);
    }

    this._trajectories.push([]);
    for(let j=0; j<this._trajectories[layerNumber].length; ++j) {
      let state = Object.assign({}, this._trajectories[layerNumber][j].lastState);
      this._steeringAngles.forEach((item) => {
        let newTrajectory = new Trajectory(this.calculateStates(state, item, 1));
        this._trajectories[layerNumber+1].push(newTrajectory);
      });
    }
    
    return this._trajectories[layerNumber];
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