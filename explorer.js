class Explorer {
  constructor() {
    this._timestep = 2;
    this._intertime = .2;
    this._intersteps = this._timestep/ this._intertime;
  }

  explore() {
    var steeringAngles = [-.5, -.2, 0, .2, .5];
    var trajectories = [];
    steeringAngles.forEach((item) => {
      var state = new State();
      state.theta = item;
      state.v = 1;
      trajectories.push(this.calculateStates(state));
    })
    return trajectories;
  }

  calculateStates(initialState) {
    if(Math.abs(initialState.theta) < Number.EPSILON) {
      return this.calculateStraightMove(initialState);
    }  
    else {
      return this.calculateCrookedMove(initialState);
    }                                                   
  }

  calculateCrookedMove(initialState) {
    var states = [initialState];
    for(var i = 0; i < this._intersteps; i++) {
      var newState = Object.assign({}, states[i]);
      newState.x += states[i].v * this._intertime * Math.cos(states[i].theta);
      newState.y += states[i].v * this._intertime * Math.sin(states[i].theta);
      newState.theta += 0.1 * states[i].theta; //TODO: figure out how this works!
      states.push(newState);
    }
    return states;
  }

  calculateStraightMove(initialState) {
    var states = [initialState];
    for(var i = 0; i < this._intersteps; i++) {
      var newState = Object.assign({}, states[i]);
      newState.x += states[i].v * this._intertime;
      states.push(newState);
    }   
    return states;
  }
}