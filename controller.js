class Controller {
    constructor(model) {
        this._model = model;
    }

    connect() {
        this._model.connectToGoalEuclidian();
    }
}

function initializeController() {
    controller = new Controller(model);
}

let controller;