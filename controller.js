class Controller {
  constructor(planner, motion, view) {
    this._planner = planner;
    this._motion = motion;
    this._view = view;
    this._intervalHandler = null;
    this._layerTotalNumber = 2;
    this._timer = 0;
    this._baseFrequency_ms = 50;
    this._plannerFrequency_ms = 2000;
    this._step = 0;
    this._activeState = new State();

    this.updateLayerNumber();
    this.updateDrawExploration();
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

  reset() {
    window.clearInterval(this._intervalHandler);
    this._timer = 0;
    this._planner.reset();
    this.updateTimerOnScreen();
  }

  execute() {
    this.startTime = new Date().getTime();
    console.log('Controller.execute() interval =',
        this.startTime - this.endTime, 'ms');

    if (this._step++ %
        (this._plannerFrequency_ms/ this._baseFrequency_ms) === 0) {
      this._planner.explore(this.createInitialState(), this._layerTotalNumber);
      this._planner.calculateFinalTrajectory(this._timer);
    }

    this._activeState = this._motion.move(this._timer);

    this._timer += this._baseFrequency_ms/ 1000;
    this.updateTimerOnScreen();
    this._view.render();

    this.endTime = new Date().getTime();
    console.log('Controller.execute() time =',
        this.endTime - this.startTime, 'ms');
  }

  createInitialState() {
    const state = new State();
    state.v = this._activeState.v;
    state.steeringAngle = this._activeState.steeringAngle;
    return state;
  }

  updateObstacles() {
    this._view.updateObstacles();
    this._planner.reset();
  }

  updateLayerNumber() {
    this._layerTotalNumber = document.getElementById('layerNumber').value;
  }

  updateDrawExploration() {
    this._planner.drawExploration =
        document.getElementById('drawExploration').checked;
  }

  updateTimerOnScreen() {
    let milli = Math.round((this._timer - Math.floor(this._timer)) * 1e3);
    milli = (parseInt(milli) % 1000).toLocaleString('en-US', {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });

    const seconds = (parseInt(this._timer) % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    const minutes = (parseInt(this._timer/ 60) % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    document.getElementById('timer').innerHTML = (
      minutes + ':' +
      seconds + ':' +
      milli
    );
  }
}

// eslint-disable-next-line no-unused-vars
function initializeController() {
  controller = new Controller(planner, motion, view);
}

// eslint-disable-next-line no-unused-vars
let controller;
