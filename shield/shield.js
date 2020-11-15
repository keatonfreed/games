let playerSize = 20;
let shieldSize = 200;

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

function rotatePattern(shieldPattern, shieldShift, cw) {
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

function drawShieldRing(size, pos, dir, fuzz, shieldPattern) {
  const pattern = rotatePattern(shieldPattern, pos, dir);
  noFill();
  strokeWeight(2);
  lineDash(pattern);
  filter(`blur(${fuzz}px)`);
  ellipse(width / 2, height / 2, size, size);
}

let shieldPos = 0;
let variation = 0;
let variationDir = true;
let shieldFuzz = 0;
let shieldFuzzDir = true;
const shieldPattern = [20, 5, 5, 5, 20, 7];
const shieldPatternTotal = shieldPattern.reduce((t, n) => { t + n }, 0);

function drawShield() {
  shieldPos += 1;
  if (shieldPos >= shieldPatternTotal) {
    shieldPos = 0;
  }
  variation += (variationDir ? 1 : -1) * 0.2;
  if (Math.abs(variation) >= 5) {
    variationDir = !variationDir;
  }
  shieldFuzz += (shieldFuzzDir ? 1 : -1) * 0.05;
  if (Math.abs(shieldFuzz - 0.5) >= 1) {
    shieldFuzzDir = !shieldFuzzDir;
  }
  let s = shieldSize + variation;
  stroke(255, 0, 0);
  drawShieldRing(s, shieldPos, true, shieldFuzz, shieldPattern);
  stroke(0, 255, 0);
  drawShieldRing(s + 5, shieldPos, false, shieldFuzz, shieldPattern);
  stroke(0, 0, 255);
  drawShieldRing(s + 10, shieldPos, true, shieldFuzz, shieldPattern);
  stroke(255, 255, 255);
  drawShieldRing(s + 20, shieldPos, false, shieldFuzz, shieldPattern);
}