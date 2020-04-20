var numCars = 6;
var roadHeight = 40;
var yellowHeight = 7/40*roadHeight;
var yellowWidth = 20/40*roadHeight;
var extraSpacing = 60;
var finish = 540;
var running = false;

var yx = 10;
var c1x = 44;
var c1y = 135;
var c2x = 44;
var c2y = 325;
var c3x = 44;
var c3y = 515;
var carX = [];
var carSpeed = [];

function resetCars() {
  for (var i = 0; i < numCars; i++) {
    carX[i] = 50;
    carSpeed[i] = 0;
  }
}
resetCars();
mouseClicked = function() {

     if (mouseX >= 200 && mouseX <= 400 &&
         mouseY >= 25 && mouseY <= 75) {
     if (!running) {
         resetCars();
         running = true;
         }
     }
};

var block = function(rx,ry,rw,rh,rcs1,rcs2,rcs3) {
noStroke();
fill(rcs1, rcs2, rcs3);
rect(rx,ry,rw,rh);

};

var yellow = function(yy,yh,yw) {
fill(255, 221, 0);
for(var yx=10; yx<600; yx+=50) {
    rect(yx,yy,yw,yh);
}

};
var finishline = function() {

for(var fy=80; fy<520; fy+=20) {
    fill(0, 0, 0);
    rect(finish + 29,fy + 0,10,10);
    fill(255, 255, 255);
    rect(finish + 29,fy + 10,10,10);
}

};

var cars = function(cx,cy,cw,ch,cs,cst,ccs1,ccs2,ccs3) {
fill(ccs1, ccs2, ccs3);
arc(cx,cy,cw,ch,cs,cst);
fill(0, 0, 0);
ellipse(cx - 15,cy,15,15);
ellipse(cx + 15,cy,15,15);
};

draw = function() {
 background(30, 214, 17); // Green

 var colors = [{r:0,g:0,b:255},{r:255,g:0,b:0},{r:255,g:255,b:0},{r:255,g:128,b:0},];
 var colorIndx = 0;
 var spacing = Math.max(0,(height - numCars*roadHeight - 2*extraSpacing)  / (numCars+1));
 var yy=spacing+roadHeight/2+extraSpacing;
 for (var carNum=0;carNum<numCars;carNum++) {
     block(0,yy-roadHeight/2,width,roadHeight,140,140,140);
     yellow(yy-yellowHeight/2,yellowHeight,yellowWidth);
     finishline();
     cars(carX[carNum],yy,54,54,180,360,colors[colorIndx].r,colors[colorIndx].g,colors[colorIndx].b);

     colorIndx++;
     colorIndx = colorIndx % colors.length;
     yy+=spacing+roadHeight;
     if (running) {
         carSpeed[carNum] += Math.random()*4-3;
         carX[carNum] += carSpeed[carNum]/10;
          if (carX[carNum] >= finish) {
              println("Car #" + (carNum+1) + " won!");
             //resetCars();
             running = false;
          }
 if (carX[carNum] <= 25) {
     carSpeed[carNum] = 500;

 }
}
 }

//button
fill(255, 0, 0);
rect(200,25,200,50,5);
fill(255, 255, 255);
textSize(45);
text("Start",250,65);
};
