class Controller {
    constructor(model) {
        this._model = model;
    }

    connect() {
        this._model.connectToGoalEuclidian();
    }

    step() {
        this._model.explore();
    }
}

function initializeController() {
    controller = new Controller(model);
}

let controller;