const fabric = require('fabric').fabric;
const Utils = require('../Utils/Utils').Utils;
const colorMap = require('../Utils/datatypes').colorMap;
const Pose = require('../Utils/datatypes').Pose;
const CarShape = require('../Utils/datatypes').CarShape;
const Shape = require('../Utils/datatypes').Shape;
const Grid = require('./grid').Grid;
const Listener = require('./listener').Listener;

class View {
  constructor(canvas) {
    this._canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;
    this._idCounter = 0;
    this._scale = 20;
    this._shapes = new Map();
    this._fixedShapes = new Set(['Grid', 'Goal', 'Ego']);
    this._ego = null;
    this._car = new CarShape();
    this._grid = null;

    canvas.on('mouse:down', Listener.mouseDownListener);
    canvas.on('object:modified', Listener.objectMovedListener);
    canvas.on('mouse:move', Listener.mouseMovedListener);
    canvas.on('mouse:up', Listener.mouseUpListener);

    this.initMap();
    this.createGrid();
    this.constructEgoShape();
    this.constructGoal();
    this.render();
  }

  set scale(value) {
    this._scale = value;
  }

  initMap() {
    this._fixedShapes.forEach((name) => {
      this._shapes.set(name, []);
    });
  }

  reset() {
    this._shapes.forEach((shapes, name, self) => {
      if (!this._fixedShapes.has(name)) {
        self.delete(name);
      }
    });

    this.redraw();
  }

  redraw() {
    this._canvas.clear();

    this._shapes.forEach((group) => {
      group.forEach((shape) => {
        this._canvas.add(shape.fabricObject);
      });
    });

    this.render();
  }

  render() {
    this._canvas.requestRenderAll();
  }

  disableSelection() {
    this._canvas.discardActiveObject().renderAll();
  }

  bringFixedShapesInFront() {
    this._fixedShapes.forEach((name) => {
      this.getListOfShapesByName(name).forEach((shape) => {
        if (name === 'Grid') {
          shape.fabricObject.sendToBack();
        } else {
          shape.fabricObject.bringToFront();
        }
      });
    });
  }

  updateEgo(ego) {
    this.getListOfShapesByName('Ego')[0].fabricObject.set({
      left: ego.x, top: ego.y, angle: ego.angle});
    this.bringFixedShapesInFront();
  }

  updateGoal(goal) {
    this.getListOfShapesByName('Goal')[0].fabricObject.set({
      left: goal.x, top: goal.y, angle: goal.angle});
    this.bringFixedShapesInFront();
  }

  setPreviousTrajectoriesInactive() {
    if (!this._shapes.has('TrajectoryInactive')) {
      this._shapes.set('TrajectoryInactive', []);
    }

    if (!this._shapes.has('TrajectoryActive')) {
      this._shapes.set('TrajectoryActive', []);
    }

    const activeTrajectories = this._shapes.get('TrajectoryActive');
    // const inactiveTrajectories = this._shapes.get('TrajectoryInactive');
    activeTrajectories.forEach((shape) => {
      this._canvas.remove(shape.fabricObject);
    // @TODO: Enabling this will slow down performance due heavy load on canvas.
    // shape.fabricObject.forEachObject((obj) => {
    //   obj.set({fill: colorMap.get('inactive'), radius: 1, dirty: false});
    // });
    // inactiveTrajectories.push(shape);
    });
    activeTrajectories.length = 0;

    if (!this._shapes.has('ChosenTrajectory')) {
      this._shapes.set('ChosenTrajectory', []);
    }
    const chosenTrajectory = this._shapes.get('ChosenTrajectory');
    chosenTrajectory.forEach((shape) => {
      this._canvas.remove(shape.fabricObject);
    });
    chosenTrajectory.splice(0, chosenTrajectory.length);
  }

  getGraphicsFromTrajectory(trajectory, color, size, type) {
    const objects = [];
    trajectory.segments.forEach((segment) => {
      segment.getDeepCopy().states.forEach((state, index, self) => {
        if (!state.isColliding) {
          self[index].x *= this._scale;
          self[index].y *= this._scale;
          self[index] = Utils.getStateInGlobalSystem(new Pose(this._ego.left,
              this._ego.top, this._ego.angle * Math.PI / 180), self[index]);

          const circle = new fabric.Circle({
            top: self[index].y,
            left: self[index].x,
            radius: size,
            fill: color,
            originX: 'center',
            originY: 'center',
          });
          objects.push(circle);

          if (type === 'dotted-line' && index !== 0) {
            const line = new fabric.Line([
              self[index-1].x, self[index-1].y,
              self[index].x, self[index].y], {
              stroke: color,
              originX: 'center',
              originY: 'center',
            });
            objects.push(line);
          }
        }
      });
    });
    return objects;
  }

  createTrajectoryGroup(objects) {
    const trajGroup = new fabric.Group(objects, {
      left: this._ego.left,
      top: this._ego.top,
      angle: 0,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center',
    });

    trajGroup.set({left: this._ego.left - trajGroup.getObjects()[0].left,
      top: this._ego.top - trajGroup.getObjects()[0].top});

    return trajGroup;
  }

  drawTrajectories(trajectories, color, size, type, name = 'TrajectoryActive') {
    let objects = [];
    trajectories.forEach((trajectory) => {
      objects = objects.concat(
          this.getGraphicsFromTrajectory(trajectory, color, size, type));
    });
    objects.length !== 0 && this.addShape(new Shape(name, this.getNextId(),
        this.createTrajectoryGroup(objects)));
  }

