let playerSize = 20;
let shieldSize = 100;

function draw() {
  background(0, 0, 0);
  drawPlayer();
  drawShield();
}

function drawPlayer() {
  fill(255, 255, 255);
  lineDash([]);
  ellipse(width / 2, height / 2, playerSize, playerSize);
}

function reversePattern(pattern) {
  let pat = [];
  for (let i = pattern.length - 2; i >= 0; i -= 2) {
    pat = [...pat, pattern[i], pattern[i + 1]];
  }
  return pat;
}

function rotatePattern(shieldPattern, shieldShift, cw) {
  // if (dir < 0) {
  //   return reversePattern(rotatePattern(reversePattern(shieldPattern), pos, -dir));
  // }
  const totalSize = shieldPattern.reduce((t, n) => { t + n }, 0);
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

function drawShieldRing(size, pos, dir, shieldPattern) {
  const pattern = rotatePattern(shieldPattern, pos, dir);
  noFill();
  strokeWeight(2);
  lineDash(pattern);
  ellipse(width / 2, height / 2, size, size);
}

let shieldPos = 0;

function drawShield() {
  const shieldPattern = [20, 5, 5, 5, 20, 7];
  //  const shieldPattern = [2, 4, 6, 8];
  if (shieldPos >= shieldPattern.reduce((t, n) => { t + n }, 0)) {
    shieldPos = 0;
  }
  stroke(255, 0, 0);
  drawShieldRing(shieldSize, shieldPos, true, shieldPattern);
  stroke(0, 255, 0);
  drawShieldRing(shieldSize + 5, shieldPos, false, shieldPattern);
  stroke(0, 0, 255);
  drawShieldRing(shieldSize + 10, shieldPos, true, shieldPattern);
  stroke(255, 255, 255);
  drawShieldRing(shieldSize + 20, shieldPos, false, shieldPattern);
  shieldPos += 1;
}