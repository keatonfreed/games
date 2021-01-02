class MapObject {
  #x = 0
  #y = 0
  constructor(x, y) {
    this.#x = x || this.#x;
    this.#y = y || this.#y;
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
  draw() { throw Error("Not implemented"); }
  extents() { throw Error("Not implemented"); }
  intersects(x1, y1, x2, y2) {
    const [left, top, right, bottom] = this.extents();
    return left <= x2 && right >= x1 &&
      top <= y2 && bottom >= y1;
  }
}

class Battery extends MapObject {
  #w = 10;
  #h = 20;
  draw() {
    noStroke();
    fill(255, 0, 0);
    const pt = convertToScreenCoords(this);
    rect(pt.x, pt.y, this.#w, this.#h);
  }
  extents() {
    return [this.x, this.y, this.x + this.#w, this.y + this.#h];
  }
}

class Star extends MapObject {
  #brightness = Math.random() * 255;
  draw() {
    noStroke();
    const b = this.#brightness;
    fill(b, b, b);
    this.#brightness += Math.random() * 10 - 5;
    this.#brightness = Math.max(0, Math.min(255, this.#brightness));
    const pt = convertToScreenCoords(this);
    ellipse(pt.x, pt.y, 2, 2);
  }
  extents() {
    return [this.x - 1, this.y - 1, this.x + 1, this.y + 1];
  }
}

class Player extends MapObject {
  #playerSize = 20;
  #radius = 100;
  #shieldPos = 0;
  #variation = 0;
  #variationDir = true;
  #shieldFuzz = 0;
  #shieldFuzzDir = true;
  #shieldPattern = [20, 5, 5, 5, 20, 7];
  #shieldPatternTotal = 0;
  constructor(x, y, s) {
    super(x, y);
    this.#radius = s || this.#radius;
    this.#shieldPatternTotal = sum(this.#shieldPattern);
  }
  get playerSize() {
    return this.#playerSize;
  }
  get radius() {
    return this.#radius;
  }
  set radius(val) {
    this.#radius = Math.max(0, Math.min(250, val));
  }
  isDead() {
    return this.radius <= this.#playerSize;
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
    if (size <= 0) {
      return;
    }
    const pattern = this.rotatePattern(shieldPattern, pos, dir);
    noFill();
    strokeWeight(2);
    lineDash(pattern);
    filter(`blur(${fuzz}px)`);
    const loc = convertToScreenCoords(this);
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
    let s = this.#radius * 2 + this.#variation;
    stroke(255, 255, 255);
    this.drawShieldRing(s - 10, this.#shieldPos, true, this.#shieldFuzz, this.#shieldPattern);
    stroke(255, 255, 255);
    this.drawShieldRing(s, this.#shieldPos, false, this.#shieldFuzz, this.#shieldPattern);
  }

  draw() {
    if (this.isDead()) {
      return;
    }
    fill(255, 255, 255);
    const loc = convertToScreenCoords(this);
    ellipse(loc.x, loc.y, this.#playerSize, this.#playerSize);
    this.drawShield();
  }

  extents() {
    const r = this.radius;
    return [this.x - r, this.y - r, this.x + r, this.y + r];
  }

  intersects(x1, y1, x2, y2) {
    if (!super.intersects(x1, y1, x2, y2)) {
      return false;
    }
    if ((this.x <= x2 && this.x >= x1) ||
      (this.y <= y2 && this.y >= y1)) {
      return true;
    }
    return this.hits(x1, y1) ||
      this.hits(x2, y2) ||
      this.hits(x2, y1) ||
      this.hits(x1, y2);
  }

  checkPlayerInsersection(p2) {
    if (!this.intersects(...p2.extents())) {
      return;
    }
    if (this.isDead() || p2.isDead()) {
      return;
    }
    const d = Math.sqrt((this.x - p2.x) ** 2 + (this.y - p2.y) ** 2);
    if (d < (this.radius + p2.radius)) {
      // Intersection!
      if (this.radius > p2.radius ||
        (this.radius == p2.radius && Math.random() > 0.5)) {
        // We win (either larger or randomly if equal)
        this.radius += 0.5; // We gain 0.5
        p2.radius = d - this.radius - 0.25; // They lose the gap, minus a bit
      } else {
        // We lose (they eat the gap)
        p2.radius += 0.5; // They gain 0.5
        this.radius = d - p2.radius - 0.25; // We lose the gap, minus a bit
      }
    }
  }

  hits(x, y) {
    return (x - this.x) ** 2 + (y - this.y) ** 2 < (this.radius ** 2);
  }
}


class Map {
  #map = 0;
  constructor() {
    this.#map = [];
  }
  addObject(type, x, y) {
    const newObj = new type(x, y);
    this.#map.push(newObj);
    return newObj;
  }
  addRandomObjects(n, type, x, y, w, h, fn) {
    fn = fn || (f => f);
    for (let i = 0; i < n; i++) {
      fn(this.addObject(type, Math.random() * w + x - w / 2, Math.random() * h + y - h / 2));
    }
  }
  getObjectsInZone(x, y, w, h) {
    const x1 = x - w / 2;
    const x2 = x + w / 2;
    const y1 = y - h / 2;
    const y2 = y + h / 2;
    return this.#map.filter(p => { return p.intersects(x1, y1, x2, y2) });
  }
  remove(obj) {
    this.#map = this.#map.filter(p => { return p != obj });
  }

}

let myXSpeed = 0;
let myYSpeed = 0;
let viewWidth = width;
let viewHeight = height;

const map = new Map();
map.addRandomObjects(2500, Battery, 0, 0, viewWidth * 20, viewHeight * 20);
map.addRandomObjects(100000, Star, 0, 0, viewWidth * 20, viewHeight * 20);
const modSize = p => { p.radius = Math.round(Math.random() * 40 + 80); }
map.addRandomObjects(1000, Player, 0, 0, viewWidth * 20, viewHeight * 20, modSize);

const me = new Player();
me.radius = 120;

function draw() {
  background(0, 0, 0);
  const objectsInZone = drawMapZone();
  me.draw();
  movePlayer();
  checkCollisions(objectsInZone);

  fill(255, 255, 255);
  textSize(10);
  textAlign(RIGHT);
  // This text always goes at width
  text(`${me.x}, ${me.y}`, width - 5, 10);

  // if (me.shieldSize > viewWidth * 0.75) {
  //   viewWidth *= 2;
  //   viewHeight *= 2;
  // }
}


function convertToScreenCoords(pt) {
  return { x: pt.x - me.x + viewWidth / 2, y: pt.y - me.y + viewHeight / 2 };
}

function drawMapZone() {
  const objectsInZone = map.getObjectsInZone(me.x, me.y, viewWidth, viewHeight);
  for (const object of objectsInZone) {
    object.draw();
  }
  return objectsInZone;
}

function checkCollisions(objectsInZone) {
  for (let i = 0; i < objectsInZone.length; i++) {
    const object = objectsInZone[i];
    if (object instanceof Battery) {
      if (me.intersects(...object.extents())) {
        me.radius += 0.5;
        map.remove(object);
      }
    } else if (object instanceof Player) {
      // const r1 = me.radius;
      // const r2 = object.radius;
      me.checkPlayerInsersection(object);
      // if (r1 != me.radius || r2 != object.radius) {
      //   alert(`change, me went from ${r1} to ${me.radius}, object from ${r2} to ${object.radius}`);
      // }

      // Found a player in the zone - loop through the rest of the objects
      // to find collisions with others.
      for (let j = i + 1; j < objectsInZone.length; j++) {
        const otherPlayer = objectsInZone[j];
        if (otherPlayer instanceof Player) {
          // const r1 = object.radius;
          // const r2 = otherPlayer.radius;
          object.checkPlayerInsersection(otherPlayer);
          // if (r1 != object.radius || r2 != otherPlayer.radius) {
          //   //            alert(`after, object went from ${r1} to object.radius`);
          // }
        }
      }
    }
  }
}

function movePlayer() {
  const speed = 7;
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
//mouseClicked = () => ();