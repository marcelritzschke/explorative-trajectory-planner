const viewjs = require('./view/view');
const modeljs = require('./model/model');
const controllerjs = require('./controller/controller');

// eslint-disable-next-line no-unused-vars
window.initializeView = function() {
  const elem = document.querySelector('.canvas');
  const style = getComputedStyle(elem);

  view = new viewjs.View(new fabric.Canvas('mainView', {
    width: parseFloat(style.width),
    height: parseFloat(style.height),
    renderOnAddRemove: false,
  }));
};
let view;

// eslint-disable-next-line no-unused-vars
window.initializeModel = function() {
  model = new modeljs.Model(view);
};
let model;

// eslint-disable-next-line no-unused-vars
window.initializeController = function() {
  controller = new controllerjs.Controller(model);
};
let controller;

// eslint-disable-next-line no-unused-vars
window.getController = function() {
  return controller;
};
