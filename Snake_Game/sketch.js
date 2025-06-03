let s;
let enemy;
let scl = 20;
let food;
let gameOver = false;
let score = 0;

function setup() {
  createCanvas(600, 600);
  s = new Snake();
  enemy = new EnemySnake();
  frameRate(10);
  pickLocation();
}

function pickLocation() {
  let cols = floor(width / scl);
  let rows = floor(height / scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

function draw() {
  background(51);

  if (gameOver) {
    showGameOver();
    return;
  }

  // Show and update food
  fill(0, 255, 0);
  rect(food.x, food.y, scl, scl);

  // Player snake actions
  if (s.eat(food) || enemy.eat(food)) {
    pickLocation();
    score++;
  }

  s.death();
  // Enemy snake actions
  //enemy.death();
  s.update();
  s.show();


  // Enemy collision with player snake kills player
  if (checkPlayerEnemyCollision()) {
     gameOver = true;
   }

  enemy.update();
  enemy.show();

  // Enemy death and respawn message
  if (!enemy.alive) {
     showRespawningMessage();
   }

  // Display score
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
}

function checkPlayerEnemyCollision() {
  // Check if player head collides with enemy body or head
   if (!enemy.alive) return false;

  // Check enemy head vs player head
   let d = dist(s.x, s.y, enemy.x, enemy.y);
   if (d < 1) return true;

  // Check enemy tail vs player head
  for (let i = 0; i < enemy.tail.length; i++) {
    let pos = enemy.tail[i];
    let dTail = dist(s.x, s.y, pos.x, pos.y);
    if (dTail < 1) return true;
  }
  return false;
}

function showRespawningMessage() {
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);

  // Flashing effect
  if (floor(frameCount / 30) % 2 === 0) {
    text("Enemy Respawning...", width / 2, height / 2);
  }
}

function showGameOver() {
  background(0, 0, 0, 200);
  fill(255, 0, 0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2 - 40);
  textSize(24);
  text("Score: " + score, width / 2, height / 2 + 10);
  text("Press R to Restart", width / 2, height / 2 + 50);
}

function keyPressed() {
  if (!gameOver) {
    if (keyCode === UP_ARROW && s.yspeed !== 1) {
      s.dir(0, -1);
    } else if (keyCode === DOWN_ARROW && s.yspeed !== -1) {
      s.dir(0, 1);
    } else if (keyCode === RIGHT_ARROW && s.xspeed !== -1) {
      s.dir(1, 0);
    } else if (keyCode === LEFT_ARROW && s.xspeed !== 1) {
      s.dir(-1, 0);
    }
  } else {
    if (key === 'r' || key === 'R') {
      restartGame();
    }
  }
}

function restartGame() {
  gameOver = false;
  s = new Snake();
  enemy = new EnemySnake();
  score = 0;
  pickLocation();
}
