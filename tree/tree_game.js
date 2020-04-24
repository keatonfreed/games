var badTreeChop = false;
var treeX = 170;
var axeNumber = 0;
var axeRotation = 0;
var axeDirection = true;
var treechopstate = 0;
var lastTreeChopStateChange = 0;
var axePerfect = false;
var axeX;
var axeY;
var treeRot = 0;
var treeSpeed = 0;
function tree() {
    pushMatrix();
    var drawthetree=true;
    switch (treechopstate) {
        case 0: break; // Do nothing
        case 1:
            translate(250,600);
            treeSpeed += Math.random()*0.5-0.25;
            treeRot += treeSpeed;
            if (abs(treeSpeed)>5 || abs(treeRot)>3) {
                treeSpeed = 0;
            }
            treeRot = Math.max(-3,Math.min(3,treeRot));
            rotate(treeRot);
            translate(-250,-600);
            if (millis() - lastTreeChopStateChange > 3000) {
                treechopstate = 2;
                lastTreeChopStateChange = millis();
            }
            break;
        case 2:
            translate(250,600);
            treeSpeed = 1;
            treeRot += treeSpeed;
            treeRot = Math.min(90,treeRot);
            rotate(treeRot);
            translate(-250,-600);

            if (millis() - lastTreeChopStateChange > 3000) {
                treechopstate = 3;
                lastTreeChopStateChange = millis();
            }
            break;
        case 3:
            drawthetree=false;
            break;
        default:
    }
    if (drawthetree) {
        fill(56, 44, 40);
        rect(200,250,81,350,20);
        fill(20, 138, 14);
        ellipse(236,275,200,200);
    }
    popMatrix();
}
tree();
draw = function() {
    background(255, 255, 255);
    tree();

    if (treechopstate === 0) {
        axeX = mouseX;
        axeY = 500;
        if (axeX >= treeX){
            axeX = treeX;
        }
        if (axeX <= treeX-150) {
            axeX = treeX-150;
        }
    }
    // draw axe
    pushMatrix();
    translate(axeX,axeY);
    rotate(axeRotation);
    if (treechopstate === 1) {
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
            rect(0,10,100,10);
            fill(89, 80, 80);
            var triangleSize = 20;
            var txw = triangleSize*Math.sqrt(2);
            var tyw = 2*Math.sqrt(2)*triangleSize;
            triangle(80,0,80-txw,tyw,80+txw,tyw);
            break;
        case 1:
            rect(axeX,axeY,20,20,2);
            break;
        default: println('Error!');
    }
    popMatrix();

    // check axe location
    var axeMessage;
    var distanceToTree = treeX - axeX;
    textSize((treeX-distanceToTree)*0.1+15);
    axePerfect = false;
    if (distanceToTree <= 30) {
        fill(255, 0, 0);
        axeMessage = "TOO CLOSE!";
    } else if (distanceToTree >120) {
        fill(0, 204, 255);
        axeMessage = "FAR \nFAR \nAWAY";
    } else if (distanceToTree >90) {
        fill(102, 6, 96);
        axeMessage = "CLOSER!!!";
    }else if (distanceToTree >75) {
        fill(0, 13, 255);
        axeMessage = "KEEP GOING!";
    } else if (distanceToTree >35) {
        fill(255, 191, 0);
        axeMessage = "JUST A\nBIT CLOSER!";
    } else {
        //1-30
        fill(13, 255, 0);
        axeMessage = "PERFECT!";
        axePerfect = true;
    }

    textAlign(CENTER, TOP);
    text(axeMessage,axeX+18,axeY+20);
};

mouseClicked = function() {
    if (axePerfect && treechopstate === 0) {
        treechopstate = 1;
        lastTreeChopStateChange = millis();

    }
         if (!axePerfect) {
        badTreeChop = true;
    }



};
