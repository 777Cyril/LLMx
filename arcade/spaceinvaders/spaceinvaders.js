// ============================================
// SPACE INVADERS - LLMx Arcade
// ============================================

document.addEventListener('DOMContentLoaded', function() {

// ============================================
// CONSTANTS
// ============================================

const COLS = 10;
const ROWS = 5;
const INVADER_GAP_RATIO = 0.4;
const PLAYER_SPEED = 280;
const BULLET_SPEED = 420;
const INVADER_BULLET_SPEED = 220;
const INVADER_MOVE_SPEED = 28;
const INVADER_DROP = 18;
const INVADER_SHOT_INTERVAL = 900;
const STARTING_LIVES = 3;

// ============================================
// GAME STATE
// ============================================

let canvas = null;
let ctx = null;
let pixelRatio = window.devicePixelRatio || 1;
let lastTime = 0;

let player = null;
let invaders = [];
let playerBullets = [];
let invaderBullets = [];
let invaderDirection = 1;
let invaderSpeed = INVADER_MOVE_SPEED;
let invaderWidth = 0;
let invaderHeight = 0;
let invaderGap = 0;
let invaderShootTimer = 0;

let score = 0;
let level = 1;
let lives = STARTING_LIVES;
let highScore = 0;

let gameLoop = null;
let gameState = 'idle';
let keysPressed = new Set();
let touchStartX = 0;
let touchStartY = 0;
let audioContext = null;

// ============================================
// DOM ELEMENTS
// ============================================

const boardContainer = document.querySelector('.board-container');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
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
    canvas = document.getElementById('invaders-canvas');
    ctx = canvas.getContext('2d');

    highScore = parseInt(localStorage.getItem('invaders-high-score')) || 0;
    highScoreElement.textContent = highScore;

    resizeCanvas();
    resetGame();
    render();

    startBtn.addEventListener('click', handleStartButton);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    initTouchControls();
    window.addEventListener('resize', handleResize);
}

function playTone(type) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    if (type === 'shoot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    } else if (type === 'damage') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.28);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    }

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.35);
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
    level = 1;
    lives = STARTING_LIVES;
    resetGame();
    updateStats();

    gameState = 'playing';
    hideOverlay();
    lastTime = performance.now();

    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

function resetGame() {
    player = createPlayer();
    setupInvaders();
    playerBullets = [];
    invaderBullets = [];
    invaderDirection = 1;
    invaderSpeed = INVADER_MOVE_SPEED + level * 6;
    invaderShootTimer = 0;
}

function update(timestamp) {
    if (gameState !== 'playing') return;
    const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    updatePlayer(delta);
    updateInvaders(delta);
    updateBullets(delta);
    handleCollisions();

    if (invaders.length === 0) {
        level++;
        resetGame();
    }

    render();
    gameLoop = requestAnimationFrame(update);
}

// ============================================
// SETUP
// ============================================

function createPlayer() {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;
    return {
        x: width / 2,
        y: height - 40,
        width: 36,
        height: 14,
        speed: PLAYER_SPEED
    };
}

function setupInvaders() {
    const width = canvas.width / pixelRatio;
    const maxGridWidth = width * 0.8;
    invaderGap = Math.max(6, Math.floor((maxGridWidth / COLS) * INVADER_GAP_RATIO));
    invaderWidth = Math.floor((maxGridWidth - invaderGap * (COLS - 1)) / COLS);
    invaderHeight = Math.floor(invaderWidth * 0.7);

    const startX = (width - (invaderWidth * COLS + invaderGap * (COLS - 1))) / 2;
    const startY = 40;

    invaders = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            invaders.push({
                x: startX + col * (invaderWidth + invaderGap),
                y: startY + row * (invaderHeight + invaderGap),
                width: invaderWidth,
                height: invaderHeight,
                row
            });
        }
    }
}

// ============================================
// UPDATES
// ============================================

function updatePlayer(delta) {
    const left = keysPressed.has('ArrowLeft') || keysPressed.has('a') || keysPressed.has('A');
    const right = keysPressed.has('ArrowRight') || keysPressed.has('d') || keysPressed.has('D');

    if (left) {
        player.x -= player.speed * delta;
    } else if (right) {
        player.x += player.speed * delta;
    }

    const maxX = canvas.width / pixelRatio - player.width / 2;
    const minX = player.width / 2;
    player.x = Math.max(minX, Math.min(player.x, maxX));
}

function updateInvaders(delta) {
    if (invaders.length === 0) return;
    const moveX = invaderDirection * invaderSpeed * delta;
    invaders.forEach(invader => {
        invader.x += moveX;
    });

    let leftMost = Infinity;
    let rightMost = -Infinity;
    let bottomMost = -Infinity;
    invaders.forEach(invader => {
        leftMost = Math.min(leftMost, invader.x);
        rightMost = Math.max(rightMost, invader.x + invader.width);
        bottomMost = Math.max(bottomMost, invader.y + invader.height);
    });

    const width = canvas.width / pixelRatio;
    if (leftMost <= 16 || rightMost >= width - 16) {
        invaders.forEach(invader => {
            invader.x -= moveX;
            invader.y += INVADER_DROP;
        });
        invaderDirection *= -1;
    }

    if (bottomMost >= player.y - 10) {
        endGame();
    }

    invaderShootTimer += delta * 1000;
    if (invaderShootTimer >= INVADER_SHOT_INTERVAL) {
        invaderShootTimer = 0;
        fireInvaderBullet();
    }
}

