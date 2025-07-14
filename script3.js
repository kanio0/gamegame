//Объявление всех структур
var Game = {
    width: 1280,
    height: 720,
    bg: new Image(),
    gravityE: 0.25,
    gravity: 1,
    groundLevel: 530,
}

var Hero = {
    x: 20,
    y: 530,
    width: 60,
    height: 80,
    lives: 15,
    velocityY: 0,
    speed: 5,
    jumpPower: -15,
    onGround: true,
    score: 0,
    IsRight: true,
    img1: new Image(),
    img: new Image(),
}

var Enemy = {
    x: 1100,
    y: 500,
    width: 100,
    height: 120,
    lives: 3,
    isJump: false,
    yDirection: 0,
    jumpPower: -12,
    img: new Image(),
}

var snowyEnemy = {
    width: 15,
    height: 15,
    x: 1200,
    y: 600,
    snow: new Image(),
    snowspeed: -(Math.floor(Math.random() * 5 + 5)),
    fly: false,
    fading: false,
    alpha: 1,
}

var snowyHero = {
    width: 15,
    height: 15,
    x: Hero.x,
    y: Hero.y + Hero.y,
    snow: new Image(),
    snowspeed: Math.floor(Math.random() * 5 + 5),
    fly: false,
    fading: false,
    alpha: 1,
}

//необходимые штучки
var keys = {};
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = Game.width;
canvas.height = Game.height;

//Снежкинки
let snowflakes = [];
for (let i = 0; i < 100; i++) {
    snowflakes.push({
        x: Math.random() * Game.width,
        y: Math.random() * Game.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5
    });
}

//Фото
Game.bg.src = 'img/bg.jpg';
Hero.img.src = 'img/hero_sprite.png';
Hero.img1.src = 'img/hero2.png';
Enemy.img.src = 'img/enemy.png';
snowyHero.snow.src = 'img/snow.png';
snowyEnemy.snow.src = 'img/snow.png';
let imgload = 0;

Hero.img.onload = checkload;
Hero.img1.onload = checkload;
Game.bg.onload = checkload;
Enemy.img.onload = checkload;
snowyHero.snow.onload = checkload;
snowyEnemy.snow.onload = checkload;

function checkload() {
    imgload++
    if (imgload == 6) {
        start()
    }
}

//Отрисовка фрейма
function drawFrame() {
    canvasContext.clearRect(0, 0, Game.width, Game.height);
    drawBg();
    drawEnemy();
    drawHero();
    jumpEnemy();
    requestAnimationFrame(animateEnemy);
    updateHero();
    requestAnimationFrame(snowyplay);
    requestAnimationFrame(snowyplayE);
    drawSnowflakes();
    scoredraw();
    drawlives();
    if (Hero.lives <= 0) {
        end()
    }
    if (Hero.score === 10) {
        //Новая страница
        alert('You win!')
    }
}

function drawSnowflakes() {
    canvasContext.fillStyle = "white";
    for (let flake of snowflakes) {
        canvasContext.beginPath();
        canvasContext.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        canvasContext.fill();
        flake.y += flake.speed;
        if (flake.y > 600) {
            flake.y = 0;
            flake.x = Math.random() * Game.width;
        }
    }
}

function drawBg() {
    if (Game.bg) {
        canvasContext.drawImage(Game.bg, 0, 0);
    }
}

function drawHero() {
    if (Hero.IsRight) {
        canvasContext.drawImage(Hero.img, Hero.x, Hero.y, Hero.width, Hero.height);
    } else {
        canvasContext.drawImage(Hero.img1, Hero.x, Hero.y, Hero.width, Hero.height);
    }
}


function drawEnemy() {
    if (Enemy.img) {
        canvasContext.drawImage(Enemy.img, Enemy.x, Enemy.y, Enemy.width, Enemy.height);
    }
}

function drawEnemySnow() {
    if (!snowyEnemy.fly && !snowyEnemy.fading) {
        return;
    }
    canvasContext.save();
    canvasContext.globalAlpha = snowyEnemy.alpha;
    canvasContext.drawImage(snowyEnemy.snow, snowyEnemy.x, snowyEnemy.y + 50, snowyEnemy.width, snowyEnemy.height)
    canvasContext.restore();
}

