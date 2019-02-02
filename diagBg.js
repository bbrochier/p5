
var diags = [];
var diagFade = 1;
var diagColor = []

function setup() {
  createCanvas(300, 500);
  stroke(255);

  for (var i = -20; i < 2*width; i+=20) {
    diags.push(new Diag(i, diagFade));
    diagFade = - diagFade;
  }
}

function draw() {
  clear();
  background(0);
  
  if (frameCount % 40 === 0) {
    diags.push(new Diag(-20, diagFade));
    diagFade = - diagFade;
  }
  for (var i = 0; i < diags.length; i++) {
    diags[i].move();
    diags[i].display();
  }
}

function Diag(x, fade) {
  this.w = 20;
  this.x1 = x;
  this.y1 = 0;
  this.x2 = this.x1 + this.w;
  this.y2 = this.y1;
  this.x3 = this.x2 - width + this.w;
  this.y3 = this.y1 + height;
  this.x4 = this.x3 - this.w;
  this.y4 = this.y3;
  this.sp = 0.5;
  this.fade = fade;
  this.color = [0, 255, 0];
  this.display = function() {
    noStroke();
    if (this.fade === 1) {
      fill(this.color[0], this.color[1], this.color[2], 50);
    } else {
      fill(this.color[0], this.color[1], this.color[2], 80);
    }
    quad(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
  };
  this.move = function() {
    this.x1 += this.sp;
    this.x2 += this.sp;
    this.x3 += this.sp;
    this.x4 += this.sp;
  };
}
