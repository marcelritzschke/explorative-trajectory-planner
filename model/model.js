const Pose = require('../utils/datatypes').Pose;
const State = require('../utils/datatypes').State;
const Utils = require('../utils/utils').Utils;
const AStar = require('../model/astar').AStar;

class Model {
  constructor(view,
      width,
      height,
      obstacleGrid,
      distanceGrid,
      distanceToGoalGrid,
      parameters,
      planner,
      motion,
  ) {
    this._view = view;

    this._scale = 20;
    this._width = width;
    this._height = height;

    this._ego = Utils.convertToMetric(this._scale,
        new Pose(width/ 4, height/ 8, 110));
    this._goal = Utils.convertToMetric(this._scale,
        new Pose(width * .75, height/ 8));
    this._lastMovedEgo = Object.assign({}, this._ego);

    this._obstacleGrid = obstacleGrid;
    this._distanceGrid = distanceGrid;
    this._distanceToGoalGrid = distanceToGoalGrid;
    this._parameters = parameters;
    this._planner = planner;
    this._motion = motion;

    this._layerTotalNumber = 2;
    this._baseFrequency_ms = 50;
    this._plannerFrequency_ms = 2000;
    this._step = 0;
    this._activeState = new State();

    this._astar = null;
    this._astarIsFinished = false;
    this._astarIsStarted = false;

    this.updateEgo(this._ego);
    this.updateGoal(this._goal);
  }

  setEgo(x, y, angle) {
    this._ego = Utils.convertToMetric(this._scale, new Pose(x, y, angle));
    Object.assign(this._lastMovedEgo, this._ego);
    this.updateEgo(this._ego);
  }

  updateEgo(ego) {
    this._view.updateEgo(Utils.convertToPixels(this._scale, ego));
    this._obstacleGrid.updateEgo(ego);
    this._distanceGrid.updateEgo(ego);
    this._distanceToGoalGrid.updateEgo(ego);
    this._planner.updateEgo(ego);
  }

  setGoal(x, y, angle) {
    this._goal = Utils.convertToMetric(this._scale, new Pose(x, y, angle));
    this.updateGoal(this._goal);
  }

  updateGoal(goal) {
    this._view.updateGoal(Utils.convertToPixels(this._scale, goal));
    this._planner.updateGoal(goal);
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
      this._astar = new AStar(true, this._view,
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
      this._distanceToGoalGrid.calculate(path);
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

    this.updateEgo(this._ego);
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

  escapeKeyPressed() {
    this._view.disableSelection();
  }

  get scale() {
    return this._scale;
  }

  get parameters() {
    return this._parameters;
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
