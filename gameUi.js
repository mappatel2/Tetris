function drawUi(){
  drawPreviewBag();
  drawScoreText();
}

function drawScoreText() {
  noStroke();
  strokeWeight(1);
  rectMode(CENTER);
  
  textSize(20);
  fill(255, 0, 0);
  textAlign(CENTER);
  text("SCORE", block_size * 15.1, block_size * 17.25);

  fill(0);
  stroke('#fff')
  strokeWeight(3.5)
  rect(block_size * 15.1, block_size * 18.5, 150, 35, 15);

  fill(255);
  textSize(17.5);
  noStroke()
  textAlign(CENTER);
  text(current_score, block_size * 15.1, block_size * 18.7);
}