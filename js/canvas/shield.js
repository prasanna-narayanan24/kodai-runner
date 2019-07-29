function Shield(sarbath, obstacle) {
  this.x = 0;
  this.xPos = setPositionX(obstacle);
  this.y = -100;
  this.speed = 5;
  this.size = 10;
  this.maxSize = 50;
  this.sprite = sarbath;

  this.show = () => {
    push();
    translate(this.x, this.y, 250);
    texture(this.sprite);
    plane(this.size);
    pop();
  }

  this.update = () => {
    this.y += this.speed;
    if (this.x == this.xPos) {
      // good morning
    } else if (this.x > this.xPos || this.x < this.xPos) {
      this.x += this.x - this.xPos > 0 ? -2.5 : 2.5
    }
    if (this.size < this.maxSize) this.size = (this.size + 1);
  }

  this.collected = runner => {
    // return (!runner.isJumping()) && (this.y == runner.base - this.size || this.y == runner.base + this.size)  && runner.x == this.x
    return (!runner.isJumping()) && (runner.base - this.y <= this.size && runner.base - this.y >= 0) && this.x == runner.x;
  }

  this.offscreen = () => {
    return this.y == 220;
  }
}

setXPosition = obstacle => {
  let x = [-100, 0, 100]
  indexX = x.indexOf(obstacle.x)
  if (indexX >= 0) {
    x.splice(indexX, 1)
  }
  return x[Math.floor(random(0, x.length))]
}