stars = [];
nbStars = 200;


function setup() {
  createCanvas(380, 567);
  
  noStroke();
  fill(255);

for(var i = 0; i < nbStars; i++) {
stars.push(new Star(i));
}
}

function draw() {

  clear();
  background(0);
for(var i = 0; i < stars.length; i++) {
  stars[i].draw();
  stars[i].move();
}

}

function Star(i) {
  this.i = i;
  this.h = 3;
  this.w = 1;
  this.x = random(width);
  this.y = random(height);
  this.z = int(random(10));
  this.angle = random(-1,1);
    
  this.draw = function() {
    var thick = map(this.z, 0, 9, 1, 3);
    var col = map(this.z, 0, 9, 255, 255);
    //fill([col, col,0]);
    //strokeWeight(thick);
    //line(this.x, this.y, this.x + this.w, this.y);
    ellipse(this.x, this.y, thick)
  }

  this.move = function() {
    var speed = map(this.z, 0, 9, 1, 2)
    this.x -= speed;
    this.y += this.angle;
    if(this.x < 0 || this.y < 0 || this.y > height) {
      this.x = width + random(100);
      this.y = random(height);
      this.angle = random(-1,1);
    }
  }
}
