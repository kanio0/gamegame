//Объявление всех структур
var Game = {
    width: 1280,
    height: 720,
    bg: new Image(),
    gravityE: 0.25,
    gravity: 1,
    groundLevel: 530,
    ground: new Image(),
    door: new Image(),
}

var Hero = {
    x: 20,
    y: Game.groundLevel - 40,
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

var plat = [
    { x: 120, y: 250, width: 90, height: 20 },
    { x: 1150, y: 160, width: 110, height: 20 },
    { x: 250, y: 370, width: 130, height: 20 },
    { x: 600, y: 260, width: 160, height: 20 },
    { x: 920, y: 280, width: 120, height: 20 },
    { x: 160, y: 490, width: 100, height: 20 },
    { x: 880, y: 400, width: 110, height: 20 },
    { x: 1080, y: 490, width: 70, height: 20 }
];

var gifts = [
    { x: 30, y: 120, width: 30, height: 30 },
    { x: 1090, y: 80, width: 30, height: 30 },
    { x: 670, y: 220, width: 30, height: 30 }
];

//нужные штучки
let levelCompleted = false;
var keys = {};
let showMessage = false;
let messageTimer = 0;
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = Game.width;
canvas.height = Game.height;

//Фото
Game.bg.src = 'img/fon2.jpg';
Hero.img.src = 'img/hero_sprite.png';
Hero.img1.src = 'img/hero2.png';
Game.ground.src = 'img/earth.png'
Game.door.src = 'img/door.png'
//платформы
for (let i = 0; i < plat.length; i++) {
    plat[i].img = new Image();
    plat[i].img.src = 'img/plat.png';
}
//подарочки
for (let i = 0; i < gifts.length; i++) {
    gifts[i].img = new Image();
    gifts[i].img.src = 'img/gift.png';
    gifts[i].collected = false;
    gifts[i].animationFrame = 0;
}
let imgload = 0;

Hero.img.onload = checkload;
Hero.img1.onload = checkload;
Game.bg.onload = checkload;
plat[0].img.onload = checkload;
gifts[0].img.onload = checkload;
Game.ground.onload = checkload;
Game.door.onload = checkload;

function checkload() {
    imgload++
    if (imgload == 7) {
        drawFrame()
    }
}

//Отрисовка частей фрейма
let snowflakes = [];
for (let i = 0; i < 100; i++) {
    snowflakes.push({
        x: Math.random() * Game.width,
        y: Math.random() * Game.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5
    });
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
    if (Game.ground) {
        canvasContext.drawImage(Game.ground, 0, 0)
    }
    if (Game.door) {
        canvasContext.drawImage(Game.door, 1150, 475, 70, 120)
    }
}

function drawPlatform() {
    for (let i = 0; i < plat.length; i++) {
        if (plat[i].img) {
            canvasContext.drawImage(plat[i].img, plat[i].x, plat[i].y, plat[i].width, plat[i].height);
        }
    }
}

function drawGifts() {
    for (let i = 0; i < gifts.length; i++) {
        let gift = gifts[i];
        if (gift.collected && gift.animationFrame < 20) {
            let scale = 1 + gift.animationFrame * 0.05;
            let alpha = 1 - gift.animationFrame * 0.05;
            canvasContext.save();
            canvasContext.globalAlpha = alpha;
            canvasContext.translate(gift.x + gift.width / 2, gift.y + gift.height / 2);
            canvasContext.scale(scale, scale);
            canvasContext.drawImage(gift.img, -gift.width / 2, -gift.height / 2, gift.width, gift.height);
            canvasContext.restore();
            gift.animationFrame++;
        } else if (!gift.collected) {
            canvasContext.drawImage(gift.img, gift.x, gift.y, gift.width, gift.height);
        }
    }
}

function drawHero() {
    if (Hero.IsRight) {
        canvasContext.drawImage(Hero.img, Hero.x, Hero.y, Hero.width, Hero.height);
    } else {
        canvasContext.drawImage(Hero.img1, Hero.x, Hero.y, Hero.width, Hero.height);
    }
}

//Движение героя и очень много коллизий(очеееееееееень, что я аж не помню, что есть что(если это кто-то читает, то мой тгк: @tochka_kaniio))
function updateHero() {
    //движение право-лево
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

    //проверка платформ
    for (let i = 0; i < plat.length; i++) {
        let p = plat[i];
        if (
            Hero.velocityY >= 0 &&
            Hero.y + Hero.height - Hero.velocityY <= p.y &&
            Hero.y + Hero.height >= p.y &&
            Hero.x + Hero.width - 5 > p.x &&
            Hero.x + 5 < p.x + p.width
        ) {
            Hero.y = p.y - Hero.height;
            Hero.velocityY = 0;
            onAnyPlatform = true;
        }
        if (
            Hero.velocityY < 0 &&
            Hero.y - Hero.velocityY >= p.y + p.height &&
            Hero.y <= p.y + p.height &&
            Hero.x + Hero.width - 5 > p.x &&
            Hero.x + 5 < p.x + p.width
        ) {
            Hero.y = p.y + p.height;
            Hero.velocityY = 0;
        }
    }

    //проверка земли
    if (Hero.y >= Game.groundLevel) {
        Hero.y = Game.groundLevel;
        Hero.velocityY = 0;
        onAnyPlatform = true;
    }

    //границы
    if (Hero.x < 0) {
        Hero.x = 0;
    }
    if (Hero.x + Hero.width > Game.width) {
        Hero.x = Game.width - Hero.width;
    }
    Hero.onGround = onAnyPlatform;

    //подарочки
    for (let i = 0; i < gifts.length; i++) {
        let gift = gifts[i];
        if (!gift.collected &&
            Hero.x + Hero.width > gift.x &&
            Hero.x < gift.x + gift.width &&
            Hero.y + Hero.height > gift.y &&
            Hero.y < gift.y + gift.height
        ) {
            gift.collected = true;
            Hero.score++;
            gift.animationFrame = 0;
        }
    }

    //проверка званный ли гость
    let doorX = 1150;
    let doorY = 475;
    let doorW = 70;
    let doorH = 120;
    if (
        Hero.x + Hero.width > doorX &&
        Hero.x < doorX + doorW &&
        Hero.y + Hero.height > doorY &&
        Hero.y < doorY + doorH
    ) {
        if (Hero.score < 3 && !showMessage) {
            showMessage = true;
            messageTimer = 80;
        } else if (Hero.score >= 3 && !levelCompleted) {
            levelCompleted = true;
            setTimeout(function () {
                window.location.href = "index3.html";
            }, 700);
        }
    }
}

//отрисовка всего этого чуда
function drawFrame() {
    canvasContext.clearRect(0, 0, Game.width, Game.height);
    drawBg();
    drawPlatform();
    updateHero();
    drawHero();
    drawGifts();
    drawSnowflakes();
    if (showMessage) {
        canvasContext.save();
        canvasContext.font = "40px Arial";
        canvasContext.fillStyle = "rgba(0,0,0,0.7)";
        canvasContext.fillRect(Game.width / 2 - 240, 180, 480, 90);
        canvasContext.fillStyle = "#fff";
        canvasContext.textAlign = "center";
        canvasContext.fillText("Соберите все подарки!", Game.width / 2, 240);
        canvasContext.restore();
        messageTimer--;
        if (messageTimer <= 0) showMessage = false;
    }
    requestAnimationFrame(drawFrame);
}

//евентики
document.addEventListener("keydown", function (e) {
    keys[e.code] = true;
    if ((e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === ' ') && Hero.onGround) {
        Hero.velocityY = Hero.jumpPower;
        Hero.onGround = false;
    }
});
document.addEventListener("keyup", function (e) {
    keys[e.code] = false;
});

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
    window.addEventListener('click', () => {
        playMuz();
    }, { once: true });
}

initEventListeners()