function drawHeroSnow() {
    if (!snowyHero.fly && !snowyHero.fading) {
        return;
    }
    canvasContext.save();
    canvasContext.globalAlpha = snowyHero.alpha;
    canvasContext.drawImage(snowyHero.snow, snowyHero.x, snowyHero.y, snowyHero.width, snowyHero.height);
    canvasContext.restore();
}


function scoredraw() {
    canvasContext.fillStyle = 'white'
    canvasContext.font = "48px serif";
    canvasContext.textAlign = "left";
    canvasContext.fillText("Score: " + Hero.score, 20, 50);
}

function drawlives() {
    canvasContext.fillStyle = 'red'
    canvasContext.font = "48px serif";
    canvasContext.textAlign = "left";
    canvasContext.fillText("Lives: " + Hero.lives, 20, 100);
}

//движение героя
function updateHero() {
    if (keys['ArrowRight'] || keys['KeyD']) {
        Hero.x += Hero.speed;
        Hero.isMoving = true;
        Hero.IsRight = true;
    } else if (keys['ArrowLeft'] || keys['KeyA']) {
        Hero.x -= Hero.speed;
        Hero.isMoving = true;
        Hero.IsRight = false;
    }

    Hero.y += Hero.velocityY;
    Hero.velocityY += Game.gravity;
    let onAnyPlatform = false;
    if (Hero.y >= Game.groundLevel) {
        Hero.y = Game.groundLevel;
        Hero.velocityY = 0;
        onAnyPlatform = true;
    }
    if (Hero.x < 0) {
        Hero.x = 0;
    }
    if (Hero.x + Hero.width > Game.width) {
        Hero.x = Game.width - Hero.width;
    }
    Hero.onGround = onAnyPlatform;
}

//логика прыжка злодея
function jumpEnemy() {
    if (!Enemy.isJump) {
        Enemy.isJump = true;
        Enemy.yDirection = Enemy.jumpPower;
    }
}

function animateEnemy() {
    if (Enemy.isJump) {
        Enemy.y += Enemy.yDirection;
        Enemy.yDirection += Game.gravityE;
        if (Enemy.y >= 500) {
            Enemy.y = 500;
            Enemy.isJump = false;
        }
    }

}

//полет снежка героя
function updsnowy() {
    if (!snowyHero.fly) {
        return;
    }
    snowyHero.x += snowyHero.snowspeed;
    if (snowyHero.x + snowyHero.width > Game.width) {
        snowyHero.fly = false;
        snowyHero.fading = true;
        fadeSnowball();
        return;
    }
    if (
        snowyHero.y + snowyHero.height > Enemy.y &&
        snowyHero.y < Enemy.y + Enemy.height &&
        snowyHero.x + snowyHero.width > Enemy.x &&
        snowyHero.x < Enemy.x + Enemy.width
    ) {
        snowyHero.fly = false;
        Hero.score += 1;
        snowyHero.fading = true;
        fadeSnowball();
        return;
    }
}

function fadeSnowball() {
    if (!snowyHero.fading) {
        return;
    }
    drawHeroSnow();
    snowyHero.alpha -= 0.05;
    snowyHero.width *= 0.96;
    snowyHero.height *= 0.96;
    if (snowyHero.alpha <= 0.05) {
        snowyHero.fading = false;
        snowyHero.fly = false;
        snowyHero.alpha = 1;
        snowyHero.width = 20;
        snowyHero.height = 20;
        return;
    }
    requestAnimationFrame(fadeSnowball);
}


function snowyplay() {
    if (!snowyHero.fly)
        return;
    drawHeroSnow();
    updsnowy();
}

