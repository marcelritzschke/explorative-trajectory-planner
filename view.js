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
        self[index] = this.getStateInGlobalSystem(state);

        const circle = new fabric.Circle({
          top: state.y,
          left: state.x,
          radius: size,
          fill: color,
          originX: 'center',
          originY: 'center',
        });
        trajGroup.addWithUpdate(circle);

        // if (type === 'dotted-line' && index !== 0) {
        //   const line = new fabric.Line([
        //     self[index-1].x * this._scale + this.getObjectByName('Ego').left,
        //     self[index-1].y * this._scale + this.getObjectByName('Ego').top,
        //     state.x * this._scale + this.getObjectByName('Ego').left,
        //     state.y * this._scale + this.getObjectByName('Ego').top], {
        //     stroke: color,
        //     originX: 'center',
        //     originY: 'center',
        //   });
        //   trajGroup.addWithUpdate(line);
        // }
      }
    });

    this.addShape(new Shape('Trajectory', this.getNextId(), trajGroup));
  }

  getGoalPosition() {
    const goal = this.getObjectPositionInUsk(this.getObjectByName('Goal'));
    return [
      goal[0]/ this._scale,
      goal[1]/ this._scale,
      goal[2],
    ];
  }

  getEgoPosition() {
    const ego = this.getObjectPositionInUsk(this.getObjectByName('Ego'));
    return [
      ego[0]/ this._scale,
      ego[1]/ this._scale,
      ego[2],
    ];
  }

  getObstacle() {
    const obstacle = this.getObjectPositionInUsk(
        this.getObjectByName('Obstacle'));
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
    const rect = new fabric.Rect({
      top: this._height/ 2 - 50,
      left: this._width/ 2,
      width: 100,
      height: 50,
      angle: 0,
      fill: 'red',
      originX: 'center',
      originY: 'center',
      opacity: .5,
    });

    this.addShape(new Shape('Obstacle', this.getNextId(), rect));
  }

  _constructGoal() {
    const circle = new fabric.Circle({
      top: this._height/ 2,
      left: this._width - 100,
      radius: 10,
      fill: 'blue',
      originX: 'center',
      originY: 'center',
    });

    this.addShape(new Shape('Goal', this.getNextId(), circle));
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

    const rect = new fabric.Rect({
      width: 30,
      height: 50,
      fill: 'rgba(0,0,0,0)',
      stroke: 'green',
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([triangle, rect], {
      left: 100,
      top: this._height/ 2,
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

  getObjectPositionInUsk(object) {
    const x = object.left;
    const y = object.top;
    const ego = this.getObjectByName('Ego');
    const theta = ego.angle * Math.PI / 180 - 90 * Math.PI / 180;

    let newX = x - ego.left;
    let newY = y - ego.top;

    const buf = newX;
    newX = Math.cos(theta) * newX - Math.sin(theta) * newY;
    newY = Math.sin(theta) * buf + Math.cos(theta) * newY;

    return [newX, newY, (object.angle - ego.angle) * Math.PI / 180];
  }

  getStateInGlobalSystem(state) {
    const x = state.x;
    const y = state.y;
    const ego = this.getObjectByName('Ego');
    const theta = ego.angle * Math.PI / 180 - 90 * Math.PI / 180;

    const buf = x;
    let newX = Math.cos(theta) * buf - Math.sin(theta) * y;
    let newY = Math.sin(theta) * buf + Math.cos(theta) * y;

    newX += ego.left;
    newY += ego.top;

    state.x = newX;
    state.y = newY;
    state.theta = (ego.angle - state.theta / Math.PI * 180);

    return state;
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
      model.reset();
    }
    view.getObjectPositionInUsk(target);
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
