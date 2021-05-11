class Controller {
  constructor(model) {
    this._model = model;
  }

  step() {
    this._model.explore();
  }
}

// eslint-disable-next-line no-unused-vars
function initializeController() {
  controller = new Controller(model);
}

// eslint-disable-next-line no-unused-vars
let controller;
