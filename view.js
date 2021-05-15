class View {
  constructor(canvas) {
    this._canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;
    this._idCounter = 0;
    this._scale = 50;
    this._shapes = new Map();
    this._fixedShapes = new Set(['Grid', 'Obstacle', 'Goal', 'Ego']);
    this._ego = null;
    this._lastEgo = null;
    this._lastMovedEgo = null;
    this._grid = null;

    this._canvas.on('object:added', Listener.objectAddedListener);
    this._canvas.on('object:modified', Listener.objectMovedListener);
    this._canvas.on('mouse:wheel', Listener.mouseWheelListener);
    this._canvas.on('mouse:down', Listener.mouseDownListener);
    this._canvas.on('mouse:move', Listener.mouseMoveListener);
    this._canvas.on('mouse:up', Listener.mouseUpListener);

    this.initMap();
    this.updateScale();
    this.createGrid();
    this.constructEgoShape();
    this.constructGoal();
    this.addShape(this.constructObstacle());
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

    this._ego.left = this._lastMovedEgo.left;
    this._ego.top = this._lastMovedEgo.top;
    this._ego.angle = this._lastMovedEgo.angle;
    this.updateAllShapesToNewEgo();

    this.redraw();
  }

  redraw() {
    this._canvas.clear();

    this._shapes.forEach((group) => {
      group.forEach((shape) => {
        this._canvas.add(shape.fabricObject);
      });
    });
  }

  bringFixedShapesInFront() {
    this._fixedShapes.forEach((name) => {
      this.getListOfShapesByName(name).forEach((shape) => {
        shape.fabricObject.bringToFront();
      });
    });
  }

  updateEgo(origin, state) {
    let newPosition = state;
    state.x *= this._scale;
    state.y *= this._scale;
    newPosition = Utils.getStateInGlobalSystem(
        Utils.convertToPixels(this._scale, origin), state);

    this._ego.left = newPosition.x;
    this._ego.top = newPosition.y;
    this._ego.angle = newPosition.theta;
    this.updateAllShapesToNewEgo();
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
    const inactiveTrajectories = this._shapes.get('TrajectoryInactive');
    activeTrajectories.forEach((shape) => {
      shape.fabricObject.forEachObject((obj) => {
        obj.set({fill: colorMap.get('inactive'), radius: 1});
      });
      inactiveTrajectories.push(shape);
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

  drawTrajectory(trajectory, color, size, type, name = 'TrajectoryActive') {
    const objects = [];

    trajectory.segments.forEach((segment) => {
      segment.getDeepCopy().states.forEach((state, index, self) => {
        if (!state.isColliding) {
          self[index].x *= this._scale;
          self[index].y *= this._scale;
          self[index] = Utils.getStateInGlobalSystem(new Pose(
              this._ego.left, this._ego.top, this._ego.angle), state);

          const circle = new fabric.Circle({
            top: state.y,
            left: state.x,
            radius: size,
            fill: color,
            originX: 'center',
            originY: 'center',
          });
          objects.push(circle);

          if (type === 'dotted-line' && index !== 0) {
            const line = new fabric.Line([
              self[index-1].x, self[index-1].y,
              state.x, state.y], {
              stroke: color,
              originX: 'center',
              originY: 'center',
            });
            objects.push(line);
          }
        }
      });
    });

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

    this.addShape(new Shape(name, this.getNextId(), trajGroup));
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

  getGoal() {
    return this.getObjectByName('Goal');
  }

  getEgoPosition() {
    return [
      this._ego.left/ this._scale, // TODO: scale needed ?
      this._ego.top/ this._scale,
      this._ego.angle,
    ];
  }

  getObstacle() {
    return this.getObjectByName('Obstacle');
  }

  constructObstacle(left = this._width/ 2, top = 150,
      angle = 0, width = 100, height = 50) {
    const rect = new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      angle: angle,
      fill: '',
      originX: 'center',
      originY: 'center',
      stroke: colorMap.get('obstacle'),
      strokeWidth: 2,
    });
    const filledRect = Utils.fillRectangleWithDiagonals(rect);

    let object = new Obstacle(filledRect.left, filledRect.top, filledRect.angle,
        filledRect.width, filledRect.height);
    object = Utils.transformObjectToUsk(this._ego, object);
    object = Utils.convertToMetric(this._scale, object);

    return new Shape('Obstacle', this.getNextId(), filledRect, object);
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
      top: 150,
      left: this._width - 300,
      angle: 90,
      originX: 'center',
      originY: 'center',
    });

    const object = new BasicObject(group.left, group.top, group.angle);
    this.addShape(new Shape('Goal', this.getNextId(), group,
        Utils.convertToMetric(this._scale,
            Utils.transformObjectToUsk(this._ego, object))),
    );
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
      width: 20,
      height: 40,
      fill: 'white',
      stroke: colorMap.get('ego'),
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([car, triangle], {
      left: 250,
      top: 100,
      angle: 90,
      originX: 'center',
      originY: 'center',
    });

    this._ego = group;
    this._lastEgo = Object.assign({}, this._ego);
    this._lastMovedEgo = Object.assign({}, this._ego);
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

  getObjectByName(name) {
    return this.getListOfShapesByName(name)[0].object;
  }

  getNextId() {
    return this._idCounter++;
  }

  updateAllShapesToNewEgo() {
    this.updateShapeToNewEgo('Obstacle');
    this.updateShapeToNewEgo('Goal');

    this._lastEgo = Object.assign({}, this._ego);
  }

  updateShapeToNewEgo(name) {
    const shape = this._shapes.get(name)[0];
    let newEgo = new BasicObject(this._ego.left, this._ego.top,
        this._ego.angle);

    newEgo = Utils.transformObjectToUsk(this._lastEgo, newEgo);

    const xShift = newEgo.x/ this._scale;
    const yShift = newEgo.y/ this._scale;
    const theta = (this._ego.angle - this._lastEgo.angle) * Math.PI / 180;

    const newX = shape.object.x - xShift;
    const newY = shape.object.y - yShift;

    const res = Utils.rotatePoint(newX, newY, theta);
    shape.object.x = res[0];
    shape.object.y = res[1];
    shape.object.angle = shape.object.angle - theta;
  }

  objectMovedUpdate(target) {
    if (this._shapes.get('Ego')[0].fabricObject == target) {
      this._lastMovedEgo = Object.assign({}, this._ego);
    } else if (this._shapes.get('Goal')[0].fabricObject == target) {
      const newObj = new BasicObject(target.left, target.top,
          target.angle);
      Utils.transformObjectToUsk(this._ego, newObj);
      Utils.convertToMetric(this._scale, newObj);
      Object.assign(this._shapes.get('Goal')[0].object, newObj);
    } else if (this._shapes.get('Obstacle')[0].fabricObject) {
      const newObj = new Obstacle(target.left, target.top, target.angle,
          target.width * target.scaleX, target.height * target.scaleY);
      Utils.transformObjectToUsk(this._ego, newObj);
      Utils.convertToMetric(this._scale, newObj);
      Object.assign(this._shapes.get('Obstacle')[0].object, newObj);
      // TODO: Utils.updateDiagonalsRectangle(target);
    }

    view.reset();
    controller.reset();
  }

  updateScale() {
    const oldScale = this._scale;
    let newScale = document.getElementById('scale').value;

    if (newScale < 10) {
      newScale = 10;
      document.getElementById('scale').value = '10';
    }

    this._shapes.get('Obstacle').forEach((shape) => {
      shape.object.rescale(oldScale, newScale);
    });
    this._shapes.get('Goal').forEach((shape) => {
      shape.object.rescale(oldScale, newScale);
    });

    if (this._grid != null) {
      this._grid.rescale(newScale);
      this.reset();
    }

    this._scale = newScale;
  }
}

// eslint-disable-next-line no-unused-vars
function initializeView() {
  const elem = document.querySelector('.canvas');
  const style = getComputedStyle(elem);

  view = new View(new fabric.Canvas('mainView', {
    width: parseFloat(style.width),
    height: parseFloat(style.height),
  }));
}

let view;
