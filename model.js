class Model {
  constructor(view) {
    this._view = view;
    this._explorer = new Explorer();
  }

  explore() {
    let layer = this._explorer.explore();
    
    if(layer !== null) {
      layer.forEach(trajectory => {
        this._view.drawTrajectory(trajectory, 'black', 1);
      })
    }
    else {
      //prototype
      let trajectory = [];
      let state = new State();
      for(let i=0; i<31; ++i) {
        let newState = Object.assign({}, state);
        state.x += 0.2;
        trajectory.push(newState);
      }
      this._view.drawTrajectory(trajectory, 'green', 3);
      this._view.drawLine(this._view.getEgoPosition()[0]
      , this._view.getEgoPosition()[1]
      , this._view.getEgoPosition()[0] + 600
      , this._view.getEgoPosition()[1]
      , 'green'
      )

      //prototype
    }
  }

  connectToGoalEuclidian() {
    var xGoal = this._view.getGoalPosition()[0];
    var yGoal = this._view.getGoalPosition()[1];
    var xEgo = this._view.getEgoPosition()[0];
    var yEgo = this._view.getEgoPosition()[1];

    this._view.drawLine(xGoal, yGoal, xEgo, yEgo, 'black');
  }
}

function initializeModel() {
  model = new Model(view);
}

let model;