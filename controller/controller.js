class Controller {
  constructor(model) {
    this._model = model;
    this._intervalHandlerPath = null;
    this._intervalHandlerTraj = null;
    this._timer = 0;
    this._baseFrequencyPath_ms = 10;
    this._baseFrequencyTraj_ms = 50;


    document.onkeydown = function(e) {
      if (e.key === 'Escape') {
        model.escapeKeyPressed();
      }
    };

    this.reset();
  }

  makePath() {
    this._intervalHandlerPath = window.setInterval(() =>
      this.executePathPlanner(), this._baseFrequencyPath_ms);

    this.setControlsInactive();
    this.setPathButtonInactive();
  }

  executePathPlanner() {
    if (this._model.isPathPlannerFinished()) {
      window.clearInterval(this._intervalHandlerPath);
      this.setControlsActive();
      this.setPathButtonActive();
    } else {
      this._model.runPathPlanner();
    }
  }

  step() {
    this.execute();
  }

  play() {
    this._intervalHandlerTraj = window.setInterval(() => this.execute(),
        this._baseFrequencyTraj_ms);
    this.setPathButtonInactive();
  }

  pause() {
    window.clearInterval(this._intervalHandlerTraj);
    this.setPathButtonActive();
  }

  execute() {
    this._model.execute(this._timer);
    this._timer += this._baseFrequencyTraj_ms/ 1000;
  }

  reset() {
    window.clearInterval(this._intervalHandlerTraj);
    window.clearInterval(this._intervalHandlerPath);
    this.setPathButtonActive();
    this._timer = 0;
    this._model.reset();
    this.updateLayerNumber();
    this.updateTimestep();
    this.updateIntertime();
    this.updateDrawExploration();
    this.updateVelocities();
    this.updateSteeringAngles();
  }

  setControlsInactive() {
    document.getElementById('controls').innerHTML = `
      <div onclick="" class="step-button step-button-inactive"></div>
      <div onclick="" class="play-button play-button-inactive"></div>
      <div onclick="" class="pause-button pause-button-inactive"></div>
      <div onclick="" class="reset-button reset-button-inactive"></div>
    `;
  }

  setPathButtonInactive() {
    document.getElementById('inputFieldPath').innerHTML = `
    <button class="button button-inactive" id="makePath" onclick="">
    Plan Path
    </button>
    `;
  }

  setControlsActive() {
    document.getElementById('controls').innerHTML = `
      <div onclick="getController().step()"
        class="step-button step-button-active"></div>
      <div onclick="getController().play()"
        class="play-button play-button-active"></div>
      <div onclick="getController().pause()"
        class="pause-button pause-button-active"></div>
      <div onclick="getController().reset()"
        class="reset-button reset-button-active"></div>
  `;
  }

  setPathButtonActive() {
    document.getElementById('inputFieldPath').innerHTML = `
    <button class="button" id="makePath" onclick="getController().makePath()">
    Plan Path
    </button>
    `;
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
