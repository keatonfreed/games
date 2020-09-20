noStroke();
var treeX = 170;
var axeNumber = 0;
var axeRotation = 0;
var axeDirection = true;
var treechopstate = 'sapling';
var axePerfect = false;
var axeX;
var axeY = height + 150;
var treeRot = 0;
var treeSpeed = 0;
var cloud1 = 20;
var cloud2 = 225;
var cloud3 = 80;
var cloud4 = -180;
var logNum = 30;
var woodY = 550;
var lastTreeStageTime = 0;
var woodEarnings = 0;

function drawBackdrop() {
  background(255, 255, 255);

  cloud1 += 0.5; //small cloud move
  if (cloud1 > 450) {
    cloud1 = -100;
  }
  cloud2 += 0.6; //big cloud move
  if (cloud2 > 450) {
    cloud2 = -150;
  }
  cloud3 += 0.3; //small cloud move
  if (cloud3 > 450) {
    cloud3 = -150;
  }
  cloud4 += 0.5; //small cloud move
  if (cloud4 > 450) {
    cloud4 = -130;
  }

  background(215, 255, 255);

  //sun
  fill(255, 255, 0);
  arc(200, 60, 100, 100, -90, 90);
  fill(255, 240, 0);
  arc(200, 60, 100, 100, 90, 270);

  //clouds
  fill(255, 255, 255);
  rect(cloud1, 45, 100, 25, 40);
  rect(cloud2, 75, 155, 40, 40);
  rect(cloud3, 151, 149, 50, 40);
  rect(cloud4, 131, 136, 27, 40);

  //ground
  fill(80, 255, 75);
  rect(0, 550, 600, 60);

  //chest
  noStroke();
  fill(135, 52, 7);
  rect(250, 50, 100, 50);
  arc(300, 50, 100, 70, 181, 360);

  fill(207, 146, 15);
  rect(340, 50, 10, 50);
  rect(250, 50, 10, 50);
  rect(250, 50, 100, 8);
  rect(250, 90, 100, 10);
  rect(292, 50, 15, 25);

  fill(0, 0, 0);
  ellipse(300, 69, 5.5, 5.5);
  triangle(297.5, 57, 302.5, 57, 300, 70);

  noFill();
  stroke(207, 146, 15);
  strokeWeight(9.5);
  arc(300, 50, 90, 70, 181, 360);
  noStroke();
}

function drawAxe() {
  if (treechopstate === 'aiming' || treechopstate === 'halfgrown') {
    axeX = mouseX - 15;
    if (treechopstate === 'aiming') {
      axeY = 450;
    } else if (treechopstate === 'halfgrown') {
      if (axeY >= 450) {
        axeY -= 1.75;
      }
    }
    if (axeX >= treeX) {
      axeX = treeX;
    }
    if (axeX <= treeX - 150) {
      axeX = treeX - 150;
    }
  } else if (treechopstate === 'falling') {
    axeY += 2.5;
  }

  // draw axe
  pushMatrix();
  translate(axeX, axeY);
  rotate(axeRotation);
  if (treechopstate === 'shaking') {
    axeRotation += axeDirection ? 1 : -1;
    if (axeRotation > 10) {
      axeDirection = false;
    } else if (axeRotation < -10) {
      axeDirection = true;
    }
  } else {
    axeRotation = 0;
  }
  switch (axeNumber) {
    case 0:
      rotate(-90);
      fill(87, 63, 63);
      rect(0, 10, 100, 10);
      fill(89, 80, 80);
      var triangleSize = 20;
      var txw = triangleSize * Math.sqrt(2);
      var tyw = 2 * Math.sqrt(2) * triangleSize;
      triangle(80, 0, 80 - txw, tyw, 80 + txw, tyw);
      break;
    case 1:
      rect(axeX, axeY, 20, 20, 2);
      break;
    default:
      println('Error!');
  }
  popMatrix();

  // check axe location
  var axeMessage;
  var distanceToTree = treeX - axeX;
  textSize((treeX - distanceToTree) * 0.1 + 15);
  axePerfect = false;
  if (distanceToTree <= 30) {
    fill(255, 0, 0);
    axeMessage = "TOO CLOSE!";
  } else if (distanceToTree > 120) {
    fill(0, 204, 255);
    axeMessage = "FAR \nFAR \nAWAY";
  } else if (distanceToTree > 90) {
    fill(102, 6, 96);
    axeMessage = "CLOSER!!!";
  } else if (distanceToTree > 75) {
    fill(0, 13, 255);
    axeMessage = "KEEP GOING!";
  } else if (distanceToTree > 35) {
    fill(255, 191, 0);
    axeMessage = "JUST A\nBIT CLOSER!";
  } else {
    //1-30
    fill(13, 255, 0);
    axeMessage = "PERFECT!";
    axePerfect = true;
  }
  if (treechopstate === 'aiming' || treechopstate === 'shaking') {
    textAlign(CENTER, TOP);
    text(axeMessage, axeX + 18, axeY + 20);
  }
}

