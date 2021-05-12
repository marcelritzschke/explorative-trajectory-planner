class Controller {
  constructor(planner, motion) {
    this._planner = planner;
    this._motion = motion;
    this._intervalHandler = null;
    this._currentLayer = 0;
    this._layerTotalNumber = 3;
    this._gotFinalTrajectory = false;
    this._timer = 0;
    this._baseFrequency_ms = 50;
    this._plannerFrequency_ms = 750;
    this._step = 0;
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
    this._currentLayer = 0;
    this._gotFinalTrajectory = false;
    this._planner.reset();
  }

  execute() {
    if (this._step++ %
        (this._plannerFrequency_ms/ this._baseFrequency_ms) === 0) {
      if (this._currentLayer < this._layerTotalNumber) {
        this._planner.explore(this._currentLayer);
        this._currentLayer++;
      } else if (this._gotFinalTrajectory === false) {
        this._planner.calculateFinalTrajectory(this._timer);
        this._gotFinalTrajectory = true;
      }
    }

    this._motion.move(this._timer);

    this._timer += this._baseFrequency_ms/ 1000;
    this.updateTimerOnScreen();
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
