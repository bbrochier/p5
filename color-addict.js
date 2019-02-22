//TODO
// high score
// game feel

const colors = {
  ROUGE: [255, 0, 0],
  VERT: [34, 139, 34],
  BLEU: [0, 0, 255],
  JAUNE: [255, 215, 0],
  ORANGE: [255, 120, 0],
  NOIR: [0, 0, 0],
  MAUVE: [147, 112, 216],
  GRIS: [150, 150, 150],
  ROSE: [255, 105, 180],
  BRUN: [139, 69, 19]
};
const colorsSize = Object.keys(colors).length;

var shake = 0;
var score = 0;
const timerInit = 20;
var timer = timerInit;
var cardCPU;
var cardPlayer;
var gameState = "title";
var particles = [];

/**
 * SETUP
 * run once at start
 */
function setup() {
  createCanvas(380, 567);

  // init cards
  resetCards();

  // init arrows
  arrowLeft = new Arrow(
    20,
    height / 2 + height / 4,
    50,
    height / 2 + height / 4 + 15,
    50,
    height / 2 + height / 4 - 15
  );
  arrowRight = new Arrow(
    width - 20,
    height / 2 + height / 4,
    width - 50,
    height / 2 + height / 4 + 15,
    width - 50,
    height / 2 + height / 4 - 15
  );
}

/**
 * DRAW
 * run 60 times/second
 */
function draw() {
  clear();
  background(0);

  // PLAY
  if (gameState === "play") {
    doShake();

    //board
    stroke(255);
    line(width / 2, 30, width / 2, height);
    fill(255);
    rectMode(CORNER);
    rect(0, 30, width, height / 2 - 30);

    //arrows
    if (keyIsDown(LEFT_ARROW)) {
      keyDownLeft = 1;
    } else {
      keyDownLeft = 0;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      keyDownRight = 1;
    } else {
      keyDownRight = 0;
    }
    arrowLeft.drawArrow(keyDownLeft);
    arrowRight.drawArrow(keyDownRight);

    //oui/non
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    textSize(14);
    fill(255);
    noStroke();
    text("NON", 30, height - 20);
    text("OUI", width - 30, height - 20);

    //score
    fill(255);
    textAlign(LEFT);
    text("SCORE: " + score, 10, 17);

    //timer
    if (frameCount % 60 === 0) {
      timer -= 1;
    }
    if (timer <= 0) {
      gameState = "score";
    }
    fill(255);
    textAlign(RIGHT);
    timerDisplay = timer;
    if (timer < 10) {
      timerDisplay = "0" + timer;
    }
    text("00:" + timerDisplay, width - 10, 17);

    //particles
    shootParticules();

    //cards
    cardPlayer.drawCard();
    cardCPU.drawCard();
  }

  // TITLE
  if (gameState === "title") {
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(34);
    fill(255);
    noStroke();
    text("Color addict trainer", width / 2, height / 2);
    textStyle(NORMAL);
    textSize(20);
    text("PRESS SPACE", width / 2, height / 2 + height / 4);
  }

  // SCORE
  if (gameState === "score") {
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(34);
    fill(255);
    noStroke();
    text("SCORE : " + score, width / 2, height / 2);
    textStyle(NORMAL);
    textSize(20);
    text("PRESS SPACE", width / 2, height / 2 + height / 4);
  }
}

/**
 * ARROW
 * class
 */
class Arrow {
  constructor(x1, y1, x2, y2, x3, y3) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
  }
  drawArrow(keyDown) {
    if (keyDown === 1) {
      fill(255);
    } else {
      noFill();
    }
    stroke(255);
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  }
}

/**
 * CARD
 * card class
 */
class Card {
  constructor(txt, color, x, y, t) {
    this.txt = txt;
    this.color = color;
    this.x = x;
    this.y = y;
    this.type = t;
  }
  drawCard() {
    fill(255);
    if (this.type === "cpu") {
      textSize(40);
      noFill();
    } else {
      textSize(30);
    }
    rectMode(CENTER);
    rect(this.x, this.y, 140, 200, 10);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    fill(this.color[0], this.color[1], this.color[2]);
    text(this.txt, this.x, this.y);
  }
}

/**
 * PARTICLE
 * particle class
 */
class Particle {
  constructor(x, y, angleMin, angleMax, dirX, dirY) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 3);
    this.r = random(1, 7);
    this.age = 0;
    this.angle = random(angleMin, angleMax);
    this.maxAge = 40;
    this.age = random(0, this.maxAge);
    this.dirX = dirX;
    this.dirY = dirY;
  }
  drawParticle() {
    this.age -= 1;
    let alpha = map(this.age, 0, this.maxAge / 2, 0, 255);
    fill(random(255), random(255), random(255), alpha);
    ellipse(this.x, this.y, this.r);
  }
  moveParticle() {
    angleMode(DEGREES);
    if (this.dirX === 0) {
      this.x += this.speed * tan(this.angle);
      this.y += this.speed * this.dirY;
    }
    if (this.dirY === 0) {
      this.x += this.speed * this.dirX;
      this.y += this.speed / tan(this.angle);
    }
  }
}

