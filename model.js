class Model {
  constructor(view) {
    this._view = view;
    this._layerTotalNumber = 3;
    this.reset();
  }

  reset() {
    this._explorer = new Explorer([0, 0], [
      this._view.getGoalPosition()[0] - this._view.getEgoPosition()[0],
      this._view.getGoalPosition()[1] - this._view.getEgoPosition()[1]
    ]);
    this._currentLayer = 0;
  }

  explore() {
    if(this._currentLayer < this._layerTotalNumber) {
      let layer = this._explorer.iterateLayer(this._currentLayer++);
      layer.forEach(trajectory => {
        this._view.drawTrajectory(trajectory, 'black', 1);
      })
    }
    else {
      this._explorer.addCostDistanceToGoal();
      this._explorer.calculateBestTrajectory();
      this._explorer.getBestTrajectory().forEach(segment => {
        this._view.drawTrajectory(segment, 'green', 3);
      })
      
    }
  }

  connectToGoalEuclidian() {
    var xGoal = this._view.getGoalPosition()[0];
    var yGoal = this._view.getGoalPosition()[1];
    var xEgo = this._view.getEgoPosition()[0];
    var yEgo = this._view.getEgoPosition()[1];

    this._view.drawLine(xGoal, yGoal, xEgo, yEgo, 'black');
  }
}

function initializeModel() {
  model = new Model(view);
}

let model;