const Utils = require('../utils/utils').Utils;
const StateFilter = require('./statefilter').StateFilter;
const CarShape = require('../utils/datatypes').CarShape;
const State = require('../utils/datatypes').State;
const Segment = require('../utils/datatypes').Segment;
const Trajectory = require('../utils/datatypes').Trajectory;

class Explorer {
  constructor(view, goal, obstacles, distanceGrid) {
    this._goal = goal;
    this._obstacles = obstacles;
    this._distanceGrid = distanceGrid;
    this._wheelBase = 2.64 / 2;
    this._timestep = 2.;
    this._intertime = 0.2;
    this._steeringAngles = [-.6, -.3, .0, .3, .6];
    this._velocities = [.0, 1.];
    this._segments = [];
    this._goalTolerance = 1.;
    this._initialState = new State();
    this._statesFilter = new StateFilter(view, 1000);
  }

  set timestep(value) {
    this._timestep = value;
  }

  set intertime(value) {
    this._intertime = value;
  }

  set velocities(value) {
    this._velocities = value;
  }

  set steeringAngles(value) {
    this._steeringAngles = value;
  }

  reset(goal) {
    this._segments = [];
    this._goal = goal;
  }

  setInitialState(initialState) {
    this.initialState = initialState;
  }

  iterateLayer(layerNumber) {
    if (layerNumber === 0) {
      const newSegment = new Segment([this.initialState]);
      this._segments.push([newSegment]);
    }

    this._segments.push([]);
    for (let j=0; j<this._segments[layerNumber].length; ++j) {
      const state = Object.assign({},
          this._segments[layerNumber][j].lastState);

      if (state.isColliding) {
        continue;
      }

      this._steeringAngles.forEach((angle) => {
        this._velocities.forEach((veloctity) => {
          const newSegment = new Segment(
              this.calculateStates(state, angle, veloctity));

          newSegment.prevIdx = j;
          if (newSegment.lastState.isColliding) {
            newSegment.cost = Infinity;
          } else {
            this.addCostDriving(newSegment);
            this.addCostDistanceToPath(newSegment);
          }

          this._segments[layerNumber+1].push(newSegment);
        });
      });
    }

    this._segments[layerNumber+1] =
        this._statesFilter.getFilteredStates(this._segments[layerNumber+1]);

    return this._segments[layerNumber+1];
  }

  getTrajectories() {
    const trajectories = [];
    const lastLayerIdx = this._segments.length - 1;
    for (let i=0; i<this._segments[lastLayerIdx].length; ++i) {
      trajectories.push(this.getTrajectoryBacktraceSegment(i));
    }
    this.addCostDistanceToGoal(trajectories);

    return trajectories;
  }

  getTrajectoryBacktraceSegment(index) {
    const lastLayerIdx = this._segments.length - 1;
    const trajectory = new Trajectory();
    let layerIdx = lastLayerIdx;
    let segmentIdx = index;
    while (layerIdx >= 0) {
      const segment = this._segments[layerIdx][segmentIdx];
      trajectory.unshift(segment);
      segmentIdx = segment.prevIdx;
      layerIdx--;
    }
    trajectory.cost = trajectory.lastSegment.cost;

    return trajectory;
  }

  addCostDriving(segment) {
    let cost = 0;
    segment.states.forEach((state) => {
      cost += Math.abs(state.v);
      cost += Math.abs(state.steeringAngle);
    });
    segment.cost += cost;
  }

  addCostDistanceToPath(segment) {
    let cost = 0;
    segment.states.forEach((state) => {
      cost += this._distanceGrid.getDistance(state);
    });
    segment.cost += cost;
  }

  addCostDistanceToGoal(trajectories) {
    trajectories.forEach((trajectory) => {
      const x = this._goal.x - trajectory.lastSegment.lastState.x;
      const y = this._goal.y - trajectory.lastSegment.lastState.y;
      const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      trajectory.cost += distance * 10;

      if (distance <= this._goalTolerance) {
        trajectory.isReachGoal = true;
      }
    });
  }

  getBestTrajectory(trajectories) {
    let bestCost = Infinity;
    let bestIdx = null;
    trajectories.forEach((trajectory, index) => {
      if (trajectory.cost <= bestCost) {
        bestCost = trajectory.cost;
        bestIdx = index;
      }
    });

    return trajectories[bestIdx];
  }

  isColliding(state) {
    let colliding = false;

    const corners = new CarShape().getCorners(state);
    for (const corner of corners) {
      colliding |= this._obstacles.isColliding(corner);
    }
    return colliding;
  }

  calculateStates(initialState, steeringAngle, veloctity) {
    const intersteps = this._timestep/ this._intertime;
    const states = [initialState];
    for (let i = 0; i < intersteps; i++) {
      const angle = (i+1) / intersteps * (steeringAngle -
          initialState.steeringAngle) + initialState.steeringAngle;
      const vel = (i+1) / intersteps *
          (veloctity - initialState.v) + initialState.v;

      if (Math.abs(angle) < Number.EPSILON) {
        states.push(this.calculateStraightMove(states[i], vel));
      } else {
        states.push(this.calculateCrookedMove(states[i], angle, vel));
      }
    }
    return states;
  }

  /**
   * Calculating the next vehicle state by assuming a single track model.
   * Means the radius of the curve is calculated by r = wheelBase /
   * sin(steeringAngle). The x and y coordinates are then calculated from
   * x = r * cos(wt) and y = r * sin(wt) with w = v / r. The direction change
   * is phi = w * t = v * t / r.
   * @param {State} prevState Used to add up the values
   * @param {number} steeringAngle Steering angle of tire
   * @param {number} veloctity Current constant velocity
   * @return {State}
   */
  calculateCrookedMove(prevState, steeringAngle, veloctity) {
    const r = this._wheelBase / Math.sin(steeringAngle);

    const newState = Object.assign({}, prevState);
    newState.x = r * Math.sin(veloctity * this._intertime / r);
    newState.y = r * Math.cos(veloctity * this._intertime / r) - r;

    // TODO: The following might be merged with the formulas above.
    const res = Utils.rotatePoint(newState.x, newState.y, prevState.angle);
    newState.x = res[0] + prevState.x;
    newState.y = res[1] + prevState.y;

    newState.steeringAngle = steeringAngle;
    newState.angle += -veloctity * this._intertime / r;
    newState.v = veloctity;
    newState.t += this._intertime;
    newState.isColliding |= this.isColliding(newState);

    // Remove initial state since it is already in previous segment
    // states.splice(0, 1);

    return newState;
  }

  calculateStraightMove(prevState, veloctity) {
    const newState = Object.assign({}, prevState);
    newState.x += veloctity * this._intertime * Math.cos(prevState.angle);
    newState.y += veloctity * this._intertime * Math.sin(prevState.angle);

    newState.steeringAngle = 0;
    newState.v = veloctity;
    newState.t += this._intertime;
    newState.isColliding |= this.isColliding(newState);

    return newState;
  }
}
module.exports.Explorer = Explorer;