  drawTrajectory(trajectory, color, size, type, name = 'TrajectoryActive') {
    const objects =
        this.getGraphicsFromTrajectory(trajectory, color, size, type);

    this.addShape(new Shape(name, this.getNextId(),
        this.createTrajectoryGroup(objects)));
  }

  drawEgoPoint(color, size, name = 'EgoPoint') {
    const circle = new fabric.Circle({
      top: this._ego.top,
      left: this._ego.left,
      radius: size,
      fill: color,
      originX: 'center',
      originY: 'center',
    });

    this.addShape(new Shape(name, this.getNextId(), circle));
  }

  constructGoal() {
    const circle = new fabric.Circle({
      radius: 10,
      fill: '',
      stroke: colorMap.get('goal'),
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    const dot = new fabric.Circle({
      radius: 2,
      fill: colorMap.get('goal'),
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([circle, dot], {
      originX: 'center',
      originY: 'center',
    });

    group.on('mousemove', Listener.objectMouseMoveListener);
    group.on('mouseout', Listener.objectMouseOutListener);
    this.addShape(new Shape('Goal', this.getNextId(), group));
  };

  constructEgoShape() {
    const triangle = new fabric.Triangle({
      width: 12,
      height: 12,
      fill: colorMap.get('ego'),
      originX: 'center',
      originY: 'center',
      top: 10,
    });

    const car = new fabric.Rect({
      width: this._car.width * this._scale,
      height: this._car.length * this._scale,
      fill: 'white',
      stroke: colorMap.get('ego'),
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([car, triangle], {
      originX: 'center',
      originY: 'center',
    });

    group.on('mousemove', Listener.objectMouseMoveListener);
    group.on('mouseout', Listener.objectMouseOutListener);
    this._ego = group;
    this.addShape(new Shape('Ego', this.getNextId(), group));
  }

  createGrid() {
    this._grid = new Grid(this._width, this._height, this._scale);

    this.addShape(new Shape('Grid',
        this.getNextId(),
        this._grid.object));
  }

  addShape(shape) {
    if (this._shapes.has(shape.name)) {
      this._shapes.get(shape.name).push(shape);
    } else {
      this._shapes.set(shape.name, [shape]);
    }

    this._canvas.add(shape.fabricObject);
  }

  getListOfShapesByName(name) {
    if (this._shapes.has(name)) {
      return this._shapes.get(name);
    } else {
      return [];
    }
  }

  getNextId() {
    return this._idCounter++;
  }

  updateTimerOnScreen(timer) {
    document.getElementById('timer').innerHTML = (
      Utils.convertTimerToString(timer)
    );
  }

  drawFilter(filter) {
    const stateMin = new State(
        filter.startX * this._scale, filter.startY * this._scale);
    const transformed = Utils.getStateInGlobalSystem(new Pose(this._ego.left,
        this._ego.top, this._ego.angle * Math.PI / 180), stateMin);

    const frame = new fabric.Rect({
      width: filter.deltaX * filter.X * this._scale,
      height: filter.deltaY * filter.Y * this._scale,
      fill: '',
      stroke: colorMap.get('ego'),
      strokeWidth: 1,
      originX: 'left',
      originY: 'bottom',
    });

    const lines = [];
    lines.push(frame);
    for (let i=0; i<filter.X; ++i) {
      lines.push(new fabric.Line([i * filter.deltaX * this._scale,
        0,
        i * filter.deltaX * this._scale,
        -filter.deltaY * filter.Y * this._scale],
      {type: 'line', stroke: colorMap.get('ego')}));
    }

    for (let i=0; i<filter.Y; ++i) {
      lines.push(new fabric.Line([0,
        -i * filter.deltaY * this._scale,
        filter.deltaX * filter.X * this._scale,
        -i * filter.deltaY * this._scale],
      {type: 'line', stroke: colorMap.get('ego')}));
    }

    const group = new fabric.Group(lines, {
      left: transformed.x,
      top: transformed.y,
      angle: this._ego.angle - 90,
      fill: '',
      originX: 'left',
      originY: 'bottom',
    });

    this.addShape(new Shape('Filter',
        this.getNextId(),
        group));
  }

  drawObstacle(pose) {
    this._grid.setSquareAsObstacle(parseInt(pose.x / this._scale),
        parseInt(pose.y / this._scale));

    this.bringFixedShapesInFront();
    this.render();
  }

  toggleObstacle(pose) {
    this._grid.toggleSquare(parseInt(pose.x / this._scale),
        parseInt(pose.y / this._scale),
        colorMap.get('obstacle'));

    this.bringFixedShapesInFront();
    this.render();
  }

  drawNodeAStarTentative(x, y) {
    this._grid.paintSquare(x, y, colorMap.get('astartentative'));

    this.bringFixedShapesInFront();
    this.render();
  }

  drawNodeAStarVisited(x, y) {
    this._grid.paintSquare(x, y, colorMap.get('astarvisited'));

    this.bringFixedShapesInFront();
    this.render();
  }

  clearNodeDrawn(x, y) {
    this._grid.paintSquare(x, y, colorMap.get('background'));

    this.bringFixedShapesInFront();
    this.render();
  }

  drawPath(path) {
    path.forEach((node) => {
      this._grid.paintSquare(node[0], node[1], colorMap.get('path'));
    });
  }

  clearAllObstacles() {
    this._grid.clear();
    this.bringFixedShapesInFront();
    this.render();
  }
}
module.exports.View = View;
