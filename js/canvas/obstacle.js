function Obstacle(coconuts) {
  this.x = 0;
  this.xPos = setPositionX();
  this.startMove = false;
  this.y = -130;
  this.speed = 10;
  this.size = 0;
  this.coconuts = coconuts;
  let angle = 0;

  this.show = (tree) => {
    push();
    fill("#e15f41");
    translate(this.x, this.y, 250);
    rotate(angle);
    texture(this.coconuts[frameCount % this.coconuts.length]);
    plane(this.size);
    pop();
  }

  this.update = () => {
    this.y += this.speed;
    if (this.size < 50) this.size = (this.size + 2);
    if (this.x == this.xPos) console.log();
    else if (this.x > this.xPos || this.x < this.xPos) {
      this.x += this.x - this.xPos > 0 ? -5 : 5
    }
    // if(this.x != this.xPos) this.x = this.x + this.xPos > 0 ? 2 : -2 
    angle += 5;
  }

  this.hit = (runner, isShieldActive) => {
    if(isShieldActive) return false;
    return (!runner.isJumping()) && (this.y == runner.base - 20 || this.y == runner.base + 20) && runner.x == this.x
  }

  this.offscreen = () => {
    return this.y == 220;
  }
}

setPositionX = () => {
  return [-100, 0, 100][Math.floor(random(0, 3))]
}