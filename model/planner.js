const colorMap = require('../utils/datatypes').colorMap;
const Utils = require('../utils/utils').Utils;
const Pose = require('../utils/datatypes').Pose;

class Planner {
  constructor(view, parameters, explorer) {
    this._view = view;
    this._parameters = parameters;
    this._explorer = explorer;
    this._lastTrajectory = [];
    this._trajectories = [];
    this._ego = new Pose();
    this._goalGlobal = new Pose();
  }

  get lastTrajectory() {
    return this._lastTrajectory;
  }

  get trajectories() {
    return this._trajectories;
  }

  set timestep(value) {
    this._explorer.timestep = value;
  }

  set intertime(value) {
    this._explorer.intertime = value;
  }

  set drawExploration(value) {
    this._drawExploration = value;
  }

  set velocities(value) {
    this._explorer.velocities = value;
  }

  set steeringAngles(value) {
    this._explorer.steeringAngles = value;
  }

  updateEgo(ego) {
    this._ego = ego;
  }

  updateGoal(goal) {
    this._goalGlobal = goal;
    this._explorer.updateGoal(Utils.transformObjectToUsk(this._ego, goal));
  }

  reset() {
    this._lastTrajectory = [];
    this._trajectories = [];
  }

  calculateFinalTrajectory(timer) {
    if (this._lastTrajectory.isReachGoal) {
      return;
    }

    this._lastTrajectory = this._explorer.getBestTrajectory(this._trajectories);
    this._lastTrajectory.origin = this._ego;
    this._lastTrajectory.time = timer;

    this._view.drawTrajectory(this._lastTrajectory, colorMap.get('chosen'), 3,
        'dotted-line', 'ChosenTrajectory');
  }

  explore(initialState, layerTotalNumber) {
    const startTime = new Date().getTime();

    if (this._lastTrajectory.isReachGoal) {
      return;
    }

    this._explorer.reset();
    this._explorer.updateGoal(
        Utils.transformObjectToUsk(this._ego, this._goalGlobal));
    this._explorer.setInitialState(initialState);
    for (let i=0; i<layerTotalNumber; ++i) {
      this._explorer.iterateLayer(i);
    }

    this._view.setPreviousTrajectoriesInactive();
    this._trajectories = this._explorer.getTrajectories();

    const notcolliding = [];
    const colliding = [];
    for (const trajectory of this._trajectories) {
      if (trajectory.isColliding) {
        colliding.push(trajectory);
      } else {
        notcolliding.push(trajectory);
      }
    }
    this._drawExploration && this._view.drawTrajectories(notcolliding,
        colorMap.get('trajectory'), 1.5);
    this._drawExploration && this._view.drawTrajectories(colliding,
        colorMap.get('colliding'), 1.5);

    console.log('Planner.explore() time =',
        new Date().getTime() - startTime, 'ms');

    return this._trajectories;
  }
}
module.exports.Planner = Planner;
