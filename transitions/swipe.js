const font = "Russo One";

function setSizes() {
  background(0, 255, 0);
  stroke(255, 255, 255);
  fill(255, 255, 255);
  setFont(font);
  strokeWeight(5);
  textSize(100);
  textAlign(CENTER, CENTER);
}

function drawIt() {
  setSizes();
  textSize(195);

  setCameraLocation(-400, 200);
  setCameraScale(1);
  rect(50, 300, 800, 300);
  text('BUILDNITE', 200, 400, true);

  //setCameraLocation(0, 200, 2.5);

  // setTimeout(() => {
  //   setCameraLocation(-400, -1000, 2.5);
  //   setCameraScale(0.5, 2)
  // }, 2500);
}


setSizes();
text('Loading...', 300, 350);

function gotFps() {
  WebFont.load({
    google: {
      families: [font + ':300,400,700']
    },
    active: function() {
      background(0, 255, 0);
      setTimeout(drawIt, 1000);
    }
  });
}