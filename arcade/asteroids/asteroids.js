// ============================================
// ASTEROIDS - LLMx Arcade
// ============================================

document.addEventListener('DOMContentLoaded', function() {

// ============================================
// CONSTANTS
// ============================================

const ROTATE_SPEED = 3.2;
const THRUST = 220;
const FRICTION = 0.985;
const BULLET_SPEED = 420;
const BULLET_LIFE = 1.1;
const ASTEROID_SPEED = 70;
const ASTEROID_DRIFT = 120;
const ASTEROID_SIZES = [48, 28, 16];
const SAFE_SPAWN_RADIUS = 120;
const STARTING_LIVES = 3;
const STARTING_ASTEROIDS = 5;
const SCORE_VALUES = [20, 50, 100];

// ============================================
// GAME STATE
// ============================================

let canvas = null;
let ctx = null;
let pixelRatio = window.devicePixelRatio || 1;
let lastTime = 0;

let ship = null;
let bullets = [];
let asteroids = [];

let score = 0;
let lives = STARTING_LIVES;
let highScore = 0;
let level = 1;

let gameLoop = null;
let gameState = 'idle'; // 'idle', 'playing', 'paused', 'gameover'
let keysPressed = new Set();
let touchMode = null;

// ============================================
// DOM ELEMENTS
// ============================================

const boardContainer = document.querySelector('.board-container');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const highScoreElement = document.getElementById('high-score');
const overlayElement = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    canvas = document.getElementById('asteroids-canvas');
    ctx = canvas.getContext('2d');

    highScore = parseInt(localStorage.getItem('asteroids-high-score')) || 0;
    highScoreElement.textContent = highScore;

    resizeCanvas();
    initShip();
    spawnAsteroids(STARTING_ASTEROIDS);
    render();

    startBtn.addEventListener('click', handleStartButton);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    initTouchControls();
    window.addEventListener('resize', handleResize);
}

function resizeCanvas() {
    const rect = boardContainer.getBoundingClientRect();
    pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * pixelRatio);
    canvas.height = Math.floor(rect.height * pixelRatio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

// ============================================
// GAME LOOP
// ============================================

function startGame() {
    score = 0;
    lives = STARTING_LIVES;
    level = 1;
    bullets = [];
    asteroids = [];
    initShip();
    spawnAsteroids(STARTING_ASTEROIDS);
    updateStats();

    gameState = 'playing';
    hideOverlay();
    lastTime = performance.now();

    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

function update(timestamp) {
    if (gameState !== 'playing') return;
    const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    updateShip(delta);
    updateBullets(delta);
    updateAsteroids(delta);
    handleCollisions();

    if (asteroids.length === 0) {
        level += 1;
        spawnAsteroids(STARTING_ASTEROIDS + level);
    }

    render();
    gameLoop = requestAnimationFrame(update);
}

// ============================================
// SHIP
// ============================================

function initShip() {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;
    ship = {
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
        angle: -Math.PI / 2,
        radius: 10,
        thrusting: false,
        invulnerable: 0
    };
}

function updateShip(delta) {
    const rotateLeft = keysPressed.has('ArrowLeft') || keysPressed.has('a') || keysPressed.has('A');
    const rotateRight = keysPressed.has('ArrowRight') || keysPressed.has('d') || keysPressed.has('D');
    const thrust = keysPressed.has('ArrowUp') || keysPressed.has('w') || keysPressed.has('W') || touchMode === 'thrust';

    if (rotateLeft || touchMode === 'left') {
        ship.angle -= ROTATE_SPEED * delta;
    }
    if (rotateRight || touchMode === 'right') {
        ship.angle += ROTATE_SPEED * delta;
    }

    if (thrust) {
        ship.vx += Math.cos(ship.angle) * THRUST * delta;
        ship.vy += Math.sin(ship.angle) * THRUST * delta;
        ship.thrusting = true;
    } else {
        ship.thrusting = false;
    }

    const damping = Math.pow(FRICTION, delta * 60);
    ship.vx *= damping;
    ship.vy *= damping;

    ship.x += ship.vx * delta;
    ship.y += ship.vy * delta;
    wrapObject(ship);

    if (ship.invulnerable > 0) {
        ship.invulnerable = Math.max(0, ship.invulnerable - delta);
    }
}

// ============================================
// BULLETS
// ============================================

function shoot() {
    if (gameState !== 'playing') return;
    const bullet = {
        x: ship.x + Math.cos(ship.angle) * (ship.radius + 4),
        y: ship.y + Math.sin(ship.angle) * (ship.radius + 4),
        vx: Math.cos(ship.angle) * BULLET_SPEED + ship.vx * 0.4,
        vy: Math.sin(ship.angle) * BULLET_SPEED + ship.vy * 0.4,
        life: BULLET_LIFE
    };
    bullets.push(bullet);
}

function updateBullets(delta) {
    bullets.forEach(bullet => {
        bullet.x += bullet.vx * delta;
        bullet.y += bullet.vy * delta;
        bullet.life -= delta;
        wrapObject(bullet);
    });
    bullets = bullets.filter(bullet => bullet.life > 0);
}

// ============================================
// ASTEROIDS
// ============================================

function spawnAsteroids(count) {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;

    for (let i = 0; i < count; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        const dx = x - ship.x;
        const dy = y - ship.y;
        if (Math.hypot(dx, dy) < SAFE_SPAWN_RADIUS) {
            i--;
            continue;
        }
        asteroids.push(createAsteroid(x, y, 0));
    }
}

function createAsteroid(x, y, sizeIndex) {
    const angle = Math.random() * Math.PI * 2;
    const speed = ASTEROID_SPEED + Math.random() * ASTEROID_DRIFT;
    return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: ASTEROID_SIZES[sizeIndex],
        sizeIndex,
        vertices: createRockVertices(ASTEROID_SIZES[sizeIndex])
    };
}

function createRockVertices(radius) {
    const points = [];
    const jaggedness = 0.4;
    const count = 10;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const offset = radius * (1 - jaggedness + Math.random() * jaggedness);
        points.push({ angle, radius: offset });
    }
    return points;
}

function updateAsteroids(delta) {
    asteroids.forEach(asteroid => {
        asteroid.x += asteroid.vx * delta;
        asteroid.y += asteroid.vy * delta;
        wrapObject(asteroid);
    });
}

// ============================================
// COLLISIONS
// ============================================

function handleCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        asteroids.forEach((asteroid, asteroidIndex) => {
            if (distance(bullet, asteroid) < asteroid.radius) {
                bullets[bulletIndex].life = 0;
                splitAsteroid(asteroid, asteroidIndex);
                score += SCORE_VALUES[asteroid.sizeIndex] || 25;
                updateStats();
            }
        });
    });

    if (ship.invulnerable > 0) return;
    asteroids.forEach(asteroid => {
        if (distance(ship, asteroid) < asteroid.radius + ship.radius) {
            handleShipHit();
        }
    });
}

