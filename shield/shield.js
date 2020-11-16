class Map {
  #map = 0;
  constructor() {
    this.#map = [];
  }
  // Types:
  //  0: invalid
  //  1: player
  //  2: battery
  //  3: star
  addObject(type, x, y) {
    this.#map.push({ x: x, y: y, type: type });
  }
  addRandomObjects(n, type, x, y, w, h) {
    for (let i = 0; i < n; i++) {
      this.addObject(type, Math.random() * w + x - w / 2, Math.random() * h + y - h / 2);
    }
  }
  getObjectsInZone(x, y, w, h) {
    const x1 = x - w / 2;
    const x2 = x + w / 2;
    const y1 = y - h / 2;
    const y2 = y + h / 2;
    return this.#map.filter(p => { return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2 });
  }
}

const map = new Map();
map.addRandomObjects(4000, 2, 0, 0, width * 20, height * 20);
map.addRandomObjects(10000, 3, 0, 0, width * 20, height * 20);

let playerSize = 20;
let shieldSize = 200;

function draw() {
  background(0, 0, 0);
  drawMapZone();
  drawPlayer();
  drawShield();
  movePlayer();

  fill(255, 255, 255);
  textSize(20);
  text(`${x}, ${y}`, width - 100, 20);
}

let x = 0;
let y = 0;
let xSpeed = 0;
let ySpeed = 0;

function convertToScreenCoords(pt) {
  return { x: pt.x - x + width / 2, y: pt.y - y + height / 2 };
}

function drawMapZone() {
  for (const object of map.getObjectsInZone(x, y, width, height)) {
    const screenPt = convertToScreenCoords(object);
    switch (object.type) {
      case 0:
        console.error("Invalid type!");
        break;
      case 1:
      case 2:
        noStroke();
        fill(255, 0, 0);
        rect(screenPt.x, screenPt.y, 10, 20);
        break;
      case 3:
        noStroke();
        fill(255, 255, 255);
        ellipse(screenPt.x, screenPt.y, 2, 2);
        break;
      default:
        console.error("Invalid type " + object.type);
    }
  }
}

function movePlayer() {
  const speed = 10;
  if (!leftPressed && rightPressed) {
    x += speed;
  } else if (leftPressed && !rightPressed) {
    x -= speed;
  }
  if (!upPressed && downPressed) {
    y += speed;
  } else if (upPressed && !downPressed) {
    y -= speed;
  }
}

function drawPlayer() {
  fill(255, 255, 255);
  ellipse(width / 2, height / 2, playerSize, playerSize);
}

function sum(arr) {
  return arr.reduce((t, n) => { return t + n }, 0);
}

function rotatePattern(shieldPattern, shieldShift, cw) {
  const totalSize = sum(shieldPattern);
  if (shieldShift >= totalSize) {
    shieldShift = 0;
  }
  let pattern = cw ? [0, 0, ...shieldPattern] : [...shieldPattern, 0, 0];
  while (shieldShift > 0) {
    let pos = cw ? (pattern.length - 1) : 0;
    let dash = cw;
    let travelled = 0;
    while (pattern[pos] == 0) {
      pos += cw ? -1 : 1;
      dash = !dash;
      travelled++;
      if (travelled == 2) {
        travelled = 0;
        if (cw) {
          pattern.splice(-2);
          pattern = [0, 0, ...pattern];
          pos += 2;
        } else {
          pattern = pattern.splice(2);
          pattern = [...pattern, 0, 0];
          pos -= 2;
        }
      }
    }
    const toRemove = Math.min(shieldShift, pattern[pos]);
    pattern[pos] -= toRemove;
    if (cw) {
      pattern[dash ? 1 : 0] += toRemove;
    } else {
      pattern[dash ? (pattern.length - 1) : (pattern.length - 2)] += toRemove;
    }
    shieldShift -= toRemove;
  }
  return pattern;
}

function drawShieldRing(size, pos, dir, fuzz, shieldPattern) {
  const pattern = rotatePattern(shieldPattern, pos, dir);
  noFill();
  strokeWeight(2);
  lineDash(pattern);
  filter(`blur(${fuzz}px)`);
  ellipse(width / 2, height / 2, size, size);
  filter("none");
  lineDash([]);
}

let shieldPos = 0;
let variation = 0;
let variationDir = true;
let shieldFuzz = 0;
let shieldFuzzDir = true;
const shieldPattern = [20, 5, 5, 5, 20, 7];
const shieldPatternTotal = sum(shieldPattern);

function drawShield() {
  shieldPos += 1;
  if (shieldPos >= shieldPatternTotal) {
    shieldPos = 0;
  }
  // variation += (variationDir ? 1 : -1) * 0.2;
  // if (Math.abs(variation) >= 5) {
  //   variationDir = !variationDir;
  // }
  shieldFuzz += (shieldFuzzDir ? 1 : -1) * 0.05;
  if (Math.abs(shieldFuzz - 0.5) >= 1) {
    shieldFuzzDir = !shieldFuzzDir;
  }
  let s = shieldSize + variation;
  stroke(255, 255, 255);
  drawShieldRing(s - 5, shieldPos, true, shieldFuzz, shieldPattern);
  stroke(255, 255, 255);
  drawShieldRing(s + 5, shieldPos, false, shieldFuzz, shieldPattern);
}


let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
window.addEventListener('keyup', function(e) {
  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp":
      upPressed = false;
      break;
    case "s":
    case "S":
    case "ArrowDown":
      downPressed = false;
      break;
    case "a":
    case "A":
    case "ArrowLeft":
      leftPressed = false;
      break;
    case "d":
    case "D":
    case "ArrowRight":
      rightPressed = false;
      break;
  }
});

window.addEventListener('keydown', function(e) {
  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp":
      upPressed = true;
      break;
    case "s":
    case "S":
    case "ArrowDown":
      downPressed = true;
      break;
    case "a":
    case "A":
    case "ArrowLeft":
      leftPressed = true;
      break;
    case "d":
    case "D":
    case "ArrowRight":
      rightPressed = true;
      break;
  }
});