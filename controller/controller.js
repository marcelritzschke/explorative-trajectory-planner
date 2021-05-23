class Controller {
  constructor(model) {
    this._model = model;
    this._intervalHandler = null;
    this._timer = 0;
    this._baseFrequency_ms = 50;

    this.reset();
  }

  step() {
    this.execute();
  }

  play() {
    this._intervalHandler = window.setInterval(() => this.execute(),
        this._baseFrequency_ms);
  }

  pause() {
    window.clearInterval(this._intervalHandler);
  }

  execute() {
    this._model.execute(this._timer);
    this._timer += this._baseFrequency_ms/ 1000;
  }

  reset() {
    window.clearInterval(this._intervalHandler);
    this._timer = 0;
    this._model.reset();
    this.updateLayerNumber();
    this.updateTimestep();
    this.updateIntertime();
    this.updateDrawExploration();
    this.updateVelocities();
    this.updateSteeringAngles();
  }

  updateObstacles() {
    this._view.updateObstacles();
    this._model.reset();
  }

  updateLayerNumber() {
    this._model.layerTotalNumber =
        parseInt(document.getElementById('layerNumber').value);
  }

  updateBaseFrequency() {
    window.clearInterval(this._intervalHandler);
    this._baseFrequency_ms =
        parseFloat(document.getElementById('baseFrequency').value) * 1000;
    this._intervalHandler = window.setInterval(() => this.execute(),
        this._baseFrequency_ms);
    this._model.baseFrequency = this._baseFrequency_ms;
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
}
module.exports.Controller = Controller;