function splitAsteroid(asteroid, index) {
    asteroids.splice(index, 1);
    const nextSize = asteroid.sizeIndex + 1;
    if (nextSize < ASTEROID_SIZES.length) {
        asteroids.push(createAsteroid(asteroid.x, asteroid.y, nextSize));
        asteroids.push(createAsteroid(asteroid.x, asteroid.y, nextSize));
    }
}

function handleShipHit() {
    lives -= 1;
    updateStats();
    if (lives <= 0) {
        endGame();
        return;
    }
    initShip();
    ship.invulnerable = 2;
    bullets = [];
}

// ============================================
// RENDERING
// ============================================

function render() {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;

    ctx.clearRect(0, 0, width, height);
    drawCenterLine(width, height);
    drawShip();
    drawBullets();
    drawAsteroids();
}

function drawCenterLine(width, height) {
    ctx.save();
    ctx.strokeStyle = getCssVar('--asteroids-line', 'rgba(0, 0, 0, 0.2)');
    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.restore();
}

function drawShip() {
    if (ship.invulnerable > 0 && Math.floor(ship.invulnerable * 10) % 2 === 0) {
        return;
    }
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = getCssVar('--asteroids-ship', '#12421e');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-10, 8);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, -8);
    ctx.closePath();
    ctx.stroke();

    if (ship.thrusting) {
        ctx.strokeStyle = getCssVar('--asteroids-bullet', '#ff0000');
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-18, 0);
        ctx.stroke();
    }
    ctx.restore();
}

