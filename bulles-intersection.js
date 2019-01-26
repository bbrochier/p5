var bulle = [];

function setup() {
  createCanvas(400, 400);
	for (var i = 0; i < 10; i++) {
		bulle[i] = new Bulle(random(300), random(300), random(10,30));
	}
}

function draw() {
  background(220);
	for (var i = 0; i < bulle.length; i++) {
		for (var j = 0; j < bulle.length; j++) {
			if (i !== j) {
				bulle[i].intersects(bulle[j]);
			}
		}
		bulle[i].move();
	  bulle[i].display();
		stroke(1)
		if (i < bulle.length - 1) {
		  line(bulle[i].x, bulle[i].y, bulle[i+1].x, bulle[i + 1].y);
		} else {
		  line(bulle[i].x, bulle[i].y, bulle[0].x, bulle[0].y);
		}
	}
}

function Bulle(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.dX = 1;
	this.dY = 1;
	this.v = 2;
	this.color = [random(255), random(255), random(255)]
	this.updateColor = function() {
		for (i=0; i < 3; i++) {
			this.color[i] = random(255);
		}
	}
	this.intersects = function(obj) {
		var di = dist(this.x, this.y, obj.x, obj.y);
		if(di < (this.r + obj.r)) {
			if(this.x < obj.x) {
				this.dX = -1;
				obj.dX = 1;
			}
			if(this.x > obj.x) {
				this.dX = 1;
				obj.dX = -1;
			}
			if(this.y < obj.y) {
				this.dY = -1;
				obj.dY = 1;
			}
			if(this.y > obj.y) {
				this.dY = 1;
				obj.dY = -1;
			}
		}
	}
	this.move = function() {
		// X
		this.x += this.dX * this.v;
		
		if (this.x > (400 - this.r)) {
			this.x = (400 - this.r);
		}
		if (this.x < this.r) {
			this.x = this.r;
		}
		
		if (this.x >= (400 - this.r) || this.x <= this.r) {
			this.dX *= -1;
			this.updateColor()
		}
		
		// Y
		this.y += this.dY * this.v;
		
		if (this.y > (400 - this.r)) {
			this.y = (400 - this.r);
		}
		if (this.y < this.r) {
			this.y = this.r;
		}
		if (this.y >= (400 - this.r) || this.y <= this.r) {
			this.dY *= -1;
			this.updateColor()
		}
	}
	this.display = function() {
    noStroke()
		fill(this.color[0], this.color[1], this.color[2]);
		ellipse(this.x, this.y, (this.r * 2));
	}
}
