var bulle = [];

function setup() {
  createCanvas(600, 500);
	bulleMouse = new BulleMouse();
	for (var i = 0; i < 10; i++) {
		bulle[i] = new Bulle(random(width), random(height), random(10,40), i);
	}
}

function draw() {
  background(0);
	for (var i = 0; i < bulle.length; i++) {
		bulleMouse.intersects(bulle[i]);
		for (var j = 0; j < bulle.length; j++) {
			if (i < j) {
				bulle[i].intersects(bulle[j]);
			}
		}
		bulle[i].move();
	  bulle[i].display();
		
		bulleMouse.display();
		stroke(255,255,255)
		if (i < bulle.length - 1) {
		  //line(bulle[i].x, bulle[i].y, bulle[i+1].x, bulle[i + 1].y);
		} else {
		  //line(bulle[i].x, bulle[i].y, bulle[0].x, bulle[0].y);
		}
	}
}

function BulleMouse() {
  this.x = mouseX;
	this.y = mouseY;
	this.r = 30;
	this.color = [255, 255, 255];
	this.intersects = function(obj) {
		var di = dist(mouseX, mouseY, obj.x, obj.y);
		if(di < (this.r + obj.r)) {
			if(mouseX < obj.x) {
				obj.dX = 1;
			}
			if(mouseX > obj.x) {
				obj.dX = -1;
			}
			if(mouseY < obj.y) {
				obj.dY = 1;
			}
			if(mouseY > obj.y) {
				obj.dY = -1;
			}
			this.color = obj.color;
		}
	}
	this.display = function() {
		fill(this.color[0], this.color[1], this.color[2]);
		noStroke();
		ellipse(mouseX, mouseY, (this.r * 2));
	}
}

function Bulle(x, y, r, i) {
	this.index = i;
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
			this.updateColor()
			obj.updateColor()
		}
	}
	this.move = function() {
		// X
		this.x += this.dX * this.v;
		
		if (this.x > (width - this.r)) {
			this.x = (width - this.r);
		}
		if (this.x < this.r) {
			this.x = this.r;
		}
		
		if (this.x >= (width - this.r) || this.x <= this.r) {
			this.dX *= -1;
			this.updateColor()
		}
		
		// Y
		this.y += this.dY * this.v;
		
		if (this.y > (height - this.r)) {
			this.y = (height - this.r);
		}
		if (this.y < this.r) {
			this.y = this.r;
		}
		if (this.y >= (height - this.r) || this.y <= this.r) {
			this.dY *= -1;
			this.updateColor()
		}
	}
	this.display = function() {
		fill(0);
		strokeWeight(2);
		stroke(this.color[0], this.color[1], this.color[2]);
		ellipse(this.x, this.y, (this.r * 2));
		fill(255);
		textSize(18);
		textAlign(CENTER, CENTER);
		text(this.index + 1, this.x , this.y)
	}
}
