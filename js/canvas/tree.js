function Tree(tree) {
  this.x = Math.ceil(random(0, 100));
  this.y = Math.ceil(random(0, height));
  this.tree = tree;

  this.show = () => {
    push();
    translate(-width/2, -height/2);
    translate(this.x, this.y);
    noStroke();
    rotateY(-PI/6);
    texture(this.tree);
    plane(100)
    // this.y += 10;
    pop();
  }

  this.update = () => {
  }
}