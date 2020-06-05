  window.addEventListener('mousemove',e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  })
  // Full speed (usually too fast):
  // requestAnimationFrame(function raf() {
  //   draw();
  //   requestAnimationFrame(raf);
  // });
  setTimeout(function raf() {
    draw();
    setTimeout(raf,100);
  },100);

  window.addEventListener('click',e => {
    if (mouseClicked) {
      mouseClicked();
    }
  });
