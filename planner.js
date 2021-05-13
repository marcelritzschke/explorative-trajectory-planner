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
    this._explorer.addCostDistanceToGoal();
    this._explorer.calculateBestTrajectory();
    this._lastTrajectory = this._explorer.getBestTrajectory();
    this._lastTrajectory.origin = this._view.getEgoPosition();
    this._lastTrajectory.time = timer;
    this._lastTrajectory.forEach((segment) => {
      this._view.drawTrajectory(segment, 'rgb(3,90,32)', 3, 'dotted-line');
    });
  }

  explore(layerTotalNumber) {
    this._explorer.reset();

    for (let i=0; i<layerTotalNumber; ++i) {
      const layer = this._explorer.iterateLayer(i);
      layer.forEach((trajectory) => {
        if (trajectory.isColliding) {
          this._view.drawTrajectory(trajectory, 'red', 1);
        } else {
          this._view.drawTrajectory(trajectory, 'black', 1);
        }
      });
    }
  }
}

// eslint-disable-next-line no-unused-vars
function initializePlanner() {
  planner = new Planner(view);
}

// eslint-disable-next-line no-unused-vars
let planner;
