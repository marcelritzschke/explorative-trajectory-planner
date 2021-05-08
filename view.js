class View {
    constructor(canvas) {
        this._canvas = canvas;
        this._width = canvas.width;
        this._height = canvas.height;
        this._shapes = new Map();

        this._canvas.on('object:added', this._objectAddedListener);
        this._canvas.on('object:modified', this._objectMovedListener);

        this._constructEgoShape();
        this._constructGoal();
    }

    draw() {
        this._canvas.clear();

        this._shapes.forEach((item) => {
            this._canvas.add(item);
        });
    }

    getGoalPosition() {
        var goal = this._shapes.get('Goal');
        return [goal.left, goal.top];
    }

    getEgoPosition() {
        var ego = this._shapes.get('Ego');
        return [ego.left, ego.top];
    }

    drawLine(startX, startY, endX, endY) {
        var line = new fabric.Line([startX, startY, endX, endY], {
            stroke : 'black',
            selectable : false,
            evented : false
        });

        this._shapes.set('Connection', line);
        this.draw();
    }

    _constructGoal() {
        var circle = new fabric.Circle({
            top : 80 + 15,
            left : this._width - 25,
            radius : 15,
            fill : 'blue',
            originX : 'center',
            originY : 'center'
        });

        this._shapes.set('Goal', circle);
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
            left : this._width - 25,
            top : 10 + 25,
            originX : 'center',
            originY : 'center'
        });

        this._shapes.set('Ego', group);
    }

    _objectAddedListener(ev) {
        let target = ev.target;
        console.log('left', target.left, 'top', target.top, 'width', target.width, 'height', target.height);
      }

    _objectMovedListener(ev) {
        let target = ev.target;
        console.log('left', target.left, 'top', target.top, 'width', target.width * target.scaleX, 'height', target.height * target.scaleY);
      }
}

function initializeView() {
    var elem = document.querySelector('.canvas');
    var style = getComputedStyle(elem);
    
    view = new View(new fabric.Canvas('mainView', {
        width: parseFloat(style.width),
        height: parseFloat(style.height)
    }));

    view.draw();
}

let view;