const colorMap = require('../utils/datatypes').colorMap;
const State = require('../utils/datatypes').State;

class Motion {
  constructor(planner, view) {
    this._planner = planner;
    this._view = view;
  }

  move(timer) {
    this._view.drawEgoPoint(colorMap.get('driven'), 2);

    const trajectory = this._planner.lastTrajectory;
    const time = timer - trajectory.time;

    if (trajectory.length === 0) {
      return new State();
    }

    const states = [];
    trajectory.segments.forEach((segment) => {
      segment.states.forEach((state) => {
        states.push(state);
      });
    });

    let idx = 0;
    for (let i=0; i<states.length; i++) {
      if (time < states[i].t) {
        break;
      }
      idx = i;
    }

    const firstState = states[idx];
    const secondState = states[Math.min(idx+1, states.length-1)];

    let fraction;
    if (firstState === secondState) {
      fraction = 0;
    } else {
      fraction = (time - firstState.t)/ (secondState.t - firstState.t);
    }

    return this.interpolate(fraction, firstState, secondState);
  }

  interpolate(fraction, stateFirst, stateSecond) {
    const state = new State();
    state.x = this.linearInterpolate(fraction, stateFirst.x, stateSecond.x);
    state.y = this.linearInterpolate(fraction, stateFirst.y, stateSecond.y);
    state.angle = this.linearInterpolate(fraction,
        stateFirst.angle, stateSecond.angle);
    state.steeringAngle = this.linearInterpolate(fraction,
        stateFirst.steeringAngle, stateSecond.steeringAngle);
    state.v = this.linearInterpolate(fraction, stateFirst.v, stateSecond.v);
    state.t = this.linearInterpolate(fraction, stateFirst.t, stateSecond.t);
    state.isColliding = stateSecond.isColliding;

    return state;
  }

  linearInterpolate(fraction, valueFirst, valueSecond) {
    return valueFirst + (valueSecond - valueFirst) * fraction;
  }
}
module.exports.Motion = Motion;
