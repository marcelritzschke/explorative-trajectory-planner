class Model {
  constructor(view) {
    this._view = view;
    this._explorer = new Explorer();
    this._layerTotalNumber = 3;
    this._currentLayer = 0;
  }

  explore() {
    if(this._currentLayer <= this._layerTotalNumber) {
      let layer = this._explorer.iterateLayer(this._currentLayer++);
      layer.forEach(trajectory => {
        this._view.drawTrajectory(trajectory, 'black', 1);
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