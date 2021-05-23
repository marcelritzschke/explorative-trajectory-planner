function objectAddedListener(ev) {
  // const target = ev.target;
  // console.log('left', target.left, 'top', target.top,
  //    'width', target.width, 'height', target.height);
}
module.exports.objectAddedListener = objectAddedListener;

function objectMovedListener(ev) {
  const target = ev.target;
  console.log('left', target.left, 'top', target.top, 'width',
      target.width * target.scaleX, 'height', target.height * target.scaleY,
      'orientation', target.angle);
  view.objectMovedUpdate(target);
}
module.exports.objectMovedListener = objectMovedListener;

function mouseWheelListener(opt) {
  const evt = opt.e;
  if (evt.altKey === true) {
    const delta = opt.e.deltaY;
    let zoom = view._canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    view._canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  }
}
module.exports.mouseWheelListener = mouseWheelListener;

function mouseDownListener(opt) {
  const evt = opt.e;
  if (evt.altKey === true) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
}
module.exports.mouseDownListener = mouseDownListener;

function mouseMoveListener(opt) {
  if (this.isDragging) {
    const e = opt.e;
    const vpt = this.viewportTransform;
    vpt[4] += e.clientX - this.lastPosX;
    vpt[5] += e.clientY - this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
}
module.exports.mouseMoveListener = mouseMoveListener;

function mouseUpListener() {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
}
module.exports.mouseUpListener = mouseUpListener;
