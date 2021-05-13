class View {
  constructor(canvas) {
    this._canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;
    this._scale = 50;
    this._shapes = [];
    this._fixedShapes = ['Grid', 'Ego', 'Goal', 'Obstacle'];
    this._ego = null;
    this._lastEgo = null;
    this._lastMovedEgo = null;

    this._canvas.on('object:added', this.objectAddedListener);
    this._canvas.on('object:modified', this.objectMovedListener);

    this.createGrid();
    this.constructEgoShape();
    this.constructGoal();
    this.addShape(this.constructObstacle());
  }

  reset() {
    let end = this._shapes.length;
    for (let i=0; i<end; ++i) {
      const found = this._fixedShapes.find((element) => {
        return element == this._shapes[i].name;
      });
      if (typeof found === 'undefined') {
        this._shapes.splice(i, 1);
        i--;
        end--;
      }
    }

    this._ego.left = this._lastMovedEgo.left;
    this._ego.top = this._lastMovedEgo.top;
    this._ego.angle = this._lastMovedEgo.angle;
    this.updateAllShapesToNewEgo();

    this.draw();
  }

  draw() {
    this._canvas.clear();

    this._shapes.forEach((item) => {
      this._canvas.add(item.fabricObject);
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

    this.draw();
  }

  drawTrajectory(trajectory, color, size, type) {
    const trajGroup = new fabric.Group([], {
      left: this._ego.left,
      top: this._ego.top,
      angle: 0,
      selectable: false,
      evented: false,
    });

    trajectory.getDeepCopy().states.forEach((state, index, self) => {
      if (!state.isColliding) {
        self[index].x *= this._scale;
        self[index].y *= this._scale;
        self[index] = Utils.getStateInGlobalSystem(new Pose(
            this._ego.left, this._ego.top,
            this._ego.angle), state);

        const circle = new fabric.Circle({
          top: state.y,
          left: state.x,
          radius: size,
          fill: color,
          originX: 'center',
          originY: 'center',
        });
        trajGroup.addWithUpdate(circle);

        if (type === 'dotted-line' && index !== 0) {
          const line = new fabric.Line([
            self[index-1].x, self[index-1].y,
            state.x, state.y], {
            stroke: color,
            originX: 'center',
            originY: 'center',
          });
          trajGroup.addWithUpdate(line);
        }
      }
    });

    this.addShape(new Shape('Trajectory', this.getNextId(), trajGroup));
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

  constructObstacle(left = this._width/ 2, top = this._height/ 2,
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
      stroke: 'black',
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
      stroke: 'rgb(6,62,146)',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    const dot = new fabric.Circle({
      radius: 2,
      fill: 'rgb(6,62,146)',
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([circle, dot], {
      top: this._height/ 2,
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
      width: 16,
      height: 16,
      angle: 0,
      fill: 'rgb(3,90,32)',
      originX: 'center',
      originY: 'center',
      top: 10,
    });

    const car = new fabric.Rect({
      width: 30,
      height: 50,
      fill: 'rgba(0,0,0,0)',
      stroke: 'rgb(3,90,32)',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([triangle, car], {
      left: 250,
      top: this._height/ 2 - 10,
      angle: 90,
      originX: 'center',
      originY: 'center',
    });

    this._ego = group;
    this._lastEgo = Object.assign({}, this._ego);
    this._lastMovedEgo = Object.assign({}, this._ego);
    this.addShape(new Shape('Ego', this.getNextId(), group));
  }

  objectAddedListener(ev) {
    // const target = ev.target;
    // console.log('left', target.left, 'top', target.top,
    //    'width', target.width, 'height', target.height);
  }

  createGrid() {
    const grid = new fabric.Group([], {
      selectable: false,
      evented: false,
      opacity: 0.25,
    });

    const gridSize = 50;
    for (let i = 0; i < (this._width / gridSize); i++) {
      grid.addWithUpdate(new fabric.Line([i * gridSize, 0, i * gridSize,
        this._height], {type: 'line', stroke: '#ccc'}));
      grid.addWithUpdate(new fabric.Line([0, i * gridSize,
        this._width, i * gridSize], {type: 'line', stroke: '#ccc'}));
    }

    this.addShape(new Shape('Grid', this.getNextId(), grid));
  }

  updateShape(shape) {
    const match = this.getShapeByName(shape.name);

    if (match[0] == null) {
      this.addShape(shape);
    } else {
      this._shapes[match[1]] = shape;
      this.draw();
    }
  }

  addShape(shape) {
    this._shapes.push(shape);
    this.draw();
  }

  removeShape(shape) {
    this._shapes.forEach((item, index, self) => {
      if (item.id == shape.id) {
        self.splice(index, 1);
      }
    });
  }

  getShapeByName(name) {
    let match = null;
    let index = -1;
    this._shapes.forEach((item, idx) => {
      if (item.name == name) {
        match = item;
        index = idx;
      }
    });
    return [match, index];
  }

  getObjectByName(name) {
    return this.getShapeByName(name)[0].object;
  }

  getLastId() {
    if (this._shapes.length == 0) {
      return 0;
    } else {
      return this._shapes[this._shapes.length - 1].id;
    }
  }

  getNextId() {
    return this.getLastId() + 1;
  }

  updateAllShapesToNewEgo() {
    this._shapes.forEach((shape) => {
      if (shape.name === 'Obstacle' || shape.name === 'Goal') {
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
    });

    this._lastEgo = Object.assign({}, this._ego);
  }

  objectMovedUpdate(target) {
    this._shapes.forEach((shape) => {
      if (shape.fabricObject == target) {
        switch (shape.name) {
          case 'Ego':
            this._lastMovedEgo = Object.assign({}, this._ego);
            break;
          case 'Goal': {
            const newObj = new BasicObject(target.left, target.top,
                target.angle);
            Utils.transformObjectToUsk(this._ego, newObj);
            Utils.convertToMetric(this._scale, newObj);
            Object.assign(shape.object, newObj);
            break;
          }
          case 'Obstacle': {
            const newObj = new Obstacle(target.left, target.top, target.angle,
                target.width * target.scaleX, target.height * target.scaleY);
            Utils.transformObjectToUsk(this._ego, newObj);
            Utils.convertToMetric(this._scale, newObj);
            Object.assign(shape.object, newObj);
            // TODO: Utils.updateDiagonalsRectangle(target);
            break;
          }
        }
      }
    });

    view.reset();
    controller.reset();
  }

  objectMovedListener(ev) {
    const target = ev.target;
    console.log('left', target.left, 'top', target.top, 'width',
        target.width * target.scaleX, 'height', target.height * target.scaleY,
        'orientation', target.angle);
    view.objectMovedUpdate(target);
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
