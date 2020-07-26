  var width = width || 600;
  var height = height || 600;

  var mouseX = 0;
  var mouseY = 0;

  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  canvasElement.style.width = width;
  canvasElement.style.height = height;
  canvasElement.style.border = "1px solid black";
  document.body.appendChild(canvasElement);
  var ctx = canvasElement.getContext("2d");

  function background(r,g,b) {
    fill(r,g,b);
    rect(0, 0, width, height);
  }

  function noStroke() {
    ctx.strokeStyle = "rgba(1, 1, 1, 0)";
  }
  function stroke(r,g,b) {
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
  }
  function strokeWeight(n) {
    ctx.lineWidth = n;
  }
  function fill(r,g,b) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
  }
  function noFill() {
    ctx.fillStyle = "rgba(1, 1, 1, 0)";
  }
  function mod(x,n) {
      return ((x%n)+n)%n;
  };
  function arc(x,y,w,h,cs,cst) {
    const startAngle = mod(cs*Math.PI/180,360);
    const endAngle = mod(cst*Math.PI/180,360);
    ctx.beginPath();
    ctx.ellipse(x, y, w/2, h/2, 0, Math.min(startAngle, endAngle), Math.max(startAngle,endAngle));
    ctx.fill();
    ctx.stroke();
  }
  function line(x1,y1,x2,y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  function rect(x, y, width, height, radius) {
    if (typeof radius === "undefined") {
      radius = 0;
    }
    let minDim = Math.min(width,height);
    radius = Math.min(radius,minDim/2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
  function tan(deg) {
    return Math.tan(deg*Math.PI/180);
  }
  function cos(deg) {
    return Math.cos(deg*Math.PI/180);
  }
  function sin(deg) {
    return Math.sin(deg*Math.PI/180);
  }
  function sqrt(x) {
    return Math.sqrt(x);
  }
  function ellipse(x,y,w,h) {
    arc(x,y,w,h,0,360);
  }
  var _lineheight = 15;
  function textSize(s) {
    ctx.font = `${s}px Arial`;
    _lineheight = s;
  }
  function text(txt,x,y) {
    let lines = txt.split('\n');
    for (var i = 0; i<lines.length; i++)
       ctx.fillText(lines[i], x, y + (i*_lineheight) );
  }
  function println(t) {
    console.log(t);
  }
  function pushMatrix() {
    ctx.save();
  }
  function popMatrix() {
    ctx.restore();
  }
  function translate(x,y) {
    ctx.translate(x,y);
  }
  function rotate(deg) {
    // Degrees
    ctx.rotate(deg * Math.PI / 180);
  }
  function triangle(x1,y1,x2,y2,x3,y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
  }
  function textAlign(leftRight,topBottom) {
    ctx.textAlign = leftRight;
    ctx.textBaseline = topBottom;
  }
  const CENTER = "center";
  const TOP = "top";

  const startTime = (new Date()).getTime();
  function millis() {
    return (new Date()).getTime()-startTime;
  }
  function abs(x) {
    return Math.abs(x);
  }
  var _framerate = 60;
  function framerate(n) {
    _framerate = n;
  }
