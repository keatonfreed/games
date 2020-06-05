
var game = 2;
switch(game){
case 1:
    {var jackpotTime = 0;
var arrowActive = true;
var restart = false;
var arrowX;
var arrowY;
var jackpot = false;
strokeWeight(3);
var target = function() {
background(148, 143, 148);

//white
stroke(0, 0, 0);
fill(222, 222, 222);
ellipse(200, 200, 400, 400);
ellipse(200, 200, 360, 360);
//black
stroke(250, 250, 250);
fill(28, 28, 28);
ellipse(200, 200, 320, 320);
ellipse(200, 200, 280, 280);
//blue
stroke(0, 0, 0);
fill(12, 145, 166);
ellipse(200, 200, 240, 240);
ellipse(200, 200, 200, 200);
//red
fill(242, 36, 36);
ellipse(200, 200, 160, 160);
ellipse(200, 200, 120, 120);
//yellow
fill(255, 191, 0);
ellipse(200, 200, 80, 80);
ellipse(200, 200, 45, 45);
//jackpot
fill(255, 255, 255);
ellipse(200,200,20,20);};
var arrow = function() {
{fill(10, 68, 176);
triangle(arrowX+102, arrowY-87, arrowX+158, arrowY-130, arrowX+120, arrowY-133);
triangle(arrowX+102, arrowY-75, arrowX+161, arrowY-130, arrowX+161, arrowY-91);
fill(0, 0, 0);
strokeWeight(12);
line(arrowX, arrowY, arrowX+160, arrowY-127);}
};
var bow = function(x,y,stretch) {
  noFill();
   strokeWeight(6);
   stroke(133, 92, 25);
   var startAngle = 70;
   var endAngle =startAngle - stretch*20;
   var bowOffset = stretch*40;
   var bowW = 130+bowOffset*2;
   var bowH = 200;
   arc(x-bowOffset,y,bowW,bowH,-endAngle,endAngle);
   stroke(255, 255, 255);

//   var tanVal = tan(endAngle);
//   var denom = sqrt(bowH*bowH + bowW*bowW*tanVal*tanVal)*2;
//   var bowX = bowH*bowW/denom;
//   var bowY = bowH*bowW*tanVal/denom;

   var tanVal = tan(endAngle);
   var denom = sqrt(bowH*bowH + bowW*bowW*tanVal*tanVal)*2;
   var bowX = bowW*cos(endAngle)/2;
   var bowY = bowH*sin(endAngle)/2;

   var lineX = x - stretch*90 + bowW*cos(startAngle)/2;
   line(x+bowX-bowOffset,y+bowY,lineX,y);
   line(x+bowX-bowOffset,y-bowY,lineX,y);
};

var stretch = 0;
var bowX = 100;
var bowY = 150;
var bowMovingPositive = true;

// States:
//  - leftright
//  - leftrightpause
//  - updown
//  - updownpause
//  - stretching
//  - shot
var state = 'leftright';
var pauseStarted = 0;

draw = function() {
target();
  bow(bowX,bowY,stretch);

  switch (state) {
      case 'leftright':
          var bowXSpeed = 5;
          bowX = bowX + bowXSpeed*(bowMovingPositive ? 1 : -1);
          if (bowX>400 || bowX<0) {
              bowMovingPositive = !bowMovingPositive;
          }
          break;
      case 'leftrightpause':
          if (millis() - pauseStarted >= 1000) {
              state='updown';
          }
          break;
      case 'updown':
          var bowYSpeed = 5;
          bowY = bowY + bowYSpeed*(bowMovingPositive ? 1 : -1);
          if (bowY>400 || bowY<0) {
              bowMovingPositive = !bowMovingPositive;
          }
          break;
      case 'updownpause':
          if (millis() - pauseStarted >= 1000) {
              state='stretching';
          }
          break;
      case 'stretching':
          stretch += 0.03;
          if (stretch>1) {
              state='shot';
              stretch = 0;
          }
          break;
      case 'shot':
          arrowX = bowX + 80;
          arrowY = bowY;
         strokeWeight(6);
         target();
         bow(bowX,bowY,0);
          new arrow();
          fill(255, 0, 0);
          text("click to play again",160,350);
          break;
      case'shotpause':
           if (millis() - pauseStarted >= 1000) {
              state='leftright';
          }
          break;
      default:
          println('Error!');
  }


   if(arrowX >= 195 && arrowX <= 205 && arrowY >= 195 && arrowY <= 205) {
       //println("jackpot!");
       arrowX = 0;
       arrowY = 0;
       jackpot = true;
   }
   if (jackpot === true) {
       fill(255, 255, 255);
       textSize(75);
       text("Jackpot!",75,150);
       jackpotTime = millis();
       jackpot = false;


   }else {//jackpotTime = 0;

   }
   if (restart === true) {

       background(148, 143, 148);
        strokeWeight(3);
        target();
        restart = false;
   }else {

   }
   if(jackpotTime !== 0 && millis() - jackpotTime >= 2000) {

       jackpotTime = 0;
       restart = true;
   }
};

mouseClicked = function() {
if(state === 'leftright') {
state = 'leftrightpause';
pauseStarted = millis();
}
if(state === 'updown') {
state = 'updownpause';
pauseStarted = millis();
}
if(state === 'shot') {
state = 'shotpause';
pauseStarted = millis();
}
   /* if(arrowActive) {
        strokeWeight(3);
         arrowX = mouseX;
        arrowY = mouseY;
        new arrow();
    }*/
};
}
    break;
    case 2:
    {



    }
    break;
    default:
    println("invalid game number");
}
draw= function() {

};
