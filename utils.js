// eslint-disable-next-line no-unused-vars
const Utils = {
  getObjectPositionInUsk(ego, object) {
    const x = object.left;
    const y = object.top;
    const theta = ego.angle * Math.PI / 180 - 90 * Math.PI / 180;

    let newX = x - ego.left;
    let newY = y - ego.top;
    newY *= -1;

    const buf = newX;
    newX = Math.cos(theta) * newX - Math.sin(theta) * newY;
    newY = Math.sin(theta) * buf + Math.cos(theta) * newY;

    return [newX, newY, (object.angle - ego.angle) * Math.PI / 180];
  },

  getStateInGlobalSystem(ego, state) {
    const x = state.x;
    const y = -state.y;
    const theta = ego.angle * Math.PI / 180 - 90 * Math.PI / 180;

    const buf = x;
    let newX = Math.cos(theta) * buf - Math.sin(theta) * y;
    let newY = Math.sin(theta) * buf + Math.cos(theta) * y;

    newX += ego.left;
    newY += ego.top;

    state.x = newX;
    state.y = newY;
    state.theta = (ego.angle - state.theta / Math.PI * 180);

    return state;
  },

  fillRectangleWithDiagonals: function(rect, gap = 10) {
    const group = new fabric.Group([rect], {
      left: rect.left,
      top: rect.top,
      angle: 0,
      originX: 'center',
      originY: 'center',
    });

    const lengthToGo = group.left + group.top;
    for (let i=0; i<lengthToGo/ gap; i++) {
      const dist = i * gap * Math.sin(45 * Math.PI / 180);

      let startX;
      if (dist < rect.width) {
        startX = dist;
      } else {
        startX = rect.width;
      }
      let startY;
      if (dist < rect.width) {
        startY = 0;
      } else if (dist > rect.width + rect.height) {
        startY = rect.height;
      } else {
        startY = dist - rect.width;
      }

      let endX;
      if (dist < rect.height) {
        endX = 0;
      } else if (dist > rect.width + rect.height) {
        endX = rect.width;
      } else {
        endX = dist - rect.height;
      }
      let endY;
      if (dist < rect.height) {
        endY = dist;
      } else {
        endY = rect.height;
      }

      const line = new fabric.Line([
        startX + group.left - rect.width / 2,
        startY + group.top - rect.height/ 2,
        endX + group.left - rect.width / 2,
        endY + group.top - rect.height/ 2],
      {type: 'line', stroke: 'black'});
      group.addWithUpdate(line);
    }

    return group;
  },
};
