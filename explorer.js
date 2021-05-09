class Explorer {
  constructor() {
    this._timestep = 2;
    this._intertime = .2;
    this._intersteps = this._timestep/ this._intertime;
    this._layerNumber = 3;
    this._currentLayer = 0;
    this._steeringAngles = [-.4, -.2, 0, .2, .4];
    this._trajectories = [[[new State()]]];
  }

  explore() {
    if(this._currentLayer <= this._layerNumber) {
      let i = this._currentLayer;
      this._trajectories.push([]);
      for(let j=0; j<this._trajectories[i].length; ++j) {
        let state = Object.assign({}, this._trajectories[i][j][this._trajectories[i][j].length-1]);
        this._steeringAngles.forEach((item) => {
          this._trajectories[i+1].push(this.calculateStates(state, item, 1));
        });
      }
      
      return this._trajectories[this._currentLayer++];
    }
    return null;    
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
    var states = [initialState];
    for(var i = 0; i < this._intersteps; i++) {
      var newState = Object.assign({}, states[i]);
      newState.x += veloctity * this._intertime * Math.cos(states[i].theta);
      newState.y += veloctity * this._intertime * Math.sin(states[i].theta);
      newState.theta += 0.1 * theta; //TODO: figure out how this works!
      newState.v = veloctity;
      states.push(newState);
    }
    return states;
  }

  calculateStraightMove(initialState, veloctity) {
    var states = [initialState];
    for(var i = 0; i < this._intersteps; i++) {
      var newState = Object.assign({}, states[i]);
      newState.x += veloctity * this._intertime;
      newState.v = veloctity;
      states.push(newState);
    }   
    return states;
  }
}