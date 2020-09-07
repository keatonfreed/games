function _calcFPS(a) {
  function b() {
    if (f--) c(b);
    else {
      var e = 3 * Math.round(1E3 * d / 3 / (performance.now() - g));
      "function" === typeof a.callback && a.callback(e);
    }
  }
  var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  if (!c) return !0;
  a || (a = {});
  var d = a.count || 60,
    f = d,
    g = performance.now();
  b()
}
var FPS = 60;
err = _calcFPS({
  count: 120,
  callback: fps => {
    FPS = fps;
    console.log(`Detected ${FPS} fps`);
    if (typeof gotFps !== 'undefined') {
      gotFps();
    }
  }
});

window.addEventListener('mousemove', e => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
})
if (typeof draw !== 'undefined') {
  setTimeout(function raf() {
    draw();
    if (Math.abs(_framerate - FPS) < 5) {
      requestAnimationFrame(raf);
    } else {
      setTimeout(raf, 1000 / _framerate);
    }
  }, 100);
} else {
  console.log('Warning: no draw() method provided');
}

window.addEventListener('click', e => {
  if (mouseClicked) {
    mouseClicked();
  }
});