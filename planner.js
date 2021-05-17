class Planner {
  constructor(view) {
    this._view = view;
    this._explorer = null;
    this.reset();
  }

  get lastTrajectory() {
    return this._lastTrajectory;
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

  reset() {
    this._explorer = new Explorer(
        this._view.getGoal(),
        this._view.getObstacles(),
    );
    this._lastTrajectory = [];
  }

  calculateFinalTrajectory(timer) {
    this._lastTrajectory = this._explorer.getBestTrajectory();
    this._lastTrajectory.origin = this._view.getEgoPosition();
    this._lastTrajectory.time = timer;

    this._view.drawTrajectory(this._lastTrajectory, colorMap.get('chosen'), 3,
        'dotted-line', 'ChosenTrajectory');
  }

  explore(initialState, layerTotalNumber) {
    const startTime = new Date().getTime();

    this._explorer.reset();
    this._explorer.setInitialState(initialState);
    for (let i=0; i<layerTotalNumber; ++i) {
      this._explorer.iterateLayer(i);
    }
    this._view.setPreviousTrajectoriesInactive();
    const trajectories = this._explorer.getTrajectories();

    const notcolliding = [];
    const colliding = [];
    for (const trajectory of trajectories) {
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
  }
}

// eslint-disable-next-line no-unused-vars
function initializePlanner() {
  planner = new Planner(view);
}

// eslint-disable-next-line no-unused-vars
let planner;
