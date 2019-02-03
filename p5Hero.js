/**
 * --------------------------------------------------------------------------
 * p5Hero
 * A Guitare Hero style game make with p5.js
 * --------------------------------------------------------------------------
 */
var colorBG = [80, 80, 80] //dark gray
var color0 = [255, 255, 255] //white
var color1 = [255, 0, 255]; //magenta
var color2 = [0, 0, 255]; //blue
var color3 = [0, 255, 0]; //green

var noteSpeed = 5; //Number of px up per frame
var noteRandMin = 10;
var noteRandMax = 50;
var noteFreqMax = 4; //Notes per sec max

var frameCounted = 0;
var hit = 0;
var accuracy = 0;
var shot = 0;
var totalNotes = 20; //Number of notes per game
var notesCount = 0;
var score = 0;

var gameState = "title"; // title / play / score
var notes = [];
var target;

var diags = [];
var diagSpeed = 0.5;
var diagWidth = 20;
var diagFade = 1;
var diagColor = color1;

/**
 * SETUP
 * Run once at begining
 */
function setup() {
  createCanvas(400, 560);
  
  //Fill background with diagonals at start
  for (var i = -20; i < 2*width; i+=diagWidth) {
    diags.push(new Diag(i, diagFade));
    diagFade = - diagFade;
  }
}

/**
 * DRAW
 * Run 60 times per second
 */
function draw() {
  clear();
  background(0);
  
  // Draw background
  if (frameCount % (diagWidth / diagSpeed) === 0) {
    diags.push(new Diag(-diagWidth, diagFade));
    diagFade = - diagFade;
  }
  //Move diagonales
  for (var i = 0; i < diags.length; i++) {
    diags[i].move();
    diags[i].display();
    //Remove unused diagonales
    if (diags[i].x1 > width*4) {
      diags.splice(i, 1);
    }
  }
  
  // TITLE state
  if (gameState == "title") {
    setBgMulticolor();
    
    textSize(20);
    text("PRESS SPACE", width / 2, height - 100)
    
    strokeWeight(1);
    stroke(255);
    fill(0,0,0,100);
    rectMode(CENTER);
    rect(width/2, height/3, 350, 100);
    
    noStroke();
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("p5 Hero", width / 2, height/3);
  }
  
  // SCORE state
  if (gameState == "score") {
    setBgMulticolor();
    
    noStroke();
    textSize(22);
    text("PRESS SPACE", width / 2, height - 100)

    fill(255);
    textAlign(CENTER);
    textSize(16);

    //Hits
    fill(255);
    text("Hits: " + hit + "/" + notesCount, width / 2, 20);

    //Accuracy
    accuracy = int(100 * hit / shot);
    text("Accuracy: " + accuracy + "%", width / 2, 40);
    
    //Score
    score = 1000 * (((100 * hit) / totalNotes) + accuracy) / 200;
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Score", width / 2, height/3);
    text(score, width / 2, height/3 + 40);
  }
  
  // PLAY state
  if (gameState == "play") {
    //Set background color
    updateDiagColor(colorBG);
    diagColor = colorBG;
    
    //Draw target
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
        if (notes[i]) {
          if (notes[i].intersects(target)){
            target.strColor = notes[i].color;
            if (notes[i].key === 0) {
              target.strColorL = notes[i].color;
              target.strColorB = notes[i].color;
            }
            if (notes[i].key === 1) {
              target.strColorR = notes[i].color;
              target.strColorB = notes[i].color;
            }
            if (notes[i].key === 2) {
              target.strColorL = notes[i].color;
              target.strColorR = notes[i].color;
              target.strColorB = notes[i].color;
            }
            target.display();
          }
          notes[i].display();
        }
      }
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
  this.dirX = 0;
  this.dirY = 1;
  this.key = int(random(0, 3));
  this.txt = "";
  this.color = [0, 0, 0];

  this.setColor = function() {
    if (this.key === 0) {
      this.txt = "←";
      this.color = color1;
    }
    if (this.key === 1) {
      this.txt = "→";
      this.color = color2;
    }
    if (this.key === 2) {
      this.txt = "↔";
      this.color = color3;
    }
  };

  this.display = function() {
    this.setColor();
    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    circle(this.x, this.y, this.r);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text(this.txt, this.x, this.y);
  };

  this.move = function() {
    //Move the note
    this.y -= noteSpeed * this.dirY;
    this.x += 30 * this.dirX;
    
    //Remove unused notes
    if (this.y < -this.r || this.x < -this.r || this.x > width + this.r) {
      notes.splice(this.index, 1);
      if (notes.length === 0 && notesCount === totalNotes) {
        gameState = "score";
      }
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
  this.fillColor = [];
  this.strColor = color0;
  this.strColorL = color0;
  this.strColorR = color0;
  this.strColorB = color0;
  this.display = function() {
    strokeWeight(3);
    //vertical line top
    stroke(255);
    line(width / 2, 0, width / 2, (height / 4) - this.r);
    //vertical line bottom
    stroke(this.strColorB[0], this.strColorB[1], this.strColorB[2]);
    line(width / 2, (height / 4) + this.r, width / 2, height);
    //left horizontal line
    stroke(this.strColorL[0], this.strColorL[1], this.strColorL[2]);
    line(0, height / 4, (width / 2) - this.r, height / 4);
    //right horizontal line
    stroke(this.strColorR[0], this.strColorR[1], this.strColorR[2]);
    line((width / 2) + this.r, height / 4, width, height / 4);
    //target circle
    stroke(this.strColor[0], this.strColor[1], this.strColor[2]);
    noFill();
    circle(this.x, this.y, this.r);
  }
}

/**
 * DIAG constructor
 * background diagonals
 */
function Diag(x, fade) {
  this.w = diagWidth;
  this.x1 = x;
  this.y1 = 0;
  this.x2 = this.x1 + this.w;
  this.y2 = this.y1;
  this.x3 = this.x2 - width + this.w;
  this.y3 = this.y1 + height;
  this.x4 = this.x3 - this.w;
  this.y4 = this.y3;
  this.sp = diagSpeed;
  this.fade = fade;
  this.color = diagColor;
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

function updateDiagColor(color) {
  for (var i = 0; i < diags.length; i++) {
    diags[i].color = color;
  }
}

function setBgMulticolor() {
  if (frameCount % 60 === 0) {
    var rdm = int(random(1,4));
    switch (rdm){
      case 1:
        updateDiagColor(color1);
        diagColor = color1;
        break;
      case 2:
        updateDiagColor(color2);
        diagColor = color2;
        break;
      case 3:
        updateDiagColor(color3);
        diagColor = color3;
        break;
    }
  }
}

/**
 * KEYPRESSED
 * run everytime a key is pressed
 */
function keyPressed() {  
  if (gameState == "play") {
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
  
  if (gameState == "title" || gameState == "score") {
    if (keyCode === 32) {
      frameCounted = 0;
      hit = 0;
      accuracy = 0;
      shot = 0;
      notesCount = 0;
      gameState = "play";
    }
  }
}
