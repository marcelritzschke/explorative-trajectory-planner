class Controller {
  constructor(model) {
    this._model = model;
    this._intervalHandlerPath = null;
    this._intervalHandlerTraj = null;
    this._timer = 0;
    this._baseFrequencyPath_ms = 10;
    this._baseFrequencyTraj_ms = 50;
    this._isActive = false;


    document.onkeydown = function(e) {
      if (e.key === 'Escape') {
        model.escapeKeyPressed();
      }
    };

    this.reset();
  }

  makePath() {
    if (!this._isActive) {
      this._intervalHandlerPath = window.setInterval(() =>
        this.executePathPlanner(), this._baseFrequencyPath_ms);
      this.setActive();
    }
  }

  executePathPlanner() {
    if (this._model.isPathPlannerFinished()) {
      window.clearInterval(this._intervalHandlerPath);
      this.setInactive();
    } else {
      this._model.runPathPlanner();
    }
  }

  step() {
    !this._isActive && this.execute();
  }

  play() {
    if (!this._isActive) {
      this._intervalHandlerTraj = window.setInterval(() => this.execute(),
          this._baseFrequencyTraj_ms);
      this.setActive();
    }
  }

  pause() {
    if (this._isActive) {
      window.clearInterval(this._intervalHandlerTraj);
      this.setInactive();
    }
  }

  execute() {
    this._model.execute(this._timer);
    this._timer += this._baseFrequencyTraj_ms/ 1000;
  }

  reset() {
    window.clearInterval(this._intervalHandlerTraj);
    window.clearInterval(this._intervalHandlerPath);
    this.setInactive();
    this._timer = 0;
    this._model.reset();
    this.updateLayerNumber();
    this.updateTimestep();
    this.updateIntertime();
    this.updateDrawExploration();
    this.updateVelocities();
    this.updateSteeringAngles();
  }

  setActive() {
    this._isActive = true;
  }

  setInactive() {
    this._isActive = false;
  }

  updateLayerNumber() {
    this._model.layerTotalNumber =
        parseInt(document.getElementById('layerNumber').value);
  }

  updateExplorationFrequency() {
    this._model.plannerFrequency_ms = parseFloat(
        document.getElementById('explorationFrequency').value) * 1000;
  }

  updateTimestep() {
    this._model.timestep =
        parseFloat(document.getElementById('timestep').value);
  }

  updateIntertime() {
    this._model.intertime =
        parseFloat(document.getElementById('intertime').value);
  }

  updateDrawExploration() {
    this._model.drawExploration =
        document.getElementById('drawExploration').checked;
  }

  updateVelocities() {
    const input = document.getElementById('velocities').value;
    const values = input.split(' ');

    const velocities = [];
    for (const value of values) {
      velocities.push(parseFloat(value));
    }

    this._model.velocities = velocities;
  }

  updateSteeringAngles() {
    const input = document.getElementById('steeringAngles').value;
    const values = input.split(' ');

    const steeringAngles = [];
    for (const value of values) {
      steeringAngles.push(parseFloat(value) * Math.PI / 180);
    }

    this._model.steeringAngles = steeringAngles;
  }

  deleteMap() {
    this._model.deleteMap();
  }

  updateCostDriving() {
    this._model.parameters.costDriving =
        parseFloat(document.getElementById('costDriving').value);
  }

  updateCostDistanceToPath() {
    this._model.parameters.costDistanceToPath =
        parseFloat(document.getElementById('costDistanceToPath').value);
  }

  updateCostDistanceToGoal() {
    this._model.parameters.costDistanceToGoal =
        parseFloat(document.getElementById('costDistanceToGoal').value);
  }

  updateCostDistanceToGoalEuclidian() {
    this._model.parameters.costDistanceToGoalEuclidian = parseFloat(
        document.getElementById('costDistanceToGoalEuclidian').value);
  }
}
module.exports.Controller = Controller;