function drawBullets() {
    ctx.fillStyle = getCssVar('--asteroids-bullet', '#ff0000');
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawAsteroids() {
    ctx.strokeStyle = getCssVar('--asteroids-rock', '#2e2aa8');
    ctx.lineWidth = 2;
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.beginPath();
        asteroid.vertices.forEach((point, index) => {
            const x = Math.cos(point.angle) * point.radius;
            const y = Math.sin(point.angle) * point.radius;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    });
}

// ============================================
// UTILITIES
// ============================================

function wrapObject(obj) {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;
    if (obj.x < -20) obj.x = width + 20;
    if (obj.x > width + 20) obj.x = -20;
    if (obj.y < -20) obj.y = height + 20;
    if (obj.y > height + 20) obj.y = -20;
}

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function getCssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    return value ? value.trim() : fallback;
}

function updateStats() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    highScoreElement.textContent = highScore;
}

// ============================================
// OVERLAY
// ============================================

function showOverlay(title, message, buttonText) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    startBtn.textContent = buttonText;
    overlayElement.classList.remove('hidden');
}

function hideOverlay() {
    overlayElement.classList.add('hidden');
}

function endGame() {
    gameState = 'gameover';
    if (gameLoop) cancelAnimationFrame(gameLoop);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('asteroids-high-score', highScore);
        highScoreElement.textContent = highScore;
    }
    showOverlay('Game Over', `Score: ${score}`, 'Play Again');
}

// ============================================
// INPUT HANDLING
// ============================================

function handleStartButton() {
    if (gameState === 'idle' || gameState === 'gameover') {
        startGame();
    } else if (gameState === 'paused') {
        resumeGame();
    }
}

function handleKeyDown(e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'w', 'W', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        keysPressed.add(e.key);
    }

    if (e.key === ' ') {
        e.preventDefault();
        shoot();
    }

    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        if (gameState === 'playing') {
            pauseGame();
        } else if (gameState === 'paused') {
            resumeGame();
        }
    }
}

function handleKeyUp(e) {
    keysPressed.delete(e.key);
}

function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    showOverlay('Paused', 'Tap or press P to continue', 'Resume');
}

function resumeGame() {
    if (gameState !== 'paused') return;
    gameState = 'playing';
    hideOverlay();
    lastTime = performance.now();
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

// ============================================
// TOUCH CONTROLS
// ============================================

function initTouchControls() {
    const gameArea = document.querySelector('.asteroids-page');
    const SWIPE_THRESHOLD = 18;
    let touchStartX = 0;
    let touchStartY = 0;

    gameArea.addEventListener('touchstart', (e) => {
        if (gameState !== 'playing' && gameState !== 'paused') return;
        if (e.touches.length === 2) {
            if (gameState === 'playing') {
                pauseGame();
            } else {
                resumeGame();
            }
            return;
        }
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMode = getTouchMode(touchStartX, touchStartY);
    }, { passive: true });

    gameArea.addEventListener('touchmove', (e) => {
        if (gameState !== 'playing') return;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        if (Math.abs(deltaY) > SWIPE_THRESHOLD && deltaY < 0) {
            touchMode = 'thrust';
        } else if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
            touchMode = deltaX > 0 ? 'right' : 'left';
        }
    }, { passive: true });

    gameArea.addEventListener('touchend', (e) => {
        if (gameState !== 'playing' && gameState !== 'paused') return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
            if (gameState === 'playing') {
                shoot();
            } else {
                resumeGame();
            }
        }
        touchMode = null;
    }, { passive: true });

    gameArea.addEventListener('touchmove', (e) => {
        if (gameState === 'playing') {
            e.preventDefault();
        }
    }, { passive: false });
}

function getTouchMode(x, y) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (y < height * 0.4) return 'thrust';
    if (x < width * 0.4) return 'left';
    if (x > width * 0.6) return 'right';
    return null;
}

function handleResize() {
    const oldWidth = canvas.width / pixelRatio;
    const oldHeight = canvas.height / pixelRatio;
    resizeCanvas();
    const newWidth = canvas.width / pixelRatio;
    const newHeight = canvas.height / pixelRatio;

    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;
    ship.x *= scaleX;
    ship.y *= scaleY;
    ship.vx *= scaleX;
    ship.vy *= scaleY;
    bullets.forEach(bullet => {
        bullet.x *= scaleX;
        bullet.y *= scaleY;
    });
    asteroids.forEach(asteroid => {
        asteroid.x *= scaleX;
        asteroid.y *= scaleY;
    });
}

// ============================================
// START
// ============================================

init();

}); // End DOMContentLoaded
