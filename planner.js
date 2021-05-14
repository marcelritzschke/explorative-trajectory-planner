class Planner {
  constructor(view) {
    this._view = view;
    this._explorer = null;
    this.init();
  }

  get lastTrajectory() {
    return this._lastTrajectory;
  }

  init() {
    this._explorer = new Explorer(
        this._view.getGoal(),
        this._view.getObstacle(),
    );
  }

  reset() {
    this._explorer.reset();
    this._lastTrajectory = [];
  }

  calculateFinalTrajectory(timer) {
    this._lastTrajectory = this._explorer.getBestTrajectory();
    this._lastTrajectory.origin = this._view.getEgoPosition();
    this._lastTrajectory.time = timer;
    this._view.drawTrajectory(this._lastTrajectory, colorMap.get('chosen'), 3,
        'dotted-line', 'ChosenTrajectory');
  }

  explore(layerTotalNumber) {
    this._explorer.reset();

    for (let i=0; i<layerTotalNumber; ++i) {
      this._explorer.iterateLayer(i);
    }

    this._view.setPreviousTrajectoriesInactive();
    const trajectories = this._explorer.getTrajectories();
    trajectories.forEach((trajectory) => {
      if (trajectory.isColliding) {
        this._view.drawTrajectory(trajectory, colorMap.get('colliding'), 1.5);
      } else {
        this._view.drawTrajectory(trajectory, colorMap.get('trajectory'), 1.5);
      }
    });
  }
}

// eslint-disable-next-line no-unused-vars
function initializePlanner() {
  planner = new Planner(view);
}

// eslint-disable-next-line no-unused-vars
let planner;
