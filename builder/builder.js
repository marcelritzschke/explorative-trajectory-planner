const View = require('../view/view').View;
const Model = require('../model/model').Model;
const Controller = require('../controller/controller').Controller;
const ObstacleGrid = require('../model/obstaclegrid').ObstacleGrid;
const DistanceGrid = require('../model/distancegrid').DistanceGrid;
const DistanceToGoalGrid =
    require('../model/distancetogoal').DistanceToGoalGrid;
const Parameters = require('../utils/datatypes').Parameters;
const Planner = require('../model/planner').Planner;
const Motion = require('../model/motion').Motion;
const Explorer = require('../model/explorer').Explorer;

class Builder {
  constructor(canvas, scale) {
    this._canvas = canvas;
    this._scale = scale;
    this._width = canvas.width;
    this._height = canvas.height;
  }

  build() {
    // View
    this._view = new View(this._canvas);

    // Model
    this._obstacleGrid = new ObstacleGrid(
        this._width/ this._scale,
        this._height/ this._scale,
    );

    this._distanceGrid = new DistanceGrid(
        parseInt(this._width/ this._scale),
        parseInt(this._height/ this._scale),
    );

    this._distanceToGoalGrid = new DistanceToGoalGrid(
        parseInt(this._width/ this._scale),
        parseInt(this._height/ this._scale),
        this._obstacleGrid,
    );

    this._parameters = new Parameters();

    this._explorer = new Explorer(
        this._view,
        this._parameters,
        this._obstacleGrid,
        this._distanceGrid,
        this._distanceToGoalGrid,
    );

    this._planner = new Planner(this._view,
        this._parameters,
        this._explorer,
    );

    this._motion = new Motion(this._planner, this._view);

    this._model = new Model(this._view,
        this._width,
        this._height,
        this._obstacleGrid,
        this._distanceGrid,
        this._distanceToGoalGrid,
        this._parameters,
        this._planner,
        this._motion,
    );

    // Controller
    this._controller = new Controller(this._model);
  }

  getModel() {
    return this._model;
  }

  getView() {
    return this._view;
  }

  getController() {
    return this._controller;
  }
}
module.exports.Builder = Builder;
