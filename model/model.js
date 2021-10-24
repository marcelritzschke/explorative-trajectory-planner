const Planner = require('./planner').Planner;
const Motion = require('./motion').Motion;
const Pose = require('../utils/datatypes').Pose;
const State = require('../utils/datatypes').State;
const ObstacleGrid = require('../utils/datatypes').ObstacleGrid;
const Utils = require('../Utils/Utils').Utils;
const AStar = require('../model/astar').AStar;
const DistanceGrid = require('../model/distancegrid').DistanceGrid;

class Model {
  constructor(view, width, height) {
    this._view = view;
    this._scale = 20;
    this._width = width;
    this._height = height;
    this._ego = Utils.convertToMetric(this._scale,
        new Pose(width/ 4, height/ 8, 110));
    this._goal = Utils.convertToMetric(this._scale,
        new Pose(width * .75, height/ 8));
    this._lastMovedEgo = Object.assign({}, this._ego);
    this._obstacleGrid = new ObstacleGrid(width/ this._scale,
        height/ this._scale, this);
    this._distanceGrid = new DistanceGrid(parseInt(width/ this._scale),
        parseInt(height/ this._scale), this);

    this._planner = new Planner(view, this._obstacleGrid,
        this._distanceGrid, this);
    this._motion = new Motion(this._planner, view);

    this._layerTotalNumber = 2;
    this._baseFrequency_ms = 50;
    this._plannerFrequency_ms = 2000;
    this._step = 0;
    this._activeState = new State();

    this._astar = null;
    this._astarIsFinished = false;
    this._astarIsStarted = false;

    this._view.updateGoal(Utils.convertToPixels(this._scale, this._goal));
    this._view.updateEgo(Utils.convertToPixels(this._scale, this._ego));
  }

  setEgo(x, y, angle) {
    this._ego = Utils.convertToMetric(this._scale, new Pose(x, y, angle));
    Object.assign(this._lastMovedEgo, this._ego);
    this._view.updateEgo(Utils.convertToPixels(this._scale, this._ego));
  }

  setGoal(x, y, angle) {
    this._goal = Utils.convertToMetric(this._scale, new Pose(x, y, angle));
    this._view.updateGoal(Utils.convertToPixels(this._scale, this._goal));
  }

  setObstacle(x, y) {
    this._obstacleGrid.setObstacle(
        Utils.convertToMetric(this._scale, new Pose(x, y)));
    this._view.drawObstacle(new Pose(x, y));
  }

  toggleObstacle(x, y) {
    this._obstacleGrid.toggleObstacle(
        Utils.convertToMetric(this._scale, new Pose(x, y)));
    this._view.toggleObstacle(new Pose(x, y));
  }

  reset() {
    Object.assign(this._ego, this._lastMovedEgo);
    this._view.updateEgo(Utils.convertToPixels(this._scale, this._ego));

    this._planner.reset();
    this._view.reset();
  }

  isPathPlannerFinished() {
    if (this._astar === null) {
      return false;
    }
    return this._astar.isFinished();
  }

  runPathPlanner() {
    if (!this._astarIsStarted) {
      this._astar = new AStar(this._view,
          [parseInt(this._ego.x), parseInt(this._ego.y)],
          [parseInt(this._goal.x), parseInt(this._goal.y)],
          this._obstacleGrid.grid);
      this._astarIsStarted = true;
    }

    this._astar.iterate();

    if (this._astar.isFinished()) {
      const path = this._astar.getPath();
      this._view.drawPath(path);
      this._distanceGrid.calculate(path);
    }
  }

  execute(timer) {
    if (this._step++ %
        (this._plannerFrequency_ms/ this._baseFrequency_ms) === 0) {
      this._planner.explore(this.createInitialState(), this._layerTotalNumber);
      this._planner.calculateFinalTrajectory(timer);
    }

    if (this._planner.lastTrajectory.length !== 0) {
      this._activeState = this._motion.move(timer);
      this._ego = this.getEgoFromState();
    }

    this._view.updateEgo(Utils.convertToPixels(this._scale, this._ego));
    this._view.updateTimerOnScreen(timer);
    this._view.render();
  }

  getEgoFromState() {
    return this.transformStateToGlobal(this._planner.lastTrajectory.origin,
        this._activeState);
  }

  transformStateToGlobal(origin, state) {
    let newPosition = state;
    newPosition = Utils.getStateInGlobalSystem(origin, state);

    return new Pose(newPosition.x, newPosition.y, newPosition.angle);
  }

  createInitialState() {
    const state = new State();
    state.v = this._activeState.v;
    state.steeringAngle = this._activeState.steeringAngle;
    return state;
  }

  deleteMap() {
    this._obstacleGrid.clear();
    this._view.clearAllObstacles();
  }

  getEgo() {
    return this._ego;
  }

  getGoal() {
    return Utils.transformObjectToUsk(this._ego, this._goal);
  }

  escapeKeyPressed() {
    this._view.disableSelection();
  }

  get scale() {
    return this._scale;
  }

  set scale(value) {
    this._scale = value;
    this._view.scale = value;
  }

  set timestep(value) {
    this._planner.timestep = value;
  }

  set intertime(value) {
    this._planner.intertime = value;
  }

  set layerTotalNumber(value) {
    this._layerTotalNumber = value;
  }

  set baseFrequency(value) {
    this._baseFrequency_ms = value;
  }

  set plannerFrequency(value) {
    this._plannerFrequency_ms = value;
  }

  set drawExploration(value) {
    this._planner.drawExploration = value;
  }

  set velocities(value) {
    this._planner.velocities = value;
  }

  set steeringAngles(value) {
    this._planner.steeringAngles = value;
  }
}
module.exports.Model = Model;
