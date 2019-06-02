var b = 100
function setup() {
  cnv = createCanvas(400, 400);
  cnv.mouseOver(info);
  circle = ellipse(20,20,20,20)
}

function draw() {
  background(b);
  fill(250)
}

function info() {
  b = 0
  console.log("hey")
}