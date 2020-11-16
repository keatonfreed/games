class Map {
  #map = 0;
  #id = 0;
  constructor() {
    this.#map = [];
  }
  // Types:
  //  0: invalid
  //  1: player
  //  2: battery
  //  3: star
  addObject(type, x, y) {
    this.#map.push({ x: x, y: y, type: type, id: this.#id++ });
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
  remove(obj) {
    this.#map = this.#map.filter(p => { return p.id != obj.id });
  }

}

const map = new Map();
map.addRandomObjects(2500, 2, 0, 0, width * 20, height * 20);
map.addRandomObjects(100000, 3, 0, 0, width * 20, height * 20);

let myXSpeed = 0;
let myYSpeed = 0;

class Player {
  #x = 0;
  #y = 0;
  #playerSize = 20;
  #shieldSize = 200;
  #shieldPos = 0;
  #variation = 0;
  #variationDir = true;
  #shieldFuzz = 0;
  #shieldFuzzDir = true;
  #shieldPattern = [20, 5, 5, 5, 20, 7];
  #shieldPatternTotal = 0;
  constructor(x, y, s) {
    this.#x = x || this.#x;
    this.#y = y || this.#y;
    this.#shieldSize = s || this.#shieldSize;
    this.#shieldPatternTotal = sum(this.#shieldPattern);
  }
  get x() {
    return this.#x;
  }
  set x(val) {
    this.#x = val;
  }
  get y() {
    return this.#y;
  }
  set y(val) {
    this.#y = val;
  }
  get playerSize() {
    return this.#playerSize;
  }
  get shieldSize() {
    return this.#shieldSize;
  }
  set shieldSize(val) {
    this.#shieldSize = val;
  }

  rotatePattern(shieldPattern, shieldShift, cw) {
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

  drawShieldRing(size, pos, dir, fuzz, shieldPattern) {
    const pattern = this.rotatePattern(shieldPattern, pos, dir);
    noFill();
    strokeWeight(2);
    lineDash(pattern);
    filter(`blur(${fuzz}px)`);
    const loc = convertToScreenCoords({ x: this.#x, y: this.#y });
    ellipse(loc.x, loc.y, size, size);
    filter("none");
    lineDash([]);
  }

  drawShield() {
    this.#shieldPos += 1;
    if (this.#shieldPos >= this.#shieldPatternTotal) {
      this.#shieldPos = 0;
    }
    // variation += (variationDir ? 1 : -1) * 0.2;
    // if (Math.abs(variation) >= 5) {
    //   variationDir = !variationDir;
    // }
    this.#shieldFuzz += (this.#shieldFuzzDir ? 1 : -1) * 0.05;
    if (Math.abs(this.#shieldFuzz - 0.5) >= 1) {
      this.#shieldFuzzDir = !this.#shieldFuzzDir;
    }
    let s = this.#shieldSize + this.#variation;
    stroke(255, 255, 255);
    this.drawShieldRing(s - 5, this.#shieldPos, true, this.#shieldFuzz, this.#shieldPattern);
    stroke(255, 255, 255);
    this.drawShieldRing(s + 5, this.#shieldPos, false, this.#shieldFuzz, this.#shieldPattern);
  }

  hits(x, y) {
    return (x - this.#x) ** 2 + (y - this.#y) ** 2 < (this.#shieldSize ** 2) / 4;
  }
}
const me = new Player();

function draw() {
  background(0, 0, 0);
  const objectsInZone = drawMapZone();
  drawPlayer(me);
  movePlayer();
  checkCollisions(objectsInZone);

  fill(255, 255, 255);
  textSize(20);
  text(`${me.x}, ${me.y}`, width - 100, 20);
}


function convertToScreenCoords(pt) {
  return { x: pt.x - me.x + width / 2, y: pt.y - me.y + height / 2 };
}

function drawMapZone() {
  const objectsInZone = map.getObjectsInZone(me.x, me.y, width, height);
  for (const object of objectsInZone) {
    const screenPt = convertToScreenCoords(object);
    switch (object.type) {
      case 0:
        console.error("Invalid type!");
        break;
      case 1: // Player
        break;
      case 2: // Battery
        noStroke();
        fill(255, 0, 0);
        rect(screenPt.x, screenPt.y, 10, 20);
        break;
      case 3: // Star
        noStroke();
        fill(255, 255, 255);
        ellipse(screenPt.x, screenPt.y, 2, 2);
        break;
      default:
        console.error("Invalid type " + object.type);
    }
  }
  return objectsInZone;
}

function checkCollisions(objectsInZone) {
  for (const object of objectsInZone) {
    switch (object.type) {
      case 2: // Battery
        if (me.hits(object.x, object.y)) {
          me.shieldSize += 5;
          map.remove(object);
        }
        break;
    }
  }
}

function movePlayer() {
  const speed = 10;
  if (!leftPressed && rightPressed) {
    me.x += speed;
  } else if (leftPressed && !rightPressed) {
    me.x -= speed;
  }
  if (!upPressed && downPressed) {
    me.y += speed;
  } else if (upPressed && !downPressed) {
    me.y -= speed;
  }
}

function drawPlayer(p) {
  fill(255, 255, 255);
  const loc = convertToScreenCoords(p);
  ellipse(loc.x, loc.y, p.playerSize, p.playerSize);
  p.drawShield();
}

function sum(arr) {
  return arr.reduce((t, n) => { return t + n }, 0);
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