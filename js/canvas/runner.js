function Runner() {
  this.base = 150
  this.isJumping = false;
  this.jumpHeight = this.base - 50;
  this.x = 0;
  this.y = this.base;
  this.z = 250;
  this.isLeft = false;
  this.isRight = false;
  this.isStraight = false;
  this.animation = [];
  this.animationLeft = [];
  this.animationRight = [];
  this.direction = 0;
  this.speed = 20;
  this.gravity = 0;


  this.show = () => {
    push();
    fill("#5d4d17");
    translate(this.x, this.y, this.z);

    if (this.isJumping()) ellipse(this.isRight ? 100 : this.isLeft ? -100 : 0, this.base, 70, 150, this.z);
    if (this.isStraight) {
      this.isLeft = false;
      this.isRight = false
    }
    if (this.isRight) {
      texture(this.animationRight[this.isJumping() ? 3 : frameCount % this.animationRight.length]);
    } else if (this.isLeft) {
      texture(this.animationLeft[this.isJumping() ? 3 : frameCount % this.animationLeft.length]);
    } else {
      texture(this.animation[this.isJumping() ? 3 : frameCount % this.animation.length]);
    }
    plane(100);
    pop();
  }

  this.move = (left, right, straight = false) => {
    this.isStraight = straight;
    if ((this.x == 100 || this.x == 0) && left) {
      this.direction = -this.speed;
      this.isLeft = left;
    } else if ((this.x == -100 || this.x == 0) && right) {
      this.direction = this.speed;
      this.isRight = right;
    } else {
      // Play sound
    }
  }

  this.isJumping = () => {
    return this.y != this.base
  }

  this.loadAnimations = (spritesheet) => {
    for (let i = 0; i <= 512; i += 65) {
      this.animation.push(spritesheet.get(i, 0, 60, 70));
    }
    for (let i = 0; i <= 512; i += 65) {
      this.animationLeft.push(spritesheet.get(i, 65, 60, 70));
    }
    for (let i = 0; i <= 512; i += 65) {
      this.animationRight.push(spritesheet.get(i, 452, 60, 70));
    }
  }

  this.jump = () => {
    if (!this.isJumping()) this.gravity -= 10;
  }

  this.update = () => {
    this.x += this.direction;
    this.y += this.gravity;

    // update jump
    if (this.y <= this.jumpHeight) this.gravity = 10;
    if (this.y == this.base) this.gravity = 0;

    // update move
    if (this.x == 0 || this.x >= 100 || this.x <= -100) {
      this.isStraight = true;
      this.direction = 0;
    }
  }
}