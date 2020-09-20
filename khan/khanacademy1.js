var width = 600;
var height = 600;
if (typeof canvasWidth !== "undefined" && typeof canvasHeight !== "undefined") {
  width = canvasWidth;
  height = canvasHeight;
}

// See if we've enabled camera pan/zoom
var cameraEnabled = typeof enableCamera !== "undefined" && enableCamera;

var mouseX = 0;
var mouseY = 0;

const canvasElement = document.createElement('canvas');
canvasElement.width = width;
canvasElement.height = height;
canvasElement.style.width = width;
canvasElement.style.height = height;
canvasElement.style.border = "1px solid black";
document.body.appendChild(canvasElement);
const ctxScreen = canvasElement.getContext("2d");
const _canvasScale = cameraEnabled ? 10 : 1; // Draw things this much larger
const offscreenCanvas = new OffscreenCanvas(width * _canvasScale, height * _canvasScale);
const ctx = cameraEnabled ? offscreenCanvas.getContext("2d") : ctxScreen;
var _cameraX = 0;
var _cameraY = 0;
var _cameraScale = 1;
var _cameraLocTransitionLast = 0;
var _cameraLocTransitionEnd;
var _cameraLocTransitionX;
var _cameraLocTransitionY;
var _cameraScaleTransitionLast = 0;
var _cameraScaleTransitionEnd;
var _cameraScalePerMs;
if (cameraEnabled) {
  requestAnimationFrame(function copyCanvas() {
    // Handle location transitions
    if (_cameraLocTransitionLast) {
      const now = millis();
      if (now > _cameraLocTransitionEnd) {
        _cameraLocTransitionLast = 0;
      } else {
        const elapsedMs = now - _cameraLocTransitionLast;
        _cameraLocTransitionLast = now;
        _cameraX += _cameraLocXPerMs * elapsedMs;
        _cameraY += _cameraLocYPerMs * elapsedMs;
      }
    }
    // Handle scale transitions
    if (_cameraScaleTransitionLast) {
      const now = millis();
      if (now > _cameraScaleTransitionEnd) {
        _cameraScaleTransitionLast = 0;
      } else {
        const elapsedMs = now - _cameraScaleTransitionLast;
        _cameraScaleTransitionLast = now;
        _cameraScale += _cameraScalePerMs * elapsedMs;
      }
    }
    ctxScreen.fillStyle = 'black';
    ctxScreen.rect(0, 0, width, height);
    ctxScreen.fill();
    ctxScreen.drawImage(offscreenCanvas, _cameraX, _cameraY, width * _canvasScale / _cameraScale, height * _canvasScale / _cameraScale, 0, 0, width, height);
    //  println(`Painting ${_cameraX},${_cameraY} ${width * _canvasScale / _cameraScale}x${height * _canvasScale / _cameraScale} to 0,0 ${width}x${height}`);
    requestAnimationFrame(copyCanvas);
  });
}

function setCameraLocation(x, y, transitionSeconds) {
  console.assert(cameraEnabled, 'To set the camera location, you must set enableCamera to true');
  const newX = x * _canvasScale;
  const newY = y * _canvasScale;
  if (transitionSeconds) {
    _cameraLocTransitionLast = millis();
    _cameraLocTransitionEnd = _cameraLocTransitionLast + transitionSeconds * 1000;
    _cameraLocXPerMs = (newX - _cameraX) / transitionSeconds / 1000;
    _cameraLocYPerMs = (newY - _cameraY) / transitionSeconds / 1000;
  } else {
    _cameraLocTransitionLast = 0;
    _cameraX = newX;
    _cameraY = newY;
  }
}

function setCameraScale(s, transitionSeconds) {
  console.assert(cameraEnabled, 'To set the camera location, you must set enableCamera to true');
  if (transitionSeconds) {
    _cameraScaleTransitionLast = millis();
    _cameraScaleTransitionEnd = _cameraScaleTransitionLast + transitionSeconds * 1000;
    _cameraScalePerMs = (s - _cameraScale) / transitionSeconds / 1000;
  } else {
    _cameraScaleTransitionLast = 0;
    _cameraScale = s;
  }
}

function background(r, g, b) {
  fill(r, g, b);
  rect(0, 0, width * _canvasScale, height * _canvasScale);
}

function noStroke() {
  ctx.strokeStyle = "rgba(1, 1, 1, 0)";
}

function stroke(r, g, b) {
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
}

function lineDash(dash) {
  ctx.setLineDash(dash);
}

function strokeWeight(n) {
  ctx.lineWidth = n * _canvasScale;
}

function fill(r, g, b) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
}

function noFill() {
  ctx.fillStyle = "rgba(1, 1, 1, 0)";
}

function mod(x, n) {
  return ((x % n) + n) % n;
};

