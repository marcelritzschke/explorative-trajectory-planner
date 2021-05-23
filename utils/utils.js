const Utils = {
  transformObjectToUsk(ego, object) {
    const x = object.x;
    const y = object.y;
    const angle = ego.angle * Math.PI / 180 - 90 * Math.PI / 180;

    let newX = x - ego.left;
    let newY = y - ego.top;
    newY *= -1;

    const res = this.rotatePoint(newX, newY, angle);
    newX = res[0];
    newY = res[1];

    object.x = newX;
    object.y = newY;
    object.angle = (object.angle - ego.angle) * Math.PI / 180;

    return object;
  },

  getStateInGlobalSystem(ego, state) {
    const x = state.x;
    const y = -state.y;
    const angle = ego.angle * Math.PI / 180 - 90 * Math.PI / 180;

    const res = this.rotatePoint(x, y, angle);
    let newX = res[0];
    let newY = res[1];

    newX += ego.x;
    newY += ego.y;

    state.x = newX;
    state.y = newY;
    state.angle = (ego.angle - state.angle / Math.PI * 180);

    return state;
  },

  rotatePoint(x, y, angle) {
    const buf = x;
    const newX = Math.cos(angle) * buf - Math.sin(angle) * y;
    const newY = Math.sin(angle) * buf + Math.cos(angle) * y;

    return [newX, newY];
  },

  updateDiagonalsRectangle(rect) {
    const angleBuf = rect.angle;
    const xBuf = rect.left;
    const yBuf = rect.top;

    const newRect = new fabric.Rect({
      left: rect.left,
      top: rect.top,
      width: (rect.width - 2) * rect.scaleX,
      height: (rect.height - 2) * rect.scaleY,
      angle: 0,
      fill: 'rgb(0,0,0,.2)',
      originX: 'center',
      originY: 'center',
      stroke: 'black',
      strokeWidth: 2,
    });

    const lines = this.getDiagonalsOfRectangle(newRect);
    const group = new fabric.Group(lines, {
      left: rect.left,
      top: rect.top,
      originX: 'center',
      originY: 'center',
    });
    group.addWithUpdate(newRect);

    rect.forEachObject((obj) => {
      rect.remove(obj);
    });
    group.forEachObject((obj) => {
      rect.addWithUpdate(obj);
    });

    rect.angle = angleBuf;
    rect.left = xBuf;
    rect.top = yBuf;
  },

  getDiagonalsOfRectangle(rect, gap = 10) {
    const width = rect.width * rect.scaleX;
    const height = rect.height * rect.scaleY;

    const lines = [];
    const lengthToGo = (width + height)/ Math.sin(45 * Math.PI / 180);
    for (let i=0; i<lengthToGo/ gap; i++) {
      const dist = i * gap * Math.sin(45 * Math.PI / 180);

      let startX;
      if (dist < width) {
        startX = dist;
      } else {
        startX = width;
      }
      let startY;
      if (dist < width) {
        startY = 0;
      } else if (dist > width + height) {
        startY = height;
      } else {
        startY = dist - width;
      }

      let endX;
      if (dist < height) {
        endX = 0;
      } else if (dist > width + height) {
        endX = width;
      } else {
        endX = dist - height;
      }
      let endY;
      if (dist < height) {
        endY = dist;
      } else {
        endY = height;
      }

      const start = this.rotatePoint(startX - width/ 2, startY - height / 2,
          rect.angle * Math.PI/ 180);
      const end = this.rotatePoint(endX - width / 2, endY - height/ 2,
          rect.angle * Math.PI/ 180);

      const line = new fabric.Line([
        start[0],
        start[1],
        end[0],
        end[1]],
      {type: 'line', stroke: 'lightgrey'});

      lines.push(line);
    }

    return lines;
  },

  convertToPixels(scale, object) {
    object.x *= scale;
    object.y *= scale;

    if (Reflect.has(object, 'width')) {
      object.width *= scale;
    }
    if (Reflect.has(object, 'height')) {
      object.height *= scale;
    }

    return object;
  },

  convertToMetric(scale, object) {
    object.x /= scale;
    object.y /= scale;

    if (Reflect.has(object, 'width')) {
      object.width /= scale;
    }
    if (Reflect.has(object, 'height')) {
      object.height /= scale;
    }

    return object;
  },

  convertTimerToString(timer) {
    let milli = Math.round((timer - Math.floor(timer)) * 1e3);
    milli = (parseInt(milli) % 1000).toLocaleString('en-US', {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });

    const seconds = (parseInt(timer) % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    const minutes = (parseInt(timer/ 60) % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    return minutes + ':' + seconds + ':' + milli;
  },
};
module.exports.Utils = Utils;
