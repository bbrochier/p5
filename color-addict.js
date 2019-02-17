//TODO
// game stats
// - title
// timer
// high score
// game feel

const colors = {
  ROUGE: [255, 0, 0],
  VERT: [34, 139, 34],
  BLEU: [0, 0, 255],
  JAUNE: [255, 215, 0],
  ORANGE: [255, 120, 0],
  NOIR: [0, 0, 0],
  GRIS: [0, 0, 255],
  MAUVE: [147, 112, 216],
  GRIS: [150, 150, 150],
  ROSE: [255, 105, 180],
  BRUN: [139, 69, 19]
};
const colorsSize = Object.keys(colors).length;

var shake = 0;
var score = 0;
var cardCPU;
var cardPlayer;

function setup() {
  createCanvas(380, 567);

  cardCPU = pickCard(width / 2, height / 4 + 15, "cpu");
  cardPlayer = pickCard(width / 2, height / 2 + height / 4, "player");

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

function draw() {
  clear();
  doShake();
  //board
  background(0);
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

  //cards
  cardPlayer.drawCard();
  cardCPU.drawCard();
}

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
    rectMode(CENTER);
    rect(this.x, this.y, 140, 200, 10);
    textAlign(CENTER, CENTER);
    if (this.type === "cpu") {
      textSize(40);
    } else {
      textSize(30);
    }
    textStyle(BOLD);
    fill(this.color[0], this.color[1], this.color[2]);
    text(this.txt, this.x, this.y);
  }
}

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
 * KEYPRESSED
 * run everytime a key is pressed
 */
function keyPressed() {
  if (
    (checkMatch(cardPlayer, cardCPU) && keyCode === RIGHT_ARROW) ||
    (!checkMatch(cardPlayer, cardCPU) && keyCode === LEFT_ARROW)
  ) {
    score += 1;
  } else {
    shake += 1;
    score -= 2;
  }

  cardCPU = pickCard(width / 2, height / 4, "cpu");
  cardPlayer = pickCard(width / 2, height / 2 + height / 4, "player");
}

function touchStarted() {
  cardPlayer.x = touches[0].x;
  cardPlayer.y = touches[0].y;
}

function touchMoved() {
  cardPlayer.x = touches[0].x;
  cardPlayer.y = touches[0].y;
}

function touchEnded() {
  if (
    (checkMatch(cardPlayer, cardCPU) && cardPlayer.x > width / 2) ||
    (!checkMatch(cardPlayer, cardCPU) && cardPlayer.x < width / 2)
  ) {
    score += 1;
  } else {
    score -= 2;
    shake += 1;
  }

  cardCPU = pickCard(width / 2, height / 4, "cpu");
  cardPlayer = pickCard(width / 2, height / 2 + height / 4, "player");
}

function doShake() {
  let shakeX = random(-16, 16);
  let shakeY = random(-16, 16);

  shakeX *= shake;
  shakeY *= shake;

  translate(shakeX, shakeY);
  shake = shake * 0.95;
  if (shake < 0.05) {
    shake = 0;
  }
}
