function EndGameScreen() {
  this.show = () => {
    push();
    fill(0, 0, 0, 70)
    translate(-width, -height, 600);
    rect(width / 2, height / 2, width, height);
    fill(255)
    textAlign(CENTER);
    textSize(40);
    text("Game Over", 100, 100);
    pop();
  }
}