class Model {
    constructor(view) {
        this._view = view;
    }

    connectToGoalEuclidian() {
        var xGoal = this._view.getGoalPosition()[0];
        var yGoal = this._view.getGoalPosition()[1];
        var xEgo = this._view.getEgoPosition()[0];
        var yEgo = this._view.getEgoPosition()[1];

        this._view.drawLine(xGoal, yGoal, xEgo, yEgo);
    }
}

function initializeModel() {
    model = new Model(view);
}

let model;