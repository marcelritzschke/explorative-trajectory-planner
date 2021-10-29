const Builder = require('./builder/builder').Builder;

window.initialize = function() {
  const elem = document.querySelector('.canvas');
  const style = getComputedStyle(elem);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  const scale = 20; // pixel per meter

  canvas = new fabric.Canvas('mainView', {
    width: width,
    height: height,
    renderOnAddRemove: false,
    selection: false,
  });

  builder = new Builder(canvas, scale);
  builder.build();
};
let canvas;
let builder;

// eslint-disable-next-line no-unused-vars
window.getCanvas = function() {
  return canvas;
};

// eslint-disable-next-line no-unused-vars
window.getView = function() {
  return builder.getView();
};

// eslint-disable-next-line no-unused-vars
window.getModel = function() {
  return builder.getModel();
};

// eslint-disable-next-line no-unused-vars
window.getController = function() {
  return builder.getController();
};
