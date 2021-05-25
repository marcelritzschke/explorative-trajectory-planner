const Utils = {
  transformObjectToUsk(ego, object) {
    const buf = Object.assign({}, object);
    const x = buf.x;
    const y = buf.y;
    const angle = ego.angle - 90 * Math.PI / 180;

    let newX = x - ego.x;
    let newY = y - ego.y;
    newY *= -1;

    const res = this.rotatePoint(newX, newY, angle);
    newX = res[0];
    newY = res[1];

    buf.x = newX;
    buf.y = newY;
    buf.angle = buf.angle - ego.angle;

    return buf;
  },

  getStateInGlobalSystem(ego, state) {
    const buf = Object.assign({}, state);
    const x = buf.x;
    const y = -buf.y;
    const angle = ego.angle - 90 * Math.PI / 180;

    const res = this.rotatePoint(x, y, angle);
    let newX = res[0];
    let newY = res[1];

    newX += ego.x;
    newY += ego.y;

    buf.x = newX;
    buf.y = newY;
    buf.angle = (ego.angle - buf.angle);

    return buf;
  },

  rotatePoint(x, y, angle) {
    const buf = x;
    const newX = Math.cos(angle) * buf - Math.sin(angle) * y;
    const newY = Math.sin(angle) * buf + Math.cos(angle) * y;

    return [newX, newY];
  },

  convertToPixels(scale, object) {
    const buf = Object.assign({}, object);
    buf.x *= scale;
    buf.y *= scale;
    buf.angle *= 180 / Math.PI;

    if (Reflect.has(buf, 'width')) {
      buf.width *= scale;
    }
    if (Reflect.has(buf, 'height')) {
      buf.height *= scale;
    }

    return buf;
  },

  convertToMetric(scale, object) {
    const buf = Object.assign({}, object);
    buf.x /= scale;
    buf.y /= scale;
    buf.angle *= Math.PI / 180;

    if (Reflect.has(buf, 'width')) {
      buf.width /= scale;
    }
    if (Reflect.has(buf, 'height')) {
      buf.height /= scale;
    }

    return buf;
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
