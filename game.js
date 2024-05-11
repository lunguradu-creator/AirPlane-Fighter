const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 600;

let gameRunning = false;
let score = 0;
let gameTime = 0;
let gameInterval;
let planeImage = new Image();
planeImage.src = 'images/avion.png';
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('gameTime');
const planeNameElement = document.getElementById('planeName');
let backgroundImage = new Image();
backgroundImage.src = 'images/background.jpg'; // Alegeți imaginea de fundal
let backgroundImagePosY = 0; // Poziția pe axa y a imaginii de fundal
const backgroundSpeed = 1; // Viteza de deplasare a fundalului

let plane = { x: canvas.width / 2 - 50, y: canvas.height - 120, width: 100, height: 80, name: "Night Raptor" };
let projectiles = [];
let enemies = [];

let backgroundImagePosY2 = -canvas.height;

let rocketImage = new Image();
rocketImage.src = 'images/rocket.png';
let rocketWidth = 20; // Lățimea dorită pentru rachetă
let rocketHeight = 40; // Înălțimea dorită pentru rachetă

ls
function drawPlane() {
    if (planeImage.complete) {
        ctx.drawImage(planeImage, plane.x, plane.y, plane.width, plane.height);
    } else {
        planeImage.onload = function () {
            ctx.drawImage(planeImage, plane.x, plane.y, plane.width, plane.height);
        };
    }
}
function updateScore() {
    scoreElement.innerText = score;
    planeNameElement.innerText = plane.name;
}

function updateTime() {
    ++gameTime;
    let minutes = Math.floor(gameTime / 60);
    let seconds = gameTime % 60;
    timeElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startGame() {
    clearInterval(gameInterval);
    gameRunning = true;
    score = 0;
    gameTime = 0;
    plane = { x: canvas.width / 2 - 50, y: canvas.height - 110, width: 130, height: 100, name: "Night Raptor" };
    projectiles = [];
    enemies = [];
    updateScore();
    updateTime();
    gameInterval = setInterval(updateTime, 1000);

    planeImage.src = 'images/avion.png';
    planeImage.onload = function () {
        requestAnimationFrame(gameLoop);
    };
}

document.getElementById('newGameButton').addEventListener('click', startGame);

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(); // Desenează fundalul
        drawPlane();
        drawProjectiles();
        drawEnemies();
        spawnEnemy();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    } else {
        clearInterval(gameInterval);
        ctx.fillStyle = 'white';
        ctx.font = '36px Arial';
        ctx.fillText(`Game Over! Scor: ${score}`, canvas.width / 2 - ctx.measureText(`Game Over! Scor: ${score}`).width / 2, canvas.height / 2);
    }
}

function drawBackground() {
    // Mișcă prima imagine de fundal în jos
    backgroundImagePosY += backgroundSpeed;
    // Mișcă a doua imagine de fundal în jos
    backgroundImagePosY2 += backgroundSpeed;
    // Dacă prima imagine iese din cadrul canvas-ului, repune-o deasupra celei de-a doua imagini
    if (backgroundImagePosY >= canvas.height) {
        backgroundImagePosY = -canvas.height;
    }
    // Dacă a doua imagine iese din cadrul canvas-ului, repune-o deasupra primei imagini
    if (backgroundImagePosY2 >= canvas.height) {
        backgroundImagePosY2 = -canvas.height;
    }
    // Desenează cele două imagini de fundal
    ctx.drawImage(backgroundImage, 0, backgroundImagePosY, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, backgroundImagePosY2, canvas.width, canvas.height);
}

function drawProjectiles() {
    projectiles.forEach(projectile => {
        ctx.drawImage(rocketImage, projectile.x, projectile.y, rocketWidth, rocketHeight); // Desenează racheta cu dimensiunile dorite
        projectile.y -= 6;
    });
    projectiles = projectiles.filter(projectile => projectile.y > 0);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += 2;
    });
    enemies = enemies.filter(enemy => enemy.y < canvas.height);
}

function spawnEnemy() {
    if (Math.random() < 0.02) {
        let enemyImage = Math.random() < 0.5 ? enemy1Image : enemy2Image;
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 50,
            height: 50,
            image: enemyImage
        });
    }
}

function checkCollisions() {
    enemies.forEach((enemy, index) => {
        projectiles.forEach((projectile, projIndex) => {
            if (projectile.x < enemy.x + enemy.width && projectile.x + projectile.width > enemy.x &&
                projectile.y < enemy.y + enemy.height && projectile.y + projectile.height > enemy.y) {
                enemies.splice(index, 1);
                projectiles.splice(projIndex, 1);
                ++score;
                updateScore();
            }
        });

        if (enemy.x < plane.x + plane.width && enemy.x + enemy.width > plane.x &&
            enemy.y < plane.y + plane.height && enemy.y + enemy.height > plane.y) {
            gameRunning = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('newGameButton').addEventListener('click', startGame);
});

document.addEventListener('keydown', function (e) {
    switch (e.code) {
        case 'ArrowLeft':
            if (plane.x > 0) plane.x -= 10;
            break;
        case 'ArrowRight':
            if (plane.x < canvas.width - plane.width) plane.x += 10;
            break;
        case 'KeyF':
            projectiles.push({ x: plane.x + plane.width / 2 - 7, y: plane.y, width: 30, height: 50 }); // Ajustați lățimea și înălțimea proiectilului
            break; //reglez pozitia proiectilului sa fie pe mijlocul avionului
    }
});
