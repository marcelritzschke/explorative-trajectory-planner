class View {
    constructor(canvas) {
        this._canvas = canvas;
        this._width = canvas.width;
        this._height = canvas.height;
    }

    drawRectangle(top, left, width, height, color) {
        let canvas = this._canvas;
        
        var rect = new fabric.Rect({
            top : top,
            left : left,
            width : width,
            height : height,
            fill : color
        });

        canvas.add(rect);
    } 

    drawEgoShape() {

    }
}

function initializeView() {
    var elem = document.querySelector('.canvas');
    var style = getComputedStyle(elem);
    
    view = new View(new fabric.Canvas('mainView', {
        width: parseFloat(style.width),
        height: parseFloat(style.height)
    }));

    view.drawRectangle(10, 10, 50, 50, 'red');
}

let view;