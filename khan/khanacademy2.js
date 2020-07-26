  window.addEventListener('mousemove',e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  })
  setTimeout(function raf() {
    draw();
    if (_framerate == 60) {
      requestAnimationFrame(raf);
    } else {
      setTimeout(raf,1000/_framerate);
    }
  },100);

  window.addEventListener('click',e => {
    if (mouseClicked) {
      mouseClicked();
    }
  });
