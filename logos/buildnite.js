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
      },
      after: 2400
    },
    {
      func: () => {
        // Move to view the 'U', after it starts.
        setCameraLocation(177, 330, 0.2);
      },
      after: 200
    },
    // Start drawing the 'I'.
    { func: () => drawOne('I', 3), after: 1700 },
    {
      func: () => {
        // Move to view the top of the 'I'.
        setCameraLocation(300, 240, 0.2);
      },
      after: 1000
    },
    {
      func: () => {
        // Start panning to end location.
        setCameraLocation(1050, 320, 7.5);
        setCameraScale(6, 4);
        //setCameraLocation(0, 0, 0);
        //setCameraScale(1, 0);

        //draw letters faster
        drawOne('LDNIT', 3 / 5);
      },
      after: 5000
    },
    {
      func: () => {

        drawOne('E', 1);
      },
      after: 3500
    },
    {
      func: () => {
        // Zoom and pan back out to see the whole thing.
        setCameraLocation(0, 0, 2);
        setCameraScale(1, 2);
      },
      after: 2000
    },
    {
      func: () => {
        // Set exact scale and location.
        setCameraLocation(0, 0);
        setCameraScale(1);
      },
      after: 0
    },
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