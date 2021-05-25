let canObstacleBePlaced = true;
let isPlaceObstacleEnabled = false;

const Listener = {
  mouseDownListener(evt) {
    isPlaceObstacleEnabled = true;
    if (canObstacleBePlaced) {
      const pointer = getCanvas().getPointer(evt.e);
      getModel().toggleObstacle(pointer.x, pointer.y);
    }
  },

  mouseUpListener() {
    isPlaceObstacleEnabled = false;
  },

  mouseMovedListener(evt) {
    if (canObstacleBePlaced && isPlaceObstacleEnabled) {
      const pointer = getCanvas().getPointer(evt.e);
      getModel().setObstacle(pointer.x, pointer.y);
    }
  },

  objectMovedListener(ev) {
    const target = ev.target;
    if (getView().getListOfShapesByName('Ego')[0].fabricObject == target) {
      getModel().setEgo(target.left, target.top, target.angle);
      getController().reset();
    } else
    if (getView().getListOfShapesByName('Goal')[0].fabricObject == target) {
      getModel().setGoal(target.left, target.top, target.angle);
    }
    getView().disableSelection();
  },

  objectMouseMoveListener() {
    canObstacleBePlaced = false;
  },

  objectMouseOutListener() {
    canObstacleBePlaced = true;
  },
};
module.exports.Listener = Listener;
