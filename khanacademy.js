  const width = 600;
  const height = 600;

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

  requestAnimationFrame(function raf() {
    draw();
    requestAnimationFrame(raf);
  });

  function background(r,g,b) {
    fill(r,g,b);
    rect(0, 0, width, height);
  }

  function noStroke() {
    ctx.strokeStyle = "rgba(1, 1, 1, 0)";
  }
  function fill(r,g,b) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
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
  }
  function ellipse(x,y,w,h) {
    arc(x,y,w,h,0,360);
  }
  function textSize(s) {
    ctx.font = `${s}px Arial`;
  }
  function text(t,x,y) {
    ctx.fillText(t, x, y);
  }
  function println(t) {
    console.log(t);
  }
  function rect(x, y, width, height, radius) {
    if (typeof radius === "undefined") {
      radius = 0;
    }
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
  window.addEventListener('click',e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    mouseClicked();
  });
