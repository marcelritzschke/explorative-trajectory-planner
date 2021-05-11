class Model {
  constructor(view) {
    this._view = view;
    this.reset();
  }

  reset() {
    const obstacle = this._view.getObstacle();
    obstacle.x -= this._view.getEgoPosition()[0];
    obstacle.y -= this._view.getEgoPosition()[1];

    this._explorer = new Explorer([0, 0], [
      this._view.getGoalPosition()[0] - this._view.getEgoPosition()[0],
      this._view.getGoalPosition()[1] - this._view.getEgoPosition()[1],
    ], obstacle);
  }

  calculateFinalTrajectory() {
    this._explorer.addCostDistanceToGoal();
    this._explorer.calculateBestTrajectory();
    this._explorer.getBestTrajectory().forEach((segment) => {
      this._view.drawTrajectory(segment, 'green', 3, 'dotted-line');
    });
  }

  explore(layerNumber) {
    const layer = this._explorer.iterateLayer(layerNumber);
    layer.forEach((trajectory) => {
      if (trajectory.isColliding) {
        this._view.drawTrajectory(trajectory, 'red', 1);
      } else {
        this._view.drawTrajectory(trajectory, 'black', 1);
      }
    });
  }
}

// eslint-disable-next-line no-unused-vars
function initializeModel() {
  model = new Model(view);
}

// eslint-disable-next-line no-unused-vars
let model;
