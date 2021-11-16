const Builder = require('./builder/builder').Builder;

window.initialize = function() {
  const elem = document.querySelector('.canvas');
  const style = getComputedStyle(elem);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  const scale = getScale(width, height);

  canvas = new fabric.Canvas('mainView', {
    width: width,
    height: height,
    renderOnAddRemove: false,
    selection: false,
  });

  builder = new Builder(canvas, scale);
  builder.build();
};
let canvas;
let builder;

/**
 * Calculating the screen size from pixel into metric system.
 * Up to FHD dimension (1920x1080) the scale will be 20. Exceeding those
 * dimensions it will be downscaled, that the number of grid cells remains
 * constant. This is done to reduce load on the processor originated from
 * the canvas library. It will also keep the space where the planning happens
 * small.
 * @param {float} width Screen width in pixel
 * @param {float} height Screen height in pixel
 * @return {float} Scale in pixel per meter
 */
function getScale(width, height) {
  let scale = 20;
  if (width * height > 1920 * 1080) {
    scale = Math.sqrt(400 * width * height/ (1920 * 1080));
  }
  return scale;
}

// eslint-disable-next-line no-unused-vars
window.getCanvas = function() {
  return canvas;
};

// eslint-disable-next-line no-unused-vars
window.getView = function() {
  return builder.getView();
};

// eslint-disable-next-line no-unused-vars
window.getModel = function() {
  return builder.getModel();
};

// eslint-disable-next-line no-unused-vars
window.getController = function() {
  return builder.getController();
};
