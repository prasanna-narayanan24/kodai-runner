let cols, rows;
let scl = 30;
let w = 350;
let h = 1600;
let flying = 0;
let obstacles = [];
let coconuts = [];
let shield = null;
let _frameRate = 20;
let isStopped = false;
let sarbath = [];
let score = 0;
let health = 100;
let hiScore = window.localStorage.getItem('hi-score');
let treeSprite;
let trees = [];
let isShieldActive = false;

function preload() {
    spritesheet = loadImage("./assets/img/male-run-cycle.png")
    for (let i = 1; i <= 5; i++)
        coconuts.push(loadImage(`./assets/img/coco/coconut${i}.png`))
    sarbathSprite = loadImage("./assets/img/Water.png");
    shieldSprite = loadImage("./assets/img/shield.png");
}

let terrain = [];

function setup() {
    createCanvas(600, windowHeight, WEBGL).parent("canvas");
    cols = w / scl;
    rows = h / scl;

    runner = new Runner();
    obstacles.push(new Obstacle(coconuts));

    for (let x = 0; x < cols; x++) {
        terrain[x] = []
        for (let y = 0; y < rows; y++) {
            terrain[x][y] = 0;
        }
    }

    runner.loadAnimations(spritesheet);
}

function draw() {

    frameRate(_frameRate);
    score = frameCount;

    if (frameCount % 10 == 0) {
        health -= 1
    }

    if (isShieldActive) {
        background("#111");
    } else {
        background("#34a6ff");
    }


    flying -= 0.05;
    var yoff = flying;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y] = map(noise(xoff, yoff), 0, 1.5, -50, 50);
            xoff += 0.1;
        }
        yoff += 0.1;
    }


    push();

    //TERRAIN
    stroke("#928148");
    // noStroke();

    if (isShieldActive) {
        fill("#999")
    } else {
        fill("#f0cb4a");
    }

    translate(0, 50)
    rotateX(PI / 3);
    translate(-w / 2, -h / 2);

    for (let y = 0; y < rows - 1; y++) {
        beginShape(TRIANGLE_STRIP);
        for (let x = 0; x < cols; x++) {
            // rect(x*scl,y*scl,scl, scl);
            vertex(x * scl, y * scl, terrain[x][y])
            vertex(x * scl, (y + 1) * scl, terrain[x][y + 1])
        }
        endShape();
    }
    pop();

    // translate(2, h-300, 100)

    runner.update();
    runner.show();

    // translate(w/2, h/2);

    if (shield) {
        shield.update();
        shield.show();

        if (shield.collected(runner)) {
            isShieldActive = true;
            shield = null;
            setTimeout(() => {
                isShieldActive = false;
            }, 5000);
        }

        if (shield && shield.offscreen()) {
            shield = null;
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].show();
        obstacles[i].update();

        if (obstacles[i].hit(runner, isShieldActive)) {
            stopGame();
        }

        if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1)
        }
    }

    for (let i = 0; i < sarbath.length; i++) {
        let isCollected = false;
        sarbath[i].show();
        sarbath[i].update();

        if (sarbath[i].collected(runner)) {
            isCollected = true;
            sarbath.splice(i, 1)
            health = (health + 10) % 100;
        }

        if (!isCollected) {
            if (sarbath[i].offscreen()) {
                sarbath.splice(i, 1)
            }
        }
    }

    if (frameCount % 20 == 0) obstacles.push(new Obstacle(coconuts))

    if (health <= 30) {
        if (frameCount % 100 == 0) {
            sarbath.push(new Sarbath(sarbathSprite, obstacles[obstacles.length - 1]));
        }
    } else if (frameCount % 150 == 0) sarbath.push(new Sarbath(sarbathSprite, obstacles[obstacles.length - 1]));

    if (frameCount % 200 == 0) {
        _frameRate = (_frameRate + 5) % 60;
        if (_frameRate <= 10) _frameRate = 60
    }

    if (frameCount % 133 == 0) {
        shield = new Shield(shieldSprite, obstacles[obstacles.length - 1])
    }

    if (health <= 0) stopGame();

    // Stats Updation

    var scoreElement = document.getElementById('spitGameScore');
    var healthStat = document.getElementById('spitRunnerHealth');
    var highScoreEl = document.getElementById('hi-score');

    scoreElement.innerHTML = score;
    highScoreEl.innerHTML = hiScore;
    if (score > hiScore) highScoreEl.innerHTML = score;

    if (health > 75) {
        removeClasses(healthStat);
        addClass(healthStat, 'bg-primary');
        // healthStat.classList.add('bg-primary');
    }

    if (health <= 75) {
        removeClasses(healthStat);
        addClass(healthStat, 'bg-info')
    }

    if (health <= 40) {
        removeClasses(healthStat);
        addClass(healthStat, 'bg-warning')
    }

    if (health <= 20) {
        removeClasses(healthStat);
        addClass(healthStat, 'bg-danger')
    }

    healthStat.innerHTML = health + '%'
    healthStat.style.width = health + '%';
}

function stopGame() {
    isStopped = true;
    new EndGameScreen().show();
    if (hiScore == "null" || score > hiScore) window.localStorage.setItem('hi-score', score);
    noLoop();
}

function resetGame() {
    isStopped = false;
    frameCount = 0
    score = frameCount;
    _frameRate = 20;
    health = 100;
    hiScore = window.localStorage.getItem('hi-score');
    loop();
}

function removeClasses(el) {
    el.classList.remove('bg-warning');
    el.classList.remove('bg-danger');
    el.classList.remove('bg-info');
}

function addClass(el, className) {
    el.classList.add(className);
}

function keyPressed() {
    runner.move(keyCode == LEFT_ARROW, keyCode == RIGHT_ARROW)
    if (keyCode == 16 || keyCode == UP_ARROW) {
        runner.jump();
    }

    if (keyCode == 32) {
        if (isStopped) window.location.reload();
    }
}