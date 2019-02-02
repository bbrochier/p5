/**
 * --------------------------------------------------------------------------
 * p5Hero
 * A Guitare Hero style game make with p5.js
 * --------------------------------------------------------------------------
 */

var noteSpeed = 5; //Number of px up per frame
var noteRandMin = 10;
var noteRandMax = 50;
var noteFreqMax = 4; //Notes per sec max

var frameCounted = 0;
var hit = 0;
var accuracy = 0;
var shot = 0;
var totalNotes = 50;
var notesCount = 0;
var lives = 3;
var notes = [];
var target;

/**
 * SETUP
 * Run once at begining
 */
function setup() {
  createCanvas(375, 560);
}

/**
 * DRAW
 * Run 60 times per second
 */
function draw() {
  background(0);
  
  //Information panel
  stroke(255);
  noFill();
  rect(10, 10, 130, 70);

  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  
  //Lives
  fill(255);
  text("Lives:", 20, 20);
  for (var i = 0; i < lives; i++) {
    fill(255, 255, 0);
    ellipse(75 + i * 20, 28, 15);
  }

  //Hits
  fill(255);
  text("Hits:", 20, 40);
  fill(255, 0, 255);
  text(hit + "/" + totalNotes, 56, 40);

  //Accuracy
  accuracy = int(100 * hit / shot);
  fill(255);
  text("Accuracy:", 20, 60);
  fill(0, 255, 0);
  text(accuracy + "%", 95, 60);

  //Target lines
  stroke(255);
  line(0, height / 4, width, height / 4);
  line(width / 2, 0, width / 2, height);
  
  //Target circle
  target = new Target();
  target.display();
  
  //Create notes randomly
  var fmodulo = int(random(noteRandMin, noteRandMax));
  if (
    frameCount - frameCounted > 60 / noteFreqMax &&
    frameCount % fmodulo === 0 &&
    notesCount < totalNotes
  ) {
    frameCounted = frameCount;
    notes.push(new Note());
    notesCount += 1;
  }

  //Display & move notes
  if (notes.length > 0) {
    for (var i = 0; i < notes.length; i++) {
      notes[i].index = i;
      notes[i].move();
      if (notes[i].intersects(target)){
        target.fillColor = notes[i].color;
        target.display();
      }
      notes[i].display();
    }
  }
}

/**
 * NOTE constructor
 */
function Note() {
  this.index = 0;
  this.r = 20;
  this.x = width / 2;
  this.y = height;
  this.missed = false;
  this.dirX = 0;
  this.dirY = 1;
  this.key = int(random(0, 3));
  this.txt = "";
  this.color = [0, 0, 0];

  this.setColor = function() {
    if (this.key === 0) {
      this.txt = "←";
      this.color = [255, 0, 255];
    }
    if (this.key === 1) {
      this.txt = "→";
      this.color = [0, 0, 255];
    }
    if (this.key === 2) {
      this.txt = "↔";
      this.color = [0, 255, 0];
    }
    if (this.key === 3) {
      this.txt = "x";
      this.color = [0, 255, 0];
    }
  };

  this.display = function() {
    this.setColor();
    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.x, this.y, this.r * 2);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text(this.txt, this.x, this.y);
  };

  this.move = function() {
    //Move the note
    this.y -= noteSpeed * this.dirY;
    this.x += 30 * this.dirX;

    //Count dead notes
    if (this.y < (target.y - target.r - this.r) && this.missed === false) {
      this.missed = true;
      lives -= 1;
    }

    //Remove unused notes
    if (this.y < -this.r || this.x < -this.r || this.x > width + this.r) {
      notes.splice(this.index, 1);
    }
  };
  
  this.intersects = function(obj) {
    if (dist(this.x, this.y, obj.x, obj.y) < obj.r) {
      return true;
    }
  };
}

/**
 * TARGET constructor
 */
function Target() {
  this.x = width / 2;
  this.y = height / 4;
  this.r = 30;
  this.fillColor = [0, 0, 0];
  this.strColor = [255, 255, 255];
  this.display = function() {
    stroke(this.strColor[0], this.strColor[1], this.strColor[2]);
    fill(this.fillColor[0], this.fillColor[1], this.fillColor[2]);
    ellipse(this.x, this.y, this.r * 2);
  }
}

/**
 * KEYPRESSED
 * run everytime a key is pressed
 */
function keyPressed() {
  shot += 1;
  if (notes.length > 0) {
    for (var i = 0; i < notes.length; i++) {
      //Test if a note is inside the target when key is pressed
      if (dist(notes[i].x, notes[i].y, target.x, target.y) < target.r) {
        if (notes[i].key === 0 && keyCode === LEFT_ARROW) {
          notes[i].dirX = -1;
          notes[i].dirY = 0;
          notes[i].y = height / 4;
          hit += 1;
        }
        
        if (notes[i].key === 1 && keyCode === RIGHT_ARROW) {
          notes[i].dirX = 1;
          notes[i].dirY = 0;
          notes[i].y = height / 4;
          hit += 1;
        }
        
        if (notes[i].key === 2 && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
          if (keyCode === LEFT_ARROW) {
            notes[i].dirX = -1; 
          }
          if (keyCode === RIGHT_ARROW) {
            notes[i].dirX = 1; 
          }
          notes[i].dirY = 0;
          notes[i].y = height / 4;
          hit += 1;
        }
      }
    }
  }
}