function updateBullets(delta) {
    playerBullets.forEach(bullet => {
        bullet.y -= BULLET_SPEED * delta;
    });
    playerBullets = playerBullets.filter(bullet => bullet.y + bullet.height > 0);

    invaderBullets.forEach(bullet => {
        bullet.y += INVADER_BULLET_SPEED * delta;
    });
    invaderBullets = invaderBullets.filter(bullet => bullet.y < canvas.height / pixelRatio + bullet.height);
}

function fireInvaderBullet() {
    const shooters = invaders.reduce((acc, invader) => {
        const key = Math.round(invader.x);
        if (!acc[key] || acc[key].y < invader.y) {
            acc[key] = invader;
        }
        return acc;
    }, {});

    const columns = Object.values(shooters);
    if (columns.length === 0) return;
    const shooter = columns[Math.floor(Math.random() * columns.length)];

    invaderBullets.push({
        x: shooter.x + shooter.width / 2 - 2,
        y: shooter.y + shooter.height,
        width: 4,
        height: 10
    });
}

// ============================================
// COLLISIONS
// ============================================

function handleCollisions() {
    playerBullets.forEach((bullet, bulletIndex) => {
        invaders.forEach((invader, invaderIndex) => {
            if (rectsOverlap(bullet, invader)) {
                playerBullets[bulletIndex].hit = true;
                invaders[invaderIndex].hit = true;
                playTone('hit');
                score += 10 + (ROWS - invader.row) * 2;
            }
        });
    });

    playerBullets = playerBullets.filter(bullet => !bullet.hit);
    invaders = invaders.filter(invader => !invader.hit);
    updateStats();

    invaderBullets.forEach((bullet) => {
        if (rectsOverlap(bullet, player)) {
            bullet.hit = true;
            playTone('damage');
            loseLife();
        }
    });
    invaderBullets = invaderBullets.filter(bullet => !bullet.hit);
}

function loseLife() {
    lives -= 1;
    updateStats();
    if (lives <= 0) {
        endGame();
        return;
    }
    player.x = canvas.width / pixelRatio / 2;
    invaderBullets = [];
}

// ============================================
// RENDERING
// ============================================

function render() {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;

    ctx.clearRect(0, 0, width, height);
    drawCenterLine(width, height);
    drawPlayer();
    drawInvaders();
    drawBullets();
}

function drawCenterLine(width, height) {
    ctx.save();
    ctx.strokeStyle = getCssVar('--invaders-line', 'rgba(0, 0, 0, 0.2)');
    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.restore();
}

function drawPlayer() {
    ctx.fillStyle = getCssVar('--invaders-ship', '#12421e');
    ctx.fillRect(player.x - player.width / 2, player.y, player.width, player.height);
    ctx.fillRect(player.x - 6, player.y - 8, 12, 8);
}

function drawInvaders() {
    ctx.fillStyle = getCssVar('--invaders-alien', '#51bbfe');
    invaders.forEach(invader => {
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        ctx.clearRect(invader.x + invader.width * 0.2, invader.y + invader.height * 0.2, invader.width * 0.12, invader.height * 0.2);
        ctx.clearRect(invader.x + invader.width * 0.68, invader.y + invader.height * 0.2, invader.width * 0.12, invader.height * 0.2);
    });
}

function drawBullets() {
    ctx.fillStyle = getCssVar('--invaders-bullet', '#ff0000');
    playerBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    invaderBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function rectsOverlap(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function updateStats() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
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
        localStorage.setItem('invaders-high-score', highScore);
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
    if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
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

function shoot() {
    if (gameState !== 'playing') return;
    if (playerBullets.length > 2) return;
    playerBullets.push({
        x: player.x - 2,
        y: player.y - 10,
        width: 4,
        height: 10
    });
    playTone('shoot');
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
    const gameArea = document.querySelector('.invaders-page');
    const SWIPE_THRESHOLD = 18;
    let isDragging = false;

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
        isDragging = true;
    }, { passive: true });

    gameArea.addEventListener('touchmove', (e) => {
        if (gameState !== 'playing' || !isDragging) return;
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - touchStartX;
        player.x += deltaX;
        touchStartX = touchX;

        const maxX = canvas.width / pixelRatio - player.width / 2;
        const minX = player.width / 2;
        player.x = Math.max(minX, Math.min(player.x, maxX));
    }, { passive: true });

    gameArea.addEventListener('touchend', (e) => {
        if (gameState !== 'playing' && gameState !== 'paused') return;
        if (!e.changedTouches[0]) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        isDragging = false;

        if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
            if (gameState === 'playing') {
                shoot();
            } else if (gameState === 'paused') {
                resumeGame();
            }
            return;
        }

    }, { passive: true });

    gameArea.addEventListener('touchmove', (e) => {
        if (gameState === 'playing') {
            e.preventDefault();
        }
    }, { passive: false });
}

function handleResize() {
    const oldWidth = canvas.width / pixelRatio;
    const oldHeight = canvas.height / pixelRatio;
    resizeCanvas();
    const newWidth = canvas.width / pixelRatio;
    const newHeight = canvas.height / pixelRatio;

    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;

    player.x *= scaleX;
    player.y *= scaleY;
    playerBullets.forEach(bullet => {
        bullet.x *= scaleX;
        bullet.y *= scaleY;
    });
    invaderBullets.forEach(bullet => {
        bullet.x *= scaleX;
        bullet.y *= scaleY;
    });
    invaders.forEach(invader => {
        invader.x *= scaleX;
        invader.y *= scaleY;
    });
}

function getCssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    return value ? value.trim() : fallback;
}

// ============================================
// START
// ============================================

init();

}); // End DOMContentLoaded