//полет снежка злодея
function updsnowyE() {
    if (!snowyEnemy.fly)
        return;
    snowyEnemy.x += snowyEnemy.snowspeed;
    if (snowyEnemy.x <= 0) {
        snowyEnemy.x = 0;
        snowyEnemy.fading = true;
        fadeSnowballE();
        return;
    }
    if ((snowyEnemy.y + snowyEnemy.width > Hero.y - 10) &&
        (snowyEnemy.y - snowyEnemy.width < Hero.y + Hero.height - snowyEnemy.height) &&
        (snowyEnemy.x + snowyEnemy.width > Hero.x) &&
        (snowyEnemy.x - snowyEnemy.width < Hero.x + Hero.width - snowyEnemy.width)) {
        snowyEnemy.fly = false;
        Hero.lives -= 1;
        snowyEnemy.fading = true;
        fadeSnowballE();
        console.log(1)
        return;
    }
}

function fadeSnowballE() {
    if (!snowyEnemy.fading) {
        return;
    }
    drawEnemySnow();
    snowyEnemy.alpha -= 0.05;
    snowyEnemy.width *= 0.96;
    snowyEnemy.height *= 0.96;
    if (snowyEnemy.alpha <= 0.05) {
        snowyEnemy.fading = false;
        snowyEnemy.fly = false;
        snowyEnemy.alpha = 1;
        snowyEnemy.width = 20;
        snowyEnemy.height = 20;
        return;
    }
    requestAnimationFrame(fadeSnowballE);
}

function snowyplayE() {
    if (!snowyEnemy.fly)
        return;
    drawEnemySnow();
    updsnowyE();
}

function snowyyE() {
    if (!snowyEnemy.fly) {
        snowyEnemy.x = 1200
        snowyEnemy.y = 510
        snowyEnemy.snowspeed = -(Math.floor(Math.random() * 5 + 5));
        snowyEnemy.fly = true;
        snowyplayE();
    }
}


//events
document.addEventListener("keydown", function (e) {
    keys[e.code] = true;
    if ((e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === ' ') && Hero.onGround) {
        Hero.velocityY = Hero.jumpPower;
        Hero.onGround = false;
    }
});
document.addEventListener("keyup", function (e) {
    keys[e.code] = false;
    Hero.isMoving = false;
});

function onCanvasMouseDown(event) {
    if (!snowyHero.fly && !snowyHero.fading) {
        snowyHero.x = Hero.x + Hero.width / 2;
        snowyHero.y = Hero.y + Hero.height / 2;
        snowyHero.snowspeed = Math.floor(Math.random() * 3 + 7);
        snowyHero.width = 20;
        snowyHero.height = 20;
        snowyHero.alpha = 1;
        snowyHero.fly = true;
        snowyHero.fading = false;
        snowyplay();
    }
}

//Музыка
var muzStart = false;
var muz = new Audio('audio/muz.mp3')
muz.volume = 0.2;

function playMuz() {
    if (muzStart) return;
    muzStart = true
    muz.addEventListener('ended', function () {
        muz.play()
    });
    muz.addEventListener('canplaythrough', function () {
        muz.play()
    }, false);
    muz.play();
}



function initEventListeners() {
    window.addEventListener('mousedown', onCanvasMouseDown);
    window.addEventListener('click', () => {
        playMuz();
    }, { once: true });
}


//Запуск
let gameLoop;
let enemyThrow;

function start() {
    initEventListeners();
    gameLoop = setInterval(drawFrame, 1000 / 60);
    enemyThrow = setInterval(snowyyE, 1000);
}

//конец игры
function end(){
    clearInterval(gameLoop);  
    clearInterval(enemyThrow);  
    canvasContext.fillStyle = "rgba(0,0,0,0.6)";
    canvasContext.fillRect(0, 0, Game.width, Game.height);
    canvasContext.fillStyle = "white";
    canvasContext.font = "48px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText("Попробуй заново!", Game.width / 2, Game.height / 2);
    setTimeout(resetGame, 3000);
}

function resetGame() {
    Hero.x = 20;
    Hero.y = 530;
    Hero.lives = 13;
    Hero.isJump = false;
    Hero.yDirection = 0;
    Enemy.x = 1100;
    snowyHero.fly = false;
    snowyEnemy.fly = false;
    Hero.score = 0;
    start();
}