const colors = {
  "ROUGE":[255,0,0],
  "VERT":[34,139,34],
  "BLEU":[0,0,255],
  "JAUNE":[255,215,0],
  "ORANGE":[255,120,0],
  "NOIR":[0,0,0],
  "GRIS":[0,0,255],
  "MAUVE":[147,112,216],
  "GRIS":[150,150,150],
  "ROSE":[255,105,180],
  "BRUN":[139,69,19]
}
const colorsSize = Object.keys(colors).length;

var cardCPU
var cardPlayer

function setup() {
  createCanvas(380, 567)
  
  cardCPU = pickCard()
  cardPlayer = pickCard()
}


function draw() {
 clear()
 background(0)
 
 cardPlayer.x = width/4
 cardPlayer.drawCard()
 cardCPU.x = width/2 + width/4
 cardCPU.drawCard()

 if (checkMatch(cardPlayer, cardCPU)) {
   fill(255)
   text("match!", width/2, height/2)
 }
}

class Card {
  constructor(txt, color, x, y) {
    this.txt = txt
    this.color = color
    this.x = x
    this.y = y
  }
  drawCard() {
    fill(255)
    rectMode(CENTER)
    rect(this.x, this.y,140,200,10)
    textAlign(CENTER, CENTER)
    textSize(30)
    textStyle(BOLD)
fill(this.color[0],this.color[1],this.color[2])
    text(this.txt,this.x,this.y)
  }
}

function checkMatch(c1,c2) {
  if (
    c1.txt === c2.txt ||
    c1.color === c2.color ||
    colors[c1.txt] === c2.color ||
    colors[c2.txt] === c1.color
  ) {
    return true
  }
}

function pickCard() {
  let indexName = int(random(colorsSize))
  let indexColor = int(random(colorsSize))
  let card = new Card(Object.keys(colors)[indexName],Object.values(colors)[indexColor],width/2,height/4)
  return card
}