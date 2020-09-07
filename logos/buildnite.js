const font = "Russo One";

function drawIt() {
  stroke(255, 255, 255);
  fill(255, 255, 255);
  setFont(font);
  strokeWeight(5);

  let ts = 400;
  let done = false;
  do {
    textSize(ts);
    if (measureTextWidth("BUILDNITE") > (canvasWidth - 100)) {
      ts--;
    } else {
      done = true;
    }
  } while (!done);
  println(`Text size selected: ${ts}`);

  const x = 30;
  const y = 400;
  let curX = x;

  function drawOne(letter, speed) {
    const s = speed !== undefined ? speed : 0.5;
    drawText(letter, curX, y, s, false);
    while (letter.length) {
      curX += measureTextWidth(letter.slice(0, 1), true);
      letter = letter.substring(1);
    }
  }

  let timeline = [{
      func: () => {
        // Starting scale and location (off screen)
        setCameraScale(5);
        setCameraLocation(0, -2000);
        drawOne('B', 4.5);
      },
      after: 400
    },
    // Start drawing the U, really early
    { func: () => drawOne('U', 4.5), after: 500 },
    {
      func: () => {
        // Move to view the 'B', after it starts.
        setCameraScale(8);
        setCameraLocation(30, 330);
        setCameraLocation(177, 330, 2.7);
        setCameraScale(1, 4);
      },
      after: 2700
    },
    {
      func: () => {
        // Move to view the 'U', after it starts.
        setCameraLocation(177, 330);
      },
      after: 200
    },
    // Start drawing the 'I'.
    { func: () => drawOne('I', 3), after: 1700 },
    {
      func: () => {
        // Move to view the top of the 'I'.
        setCameraLocation(300, 240);
      },
      after: 5000
    },
    { func: () => drawOne('LDNIT', 0.001), after: 500 },
    { func: () => drawOne('E'), after: 1000 },
  ];

  function popone() {
    if (timeline.length) {
      const item = timeline.shift();
      item.func();
      setTimeout(popone, item.after);
    }
  }
  popone();
}









background(0, 0, 0);
stroke(255, 255, 255);
fill(255, 255, 255);
textSize(100);
text('Loading...', 30, 350);

function gotFps() {
  WebFont.load({
    google: {
      families: [font + ':300,400,700']
    },
    active: function() {
      background(0, 0, 0);
      setTimeout(drawIt, 1000);
    }
  });
}