/**
 * CHECKMATCH
 * check if there is a match between 2 cards
 */
function checkMatch(c1, c2) {
  if (
    c1.txt === c2.txt ||
    c1.color === c2.color ||
    colors[c1.txt] === c2.color ||
    colors[c2.txt] === c1.color
  ) {
    return true;
  }
}

/**
 * PICKCARD
 * pick a random card
 */
function pickCard(x, y, t) {
  let indexName = int(random(colorsSize));
  let indexColor = int(random(colorsSize));
  let card = new Card(
    Object.keys(colors)[indexName],
    Object.values(colors)[indexColor],
    x,
    y,
    t
  );
  return card;
}

/**
 * RESETCARDS
 * reset cards on the board
 */
function resetCards() {
  cardCPU = pickCard(width / 2, height / 4, "cpu");
  cardPlayer = pickCard(width / 2, height / 2 + height / 4, "player");
  addParticules();
}

/**
 * SHOOTPARTICULES
 * shoot particules from the arrqy
 */
function shootParticules() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].drawParticle();
    particles[i].moveParticle();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].age <= 0) {
      particles.splice(i, 1);
    }
  }
}

/**
 * ADD PARTICULES
 * ass particules to the array
 */
function addParticules() {
  // init particles
  let cardBottomY = height / 2 + height / 4 + 70;
  let cardTopY = height / 2 + height / 4 - 70;
  let cardLeftX = width / 2 - 50;
  let cardRightX = width / 2 + 50;
  //bottom
  for (let i = 0; i < 200; i++) {
    particles.push(
      new Particle(random(cardLeftX, cardRightX), cardBottomY, -45, 45, 0, 1)
    );
  }
  //top
  for (let i = 0; i < 200; i++) {
    particles.push(
      new Particle(random(cardLeftX, cardRightX), cardTopY, -45, 45, 0, -1)
    );
  }
  //right
  for (let i = 0; i < 200; i++) {
    particles.push(
      new Particle(cardRightX, random(cardTopY, cardBottomY), 45, 135, 1, 0)
    );
  }
  //left
  for (let i = 0; i < 200; i++) {
    particles.push(
      new Particle(cardLeftX, random(cardTopY, cardBottomY), 45, 135, -1, 0)
    );
  }
}

/**
 * KEYPRESSED
 * run everytime a key is pressed
 */
function keyPressed() {
  //PLAY STATE
  if (
    gameState === "play" &&
    (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW)
  ) {
    if (
      (checkMatch(cardPlayer, cardCPU) && keyCode === RIGHT_ARROW) ||
      (!checkMatch(cardPlayer, cardCPU) && keyCode === LEFT_ARROW)
    ) {
      score += 1;
    } else {
      shake += 1;
      score -= 2;
      if (score < 0) {
        score = 0;
      }
    }

    resetCards();
  }

  //SPACE
  if (keyCode === 32) {
    gameState = "play";

    timer = timerInit;
    score = 0;

    resetCards();
  }
}

/**
 * TOUCHSTARTED
 * run once when touch sreen
 */
function touchStarted() {
  if (gameState === "play") {
    cardPlayer.x = touches[0].x;
    cardPlayer.y = touches[0].y;
  }
}

/**
 * TOUCHMOVED
 * run while touch sreen
 */
function touchMoved() {
  if (gameState === "play") {
    cardPlayer.x = touches[0].x;
    cardPlayer.y = touches[0].y;
  }
}

/**
 * TOUCHENDED
 * run when release touch from sreen
 */
function touchEnded() {
  if (gameState === "play") {
    if (
      (checkMatch(cardPlayer, cardCPU) && cardPlayer.x > width / 2) ||
      (!checkMatch(cardPlayer, cardCPU) && cardPlayer.x < width / 2)
    ) {
      score += 1;
    } else {
      score -= 2;
      shake += 1;
      if (score < 0) {
        score = 0;
      }
    }

    resetCards();
  }

  //TITLE STATE
  if (gameState === "title") {
    gameState = "play";
  }

  //SCORE STATE
  if (gameState === "score") {
    gameState = "play";
    timer = timerInit;
    score = 0;
  }
}

/**
 * DOSHAKE
 * shake the entire screen
 */
function doShake() {
  let shakeX = random(-16, 16);
  let shakeY = random(-16, 16);
  shakeX *= shake;
  shakeY *= shake;
  translate(shakeX, shakeY);
  shake = shake * 0.91;
  if (shake < 0.05) {
    shake = 0;
  }
}
