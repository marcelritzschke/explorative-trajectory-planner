class View {
  constructor(canvas) {
    this._canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;
    this._scale = 100;
    this._shapes = [];
    this._fixedShapes = ['Grid', 'Ego', 'Goal', 'Obstacle'];

    this._canvas.on('object:added', this._objectAddedListener);
    this._canvas.on('object:modified', this.objectMovedListener);

    this._createGrid();
    this._constructEgoShape();
    this._constructGoal();
    this._constructObstacle();
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

    this.draw();
  }

  draw() {
    this._canvas.clear();

    this._shapes.forEach((item) => {
      this._canvas.add(item.object);
    });
  }

  updateEgo(origin, state) {
    const ego = this.getObjectByName('Ego');
    let newPosition = state;
    state.x *= this._scale;
    state.y *= this._scale;
    newPosition = Utils.getStateInGlobalSystem(
        Utils.convertToPixels(this._scale, origin), state);

    ego.left = newPosition.x;
    ego.top = newPosition.y;
    ego.angle = newPosition.theta;

    this.draw();
  }

  drawTrajectory(trajectory, color, size, type) {
    const trajGroup = new fabric.Group([], {
      left: this.getObjectByName('Ego').left,
      top: this.getObjectByName('Ego').top,
      angle: 0,
      selectable: false,
      evented: false,
    });

    trajectory.getDeepCopy().states.forEach((state, index, self) => {
      if (!state.isColliding) {
        self[index].x *= this._scale;
        self[index].y *= this._scale;
        self[index] = Utils.getStateInGlobalSystem(new Pose(
            this.getObjectByName('Ego').left, this.getObjectByName('Ego').top,
            this.getObjectByName('Ego').angle), state);

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

  getGoalPosition() {
    const goal = Utils.getObjectPositionInUsk(this.getObjectByName('Ego'),
        this.getObjectByName('Goal'));
    return [
      goal[0]/ this._scale,
      goal[1]/ this._scale,
      goal[2],
    ];
  }

  getEgoPosition() {
    return [
      this.getObjectByName('Ego').left/ this._scale,
      this.getObjectByName('Ego').top/ this._scale,
      this.getObjectByName('Ego').angle,
    ];
  }

  getObstacle() {
    const obstacle = Utils.getObjectPositionInUsk(this.getObjectByName('Ego'),
        this.getObjectByName('Obstacle'));
    console.log(obstacle[0], obstacle[1], obstacle[2]);
    return new Obstacle(
        obstacle[0]/ this._scale,
        obstacle[1]/ this._scale,
        obstacle[2],
        this.getObjectByName('Obstacle').width/ this._scale,
        this.getObjectByName('Obstacle').height/ this._scale,
    );
  }

  drawLine(startX, startY, endX, endY, color) {
    const line = new fabric.Line([startX, startY, endX, endY], {
      stroke: color,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center',
    });

    this.updateShape(new Shape('Connection', this.getNextId(), line));
  }

  _constructObstacle() {
    const rectangle = new fabric.Rect({
      left: this._width/ 2,
      top: this._height/ 2,
      width: 100,
      height: 50,
      angle: 0,
      fill: '',
      originX: 'center',
      originY: 'center',
      stroke: 'black',
      strokeWidth: 2,
    });

    const filledRect = Utils.fillRectangleWithDiagonals(rectangle);
    this.addShape(new Shape('Obstacle', this.getNextId(), filledRect));
  }

  _constructGoal() {
    const circle = new fabric.Circle({
      radius: 10,
      fill: '',
      stroke: 'blue',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    const dot = new fabric.Circle({
      radius: 2,
      fill: 'blue',
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

    this.addShape(new Shape('Goal', this.getNextId(), group));
  };

  _constructEgoShape() {
    const triangle = new fabric.Triangle({
      width: 16,
      height: 16,
      angle: 0,
      fill: 'green',
      originX: 'center',
      originY: 'center',
      top: 10,
    });

    const car = new fabric.Rect({
      width: 30,
      height: 50,
      fill: 'rgba(0,0,0,0)',
      stroke: 'green',
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

    this.addShape(new Shape('Ego', this.getNextId(), group));
  }

  _objectAddedListener(ev) {
    // const target = ev.target;
    // console.log('left', target.left, 'top', target.top,
    //    'width', target.width, 'height', target.height);
  }

  _createGrid() {
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

  objectMovedListener(ev) {
    const target = ev.target;
    console.log('left', target.left, 'top', target.top, 'width',
        target.width * target.scaleX, 'height', target.height * target.scaleY,
        'orientation', target.angle);
    if (target == view.getObjectByName('Ego') ||
      target == view.getObjectByName('Goal') ||
      target == view.getObjectByName('Obstacle')) {
      view.reset();
      controller.reset();
    }
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