function arc(x, y, w, h, cs, cst) {
  const startAngle = mod(cs * Math.PI / 180, 360);
  const endAngle = mod(cst * Math.PI / 180, 360);
  ctx.beginPath();
  ctx.ellipse(x * _canvasScale, y * _canvasScale, w / 2 * _canvasScale, h / 2 * _canvasScale, 0, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle));
  ctx.fill();
  ctx.stroke();
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1 * _canvasScale, y1 * _canvasScale);
  ctx.lineTo(x2 * _canvasScale, y2 * _canvasScale);
  ctx.stroke();
}

function rect(x, y, width, height, radius) {
  if (typeof radius === "undefined") {
    radius = 0;
  }
  width *= _canvasScale;
  height *= _canvasScale;
  radius *= _canvasScale;
  x *= _canvasScale;
  y *= _canvasScale;
  let minDim = Math.min(width, height);
  radius = Math.min(radius, minDim / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function tan(deg) {
  return Math.tan(deg * Math.PI / 180);
}

function cos(deg) {
  return Math.cos(deg * Math.PI / 180);
}

function sin(deg) {
  return Math.sin(deg * Math.PI / 180);
}

function sqrt(x) {
  return Math.sqrt(x);
}

function ellipse(x, y, w, h) {
  arc(x, y, w, h, 0, 360);
}
var _lineheight = 15 * _canvasScale;
var _font = 'Arial';

function _setTheFont() {
  ctx.font = `${_lineheight}px ${_font}`;
}

function setFont(name) {
  _font = name;
  _setTheFont();
}

function textSize(s) {
  _lineheight = s * _canvasScale;
  _setTheFont();
}

function text(txt, x, y) {
  let lines = txt.toString().split('\n');
  for (var i = 0; i < lines.length; i++)
    ctx.fillText(lines[i], x * _canvasScale, y * _canvasScale + (i * _lineheight));
}

function estimateOutlineLength(letter) {
  const metrics = ctx.measureText(letter);
  return (metrics.width + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * 3;
}

function speedForDashlen(dashLen, secondsPerLetter) {
  const fps = FPS || 60;
  return dashLen / secondsPerLetter / fps;
}

function measureTextWidth(txt, includeSpace) {
  return (ctx.measureText(txt).width + (includeSpace ? ctx.lineWidth : 0)) / _canvasScale;
}

function drawText(txt, xIn, yIn, secondsPerLetter, fillLetters) {
  let x = xIn * _canvasScale;
  const y = yIn * _canvasScale;
  //  println(`Drawing "${txt}" in ${secondsPerLetter}s...`)
  let dashLen = estimateOutlineLength(txt[0]);
  let speed = speedForDashlen(dashLen, secondsPerLetter);
  let dashOffset = dashLen;
  ctx.lineJoin = "round";
  ctx.globalAlpha = 2 / 3;

  let i = 0;

  function loop() {
    lineDash([dashLen - dashOffset, Math.max(0, dashOffset - speed)]); // create a long dash mask
    dashOffset -= speed; // reduce dash length
    ctx.strokeText(txt[i], x, y); // stroke letter

    if ((dashOffset + speed) > 0) {
      requestAnimationFrame(loop); // animate
    } else {
      if (fillLetters) {
        ctx.fillText(txt[i], x, y); // fill final letter
      }
      x += measureTextWidth(txt[i], true) * _canvasScale;
      i++; // prep next char
      dashLen = estimateOutlineLength(txt[i]);
      speed = speedForDashlen(dashLen, secondsPerLetter);
      dashOffset = dashLen;
      if (i < txt.length)
        requestAnimationFrame(loop);
    }
  };
  requestAnimationFrame(loop); // animate
}

function println(t) {
  console.log(t);
}

function pushMatrix() {
  ctx.save();
}

function popMatrix() {
  ctx.restore();
}

function translate(x, y) {
  ctx.translate(x, y);
}

function rotate(deg) {
  // Degrees
  ctx.rotate(deg * Math.PI / 180);
}

function scale(amt) {
  // Degrees
  ctx.scale(amt, amt);
}

function triangle(x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1 * _canvasScale, y1 * _canvasScale);
  ctx.lineTo(x2 * _canvasScale, y2 * _canvasScale);
  ctx.lineTo(x3 * _canvasScale, y3 * _canvasScale);
  ctx.fill();
}

function textAlign(leftRight, topBottom) {
  ctx.textAlign = leftRight;
  ctx.textBaseline = topBottom;
}
const CENTER = "center";
const LEFT = "left";
const RIGHT = "right";
const TOP = "top";
const BOTTOM = "bottom";

const startTime = (new Date()).getTime();

function millis() {
  return (new Date()).getTime() - startTime;
}

function abs(x) {
  return Math.abs(x);
}
var _framerate = 60;

function framerate(n) {
  _framerate = n;
}