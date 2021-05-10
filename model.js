class Model {
  constructor(view) {
    this._view = view;
    this._layerTotalNumber = 3;
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
    this._currentLayer = 0;
  }

  explore() {
    if (this._currentLayer < this._layerTotalNumber) {
      const layer = this._explorer.iterateLayer(this._currentLayer++);
      layer.forEach((trajectory) => {
        if (trajectory.isColliding) {
          this._view.drawTrajectory(trajectory, 'red', 1);
        } else {
          this._view.drawTrajectory(trajectory, 'black', 1);
        }
      });
    } else {
      this._explorer.addCostDistanceToGoal();
      this._explorer.calculateBestTrajectory();
      this._explorer.getBestTrajectory().forEach((segment) => {
        this._view.drawTrajectory(segment, 'green', 3, 'dotted-line');
      });
    }
  }

  connectToGoalEuclidian() {
    const xGoal = this._view.getGoalPosition()[0];
    const yGoal = this._view.getGoalPosition()[1];
    const xEgo = this._view.getEgoPosition()[0];
    const yEgo = this._view.getEgoPosition()[1];

    this._view.drawLine(xGoal, yGoal, xEgo, yEgo, 'black');
  }
}

// eslint-disable-next-line no-unused-vars
function initializeModel() {
  model = new Model(view);
}

// eslint-disable-next-line no-unused-vars
let model;
