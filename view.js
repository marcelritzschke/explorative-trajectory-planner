class View {
  constructor(canvas) {
    this._canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;
    this._shapes = [];
    this._fixedShapes = ['Grid', 'Ego', 'Goal'];

    this._canvas.on('object:added', this._objectAddedListener);
    this._canvas.on('object:modified', this.objectMovedListener);

    this._createGrid();
    this._constructEgoShape();
    this._constructGoal();
  }

  reset() {
    let end = this._shapes.length;
    for(let i=0; i<end; ++i) {
      let shape = this._shapes[i];
      if(shape.name != 'Grid' && shape.name != 'Ego' && shape.name != 'Goal') {
        //TODO use arrays find function and this._fixedShapes
        this._shapes.splice(i, 1);
        i--;
        end--;
      }
    }

    this.draw();
  }

  draw() {
    this._canvas.clear();

    this._shapes.forEach(item => {
      this._canvas.add(item.object);
    });
  }

  drawTrajectory(trajectory, color, size) {
    let trajGroup = new fabric.Group([], {
      left : this.getObjectByName('Ego').left,
      top : this.getObjectByName('Ego').top,
      angle : 0,
      selectable : false,
      evented : false
    });

    trajectory.states.forEach((state) => {
      let circle = new fabric.Circle({
        top : this.getObjectByName('Ego').top + state.y * 100,
        left : this.getObjectByName('Ego').left + state.x * 100,
        radius : size,
        fill : color,
        originX : 'center',
        originY : 'center',
      });

      trajGroup.addWithUpdate(circle);
    })

    this.addShape(new Shape('Trajectory', this.getNextId(), trajGroup));
  }

  getGoalPosition() {
    let goal = this.getObjectByName('Goal');
    return [goal.left, goal.top];
  }

  getEgoPosition() {
    let ego = this.getObjectByName('Ego');
    return [ego.left, ego.top];
  }

  drawLine(startX, startY, endX, endY, color) {
    let line = new fabric.Line([startX, startY, endX, endY], {
      stroke : color,
      selectable : false,
      evented : false,
      originX : 'center',
      originY : 'center'
    });

    this.updateShape(new Shape('Connection', this.getNextId(), line));
  }

  _constructGoal() {
    var circle = new fabric.Circle({
      top : this._height/ 2,
      left : this._width - 100,
      radius : 10,
      fill : 'blue',
      originX : 'center',
      originY : 'center'
    });

    this.addShape(new Shape('Goal', this.getNextId(), circle));
  } 

  _constructEgoShape() {
    var triangle = new fabric.Triangle({
      width : 16,
      height : 16,
      angle : 0,
      fill : 'green',
      originX : 'center',
      originY : 'center',
      top : 10
    });

    var rect = new fabric.Rect({
      width : 30,
      height : 50,
      fill : 'rgba(0,0,0,0)',
      stroke : 'green',
      originX : 'center',
      originY : 'center'
    });

    var group = new fabric.Group([ triangle, rect ], {
      left : 100,
      top : this._height/ 2,
      angle : 90,
      originX : 'center',
      originY : 'center'
    });

    this.addShape(new Shape('Ego', this.getNextId(), group));
  }

  _objectAddedListener(ev) {
    let target = ev.target;
    //console.log('left', target.left, 'top', target.top, 'width', target.width, 'height', target.height);
  }

  _createGrid() {
    let grid = new fabric.Group([], {
      selectable: false,
      evented: false,
      opacity: 0.25
    });

    let gridSize = 50;
    for (let i = 0; i < (this._width / gridSize); i++) {
      grid.addWithUpdate(new fabric.Line([ i * gridSize, 0, i * gridSize, this._height], { 
        type:'line', stroke: '#ccc'
      }));
      grid.addWithUpdate(new fabric.Line([ 0, i * gridSize, this._width, i * gridSize], { 
        type: 'line', stroke: '#ccc'
      }));
    }

    this.addShape(new Shape('Grid', this.getNextId(), grid));
  }

  updateShape(shape) {
    let match = this.getShapeByName(shape.name);

    if(match[0] == null) {
      this.addShape(shape);
    }
    else {
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
      if(item.name == name) {
        match = item;
        index = idx;
      }
    })
    return [match, index];
  }

  getObjectByName(name) {
    return this.getShapeByName(name)[0].object;
  }

  getLastId() {
    if(this._shapes.length == 0) {
      return 0;
    }
    else {
      return this._shapes[this._shapes.length - 1].id;
    }
  }

  getNextId() {
    return this.getLastId() + 1;
  }

  objectMovedListener(ev) {
    let target = ev.target;
    console.log('left', target.left, 'top', target.top, 'width', target.width * target.scaleX, 'height', target.height * target.scaleY);
    if(target == view.getObjectByName('Ego') || target == view.getObjectByName('Goal')) {
      view.reset();
    }
  }
}

function initializeView() {
  var elem = document.querySelector('.canvas');
  var style = getComputedStyle(elem);
  
  view = new View(new fabric.Canvas('mainView', {
    width: parseFloat(style.width),
    height: parseFloat(style.height)
  }));
}

let view;