function drawTree() {
  pushMatrix();
  let shouldDrawTree = false;
  switch (treechopstate) {
    case 'sapling':
      fill(56, 44, 40);
      rect(260, 500, 10, 50, 2);
      noFill();
      stroke(56, 44, 40);
      arc(295, 500, 60, 40, 180, 270);
      arc(237.5, 500, 55, 60, 260, 360);
      arc(247.5, 540, 35, 60, 260, 360);
      noStroke();
      fill(20, 138, 14);
      rotate(25);
      ellipse(434, 366, 10, 20);
      rotate(-35);
      rotate(-25);
      ellipse(-32, 568, 10, 20);
      rotate(35);
      rotate(-20);
      ellipse(58, 528, 10, 20);
      rotate(20);
      rotate(25);
      ellipse(408, 335, 10, 20);
      rotate(-25);

      if (millis() - lastTreeStageTime >= 3000) {
        treechopstate = 'halfgrown';
        lastTreeStageTime = millis();
      }
      break;
    case 'halfgrown':
      fill(56, 44, 40);
      rect(260, 350, 50, 200, 2);
      fill(20, 138, 14);
      ellipse(290, 290, 80, 90);
      ellipse(270, 335, 100, 80);
      ellipse(310, 335, 90, 70);
      if (millis() - lastTreeStageTime > 3000) {
        treechopstate = 'aiming';
        lastTreeStageTime = millis();
      }
      break;
    case 'aiming':
      shouldDrawTree = true;
      break; // Do nothing
    case 'shaking':
      shouldDrawTree = true;
      translate(250, 600);
      treeSpeed += Math.random() * 0.5 - 0.25;
      treeRot += treeSpeed;
      if (abs(treeSpeed) > 5 || abs(treeRot) > 3) {
        treeSpeed = 0;
      }
      treeRot = Math.max(-3, Math.min(3, treeRot));
      rotate(treeRot);
      translate(-250, -600);
      if (millis() - lastTreeStageTime > 3000) {
        treechopstate = 'falling';
        lastTreeStageTime = millis();
      }
      break;
    case 'falling':
      shouldDrawTree = true;
      translate(250, 600);
      treeSpeed = 1;
      treeRot += treeSpeed;
      treeRot = Math.min(90, treeRot);
      rotate(treeRot);
      translate(-250, -600);

      if (millis() - lastTreeStageTime > 2000) {
        treechopstate = 'collectWood';
        lastTreeStageTime = millis();
      }
      break;
    case 'collectWood':
      fill(125, 77, 15);
      for (var woodX = 330; woodX > 330 - logNum; woodX--) {
        stroke(0, 0, 0);
        strokeWeight(0.4);
        ellipse(woodX - 13, woodY, 32.5, 36);
        ellipse(woodX + 13, woodY, 32.5, 35);
        ellipse(woodX, woodY - 25, 32.5, 35);
        noStroke();
      }
      fill(0, 0, 0);
      textSize(35);
      text(woodEarnings, woodX + 60, woodY - 50);
      woodY -= 7.5;
      if (woodY < 50) {
        lastTreeStageTime = millis();
        treechopstate = 'sapling';
        woodY = 550;
      }
      break;
    default:
      alert(`Shouldn't get here! treechopstate is ${treechopstate}`);
  }
  if (shouldDrawTree) {
    // Just draw full tree
    fill(56, 44, 40);
    rect(200, 200, 81, 350, 20);
    fill(20, 138, 14);
    ellipse(236, 225, 200, 200);
  }
  popMatrix();
}
draw = function() {
  drawBackdrop();
  drawTree();
  drawAxe();
};

mouseClicked = function() {
  if (treechopstate === 'aiming') {

    if (axePerfect) {

      woodEarnings = 15;
      treechopstate = 'shaking';
      lastTreeStageTime = millis();
    } else {

      woodEarnings = 5;
      treechopstate = 'shaking';
      lastTreeStageTime = millis();
    }
  }


};