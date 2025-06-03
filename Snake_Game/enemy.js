function EnemySnake() {
  this.x = floor(random(floor(width / scl))) * scl;
  this.y = floor(random(floor(height / scl))) * scl;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 1;
  this.tail = [];
  this.alive = true;
  this.respawnTimer = 0;

  this.eat = function(pos) {
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    }
    return false;
  };

  this.dir = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  };

  this.death = function() {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.alive = false;
        this.respawnTimer = millis();
        this.total = 0;
        this.tail = [];
      }
    }
  };

  

  this.moveAI = function() {
    // Only move if alive
    if (!this.alive) return;

    // Every 10 frames, choose new direction towards food
    if (frameCount % 10 === 0) {
      let dx = food.x - this.x;
      let dy = food.y - this.y;

      if (abs(dx) > abs(dy)) {
        this.xspeed = dx > 0 ? 1 : -1;
        this.yspeed = 0;
      } else {
        this.xspeed = 0;
        this.yspeed = dy > 0 ? 1 : -1;
      }
    }
  };

  this.update = function() {
    // Respawn logic
    if (!this.alive) {
      if (millis() - this.respawnTimer > 15000) { // 15 seconds
        this.alive = true;
        this.x = floor(random(floor(width / scl))) * scl;
        this.y = floor(random(floor(height / scl))) * scl;
        this.total = 3;
        this.tail = [];
      }
      return; // skip movement while dead
    }

    this.moveAI();

    if (this.total === this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y);

    this.x += this.xspeed * scl;
    this.y += this.yspeed * scl;

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  };

  this.show = function() {
    if (!this.alive) return;

    fill(255, 0, 0);
    for (let i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    rect(this.x, this.y, scl, scl);
  };
}
