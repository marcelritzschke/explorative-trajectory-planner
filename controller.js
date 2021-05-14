class Controller {
  constructor(planner, motion) {
    this._planner = planner;
    this._motion = motion;
    this._intervalHandler = null;
    this._layerTotalNumber = 2;
    this._timer = 0;
    this._baseFrequency_ms = 50;
    this._plannerFrequency_ms = 2000;
    this._step = 0;
    this._running = false;

    this.updateLayerNumber();
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
    if (this._step++ %
        (this._plannerFrequency_ms/ this._baseFrequency_ms) === 0) {
      this._planner.explore(this._layerTotalNumber);
      this._planner.calculateFinalTrajectory(this._timer);
    }

    this._motion.move(this._timer);

    this._timer += this._baseFrequency_ms/ 1000;
    this.updateTimerOnScreen();
  }

  updateLayerNumber() {
    this._layerTotalNumber = document.getElementById('layerNumber').value;
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
  controller = new Controller(planner, motion);
}

// eslint-disable-next-line no-unused-vars
let controller;
