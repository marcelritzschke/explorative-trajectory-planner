const View = require('./view/view').View;
const Model = require('./model/model').Model;
const Controller = require('./controller/controller').Controller;

window.initialize = function() {
  const elem = document.querySelector('.canvas');
  const style = getComputedStyle(elem);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);

  canvas = new fabric.Canvas('mainView', {
    width: width,
    height: height,
    renderOnAddRemove: false,
    selection: false,
  });

  initializeView(canvas);
  initializeModel(width, height);
  initializeController();
};
let canvas;

initializeView = function(canvas) {
  view = new View(canvas);
};
let view;

initializeModel = function(width, height) {
  model = new Model(view, width, height);
};
let model;

initializeController = function() {
  controller = new Controller(model);
};
let controller;

// eslint-disable-next-line no-unused-vars
window.getCanvas = function() {
  return canvas;
};

// eslint-disable-next-line no-unused-vars
window.getView = function() {
  return view;
};

// eslint-disable-next-line no-unused-vars
window.getModel = function() {
  return model;
};

// eslint-disable-next-line no-unused-vars
window.getController = function() {
  return controller;
};
