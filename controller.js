class Controller {
  constructor(model) {
    this._intervalHandler = null;
    this._currentLayer = 0;
    this._layerTotalNumber = 3;
    this._gotFinalTrajectory = false;
    this._model = model;
  }

  step() {
    this.execute();
  }

  play() {
    this._intervalHandler = window.setInterval(() => this.execute(), 750);
  }

  pause() {
    window.clearInterval(this._intervalHandler);
  }

  reset() {
    window.clearInterval(this._intervalHandler);
    this._currentLayer = 0;
    this._gotFinalTrajectory = false;
    this._model.reset();
  }

  execute() {
    if (this._currentLayer < this._layerTotalNumber) {
      this._model.explore(this._currentLayer);
      this._currentLayer++;
    } else if (this._gotFinalTrajectory === false) {
      this._model.calculateFinalTrajectory();
      this._gotFinalTrajectory = true;
    }
  }
}

// eslint-disable-next-line no-unused-vars
function initializeController() {
  controller = new Controller(model);
}

// eslint-disable-next-line no-unused-vars
let controller;
