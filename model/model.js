const Planner = require('./planner').Planner;
const Motion = require('./motion').Motion;
const State = require('../utils/datatypes').State;

class Model {
  constructor(view) {
    this._view = view;
    this._planner = new Planner(view);
    this._motion = new Motion(this._planner, view);
    this._layerTotalNumber = 2;
    this._baseFrequency_ms = 50;
    this._plannerFrequency_ms = 2000;
    this._step = 0;
    this._activeState = new State();
  }

  set timestep(value) {
    this._planner.timestep = value;
  }

  set intertime(value) {
    this._planner.intertime = value;
  }

  set layerTotalNumber(value) {
    this._layerTotalNumber = value;
  }

  set baseFrequency(value) {
    this._baseFrequency_ms = value;
  }

  set plannerFrequency(value) {
    this._plannerFrequency_ms = value;
  }

  set drawExploration(value) {
    this._planner.drawExploration = value;
  }

  set velocities(value) {
    this._planner.velocities = value;
  }

  set steeringAngles(value) {
    this._planner.steeringAngles = value;
  }

  reset() {
    this._planner.reset();
    this._view.reset();
  }

  execute(timer) {
    if (this._step++ %
        (this._plannerFrequency_ms/ this._baseFrequency_ms) === 0) {
      this._planner.explore(this.createInitialState(), this._layerTotalNumber);
      this._planner.calculateFinalTrajectory(timer);
    }

    this._activeState = this._motion.move(timer);

    this._view.updateTimerOnScreen(timer);
    this._view.render();
  }

  createInitialState() {
    const state = new State();
    state.v = this._activeState.v;
    state.steeringAngle = this._activeState.steeringAngle;
    return state;
  }
}
module.exports.Model = Model;
