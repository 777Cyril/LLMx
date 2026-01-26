// ============================================
// PONG - LLMx Arcade
// ============================================

document.addEventListener('DOMContentLoaded', function() {

// ============================================
// CONSTANTS
// ============================================

const WIN_SCORE = 7;
const BALL_SPEED = 4.2;
const BALL_SPEED_INCREMENT = 0.2;
const PADDLE_MARGIN = 16;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT_RATIO = 0.18;
const BALL_SIZE = 10;
const POINT_RESET_DELAY = 900;

const DIFFICULTY_LEVELS = {
    easy: { aiSpeed: 2.8, reactionDelay: 200, maxBallSpeed: 7 },
    medium: { aiSpeed: 3.6, reactionDelay: 140, maxBallSpeed: 8 },
    hard: { aiSpeed: 4.4, reactionDelay: 90, maxBallSpeed: 9 },
    champion: { aiSpeed: 5.2, reactionDelay: 60, maxBallSpeed: 10 }
};

// ============================================
// GAME STATE
// ============================================

let canvas = null;
let ctx = null;
let pixelRatio = window.devicePixelRatio || 1;

let player = null;
let cpu = null;
let ball = null;

let playerScore = 0;
let cpuScore = 0;
let highScore = 0;

let gameLoop = null;
let gameState = 'idle'; // 'idle', 'playing', 'paused', 'gameover'
let keysPressed = new Set();
let currentDifficulty = 'medium';
let serveTimeout = null;
let awaitingServe = false;

// ============================================
// DOM ELEMENTS
// ============================================

const boardContainer = document.querySelector('.board-container');
const scoreElement = document.getElementById('player-score');
const cpuScoreElement = document.getElementById('cpu-score');
const highScoreElement = document.getElementById('high-score');
const overlayElement = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty-select');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    canvas = document.getElementById('pong-canvas');
    ctx = canvas.getContext('2d');

    highScore = parseInt(localStorage.getItem('pong-high-score')) || 0;
    highScoreElement.textContent = highScore;

    resizeCanvas();
    initGameObjects();

    startBtn.addEventListener('click', handleStartButton);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    difficultySelect.addEventListener('change', handleDifficultyChange);

    const savedDifficulty = localStorage.getItem('pong-difficulty');
    if (savedDifficulty && DIFFICULTY_LEVELS[savedDifficulty]) {
        currentDifficulty = savedDifficulty;
        difficultySelect.value = savedDifficulty;
    }
    applyDifficulty(currentDifficulty);

    initPointerControls();

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

function initGameObjects() {
    const paddleHeight = Math.max(50, canvas.height / pixelRatio * PADDLE_HEIGHT_RATIO);
    player = {
        x: PADDLE_MARGIN,
        y: (canvas.height / pixelRatio - paddleHeight) / 2,
        width: PADDLE_WIDTH,
        height: paddleHeight,
        speed: 6
    };
    cpu = {
        x: canvas.width / pixelRatio - PADDLE_MARGIN - PADDLE_WIDTH,
        y: (canvas.height / pixelRatio - paddleHeight) / 2,
        width: PADDLE_WIDTH,
        height: paddleHeight,
        speed: DIFFICULTY_LEVELS[currentDifficulty].aiSpeed,
        targetY: (canvas.height / pixelRatio - paddleHeight) / 2,
        lastReaction: 0,
        reactionDelay: DIFFICULTY_LEVELS[currentDifficulty].reactionDelay
    };

    resetBall(Math.random() > 0.5 ? 1 : -1);
}

// ============================================
// GAME LOOP
// ============================================

function startGame() {
    playerScore = 0;
    cpuScore = 0;
    updateStats();
    initGameObjects();
    awaitingServe = false;
    if (serveTimeout) {
        clearTimeout(serveTimeout);
        serveTimeout = null;
    }
    gameState = 'playing';
    hideOverlay();

    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

function update() {
    if (gameState !== 'playing') return;

    updatePlayer();
    updateCpu();
    updateBall();
    render();

    gameLoop = requestAnimationFrame(update);
}

function updatePlayer() {
    const up = keysPressed.has('ArrowUp') || keysPressed.has('w') || keysPressed.has('W');
    const down = keysPressed.has('ArrowDown') || keysPressed.has('s') || keysPressed.has('S');
    if (up) {
        player.y -= player.speed;
    } else if (down) {
        player.y += player.speed;
    }
    clampPaddle(player);
}

function updateCpu() {
    if (!ball || awaitingServe) return;
    const now = performance.now();
    if (now - cpu.lastReaction >= cpu.reactionDelay) {
        cpu.targetY = ball.y - cpu.height / 2;
        cpu.lastReaction = now;
    }
    if (cpu.y < cpu.targetY) {
        cpu.y += cpu.speed;
    } else if (cpu.y > cpu.targetY) {
        cpu.y -= cpu.speed;
    }
    clampPaddle(cpu);
}

function updateBall() {
    if (!ball || awaitingServe) return;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y <= 0 || ball.y + ball.size >= canvas.height / pixelRatio) {
        ball.vy *= -1;
        ball.y = Math.max(0, Math.min(ball.y, canvas.height / pixelRatio - ball.size));
    }

    if (checkPaddleCollision(player)) {
        reflectBall(player, 1);
    } else if (checkPaddleCollision(cpu)) {
        reflectBall(cpu, -1);
    }

    if (ball.x + ball.size < 0) {
        cpuScore++;
        updateStats();
        if (cpuScore >= WIN_SCORE) {
            endGame('CPU Wins', 'Try again?');
            return;
        }
        scheduleServe(1);
    } else if (ball.x > canvas.width / pixelRatio) {
        playerScore++;
        updateStats();
        if (playerScore >= WIN_SCORE) {
            endGame('You Win', 'Nice rally');
            return;
        }
        scheduleServe(-1);
    }
}

function checkPaddleCollision(paddle) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    );
}

function reflectBall(paddle, direction) {
    const paddleCenter = paddle.y + paddle.height / 2;
    const ballCenter = ball.y + ball.size / 2;
    const offset = (ballCenter - paddleCenter) / (paddle.height / 2);

    const speed = Math.min(ball.speed + BALL_SPEED_INCREMENT, ball.maxSpeed);
    const angle = offset * (Math.PI / 4);

    ball.speed = speed;
    ball.vx = speed * Math.cos(angle) * direction;
    ball.vy = speed * Math.sin(angle);

    if (direction > 0) {
        ball.x = paddle.x + paddle.width;
    } else {
        ball.x = paddle.x - ball.size;
    }
}

function resetBall(direction) {
    const canvasWidth = canvas.width / pixelRatio;
    const canvasHeight = canvas.height / pixelRatio;
    ball = {
        x: canvasWidth / 2 - BALL_SIZE / 2,
        y: canvasHeight / 2 - BALL_SIZE / 2,
        size: BALL_SIZE,
        speed: BALL_SPEED,
        maxSpeed: DIFFICULTY_LEVELS[currentDifficulty].maxBallSpeed,
        vx: BALL_SPEED * direction,
        vy: BALL_SPEED * (Math.random() * 1.5 - 0.75)
    };
}

function scheduleServe(direction) {
    awaitingServe = true;
    if (serveTimeout) clearTimeout(serveTimeout);
    ball = null;
    serveTimeout = setTimeout(() => {
        resetBall(direction);
        awaitingServe = false;
    }, POINT_RESET_DELAY);
}

function clampPaddle(paddle) {
    const maxY = canvas.height / pixelRatio - paddle.height;
    paddle.y = Math.max(0, Math.min(paddle.y, maxY));
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
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

function endGame(title, message) {
    gameState = 'gameover';
    if (gameLoop) cancelAnimationFrame(gameLoop);
    if (serveTimeout) {
        clearTimeout(serveTimeout);
        serveTimeout = null;
    }
    awaitingServe = false;

    if (playerScore > highScore) {
        highScore = playerScore;
        localStorage.setItem('pong-high-score', highScore);
        highScoreElement.textContent = highScore;
    }

    showOverlay(title, message, 'Play Again');
}

// ============================================
// RENDERING
// ============================================

function render() {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;

    ctx.clearRect(0, 0, width, height);
    drawCenterLine(width, height);
    drawPaddle(player);
    drawPaddle(cpu);
    if (ball) {
        drawBall();
    }
}

function drawCenterLine(width, height) {
    ctx.save();
    ctx.strokeStyle = getCssVar('--pong-line', 'rgba(0, 0, 0, 0.2)');
    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.restore();
}

function drawPaddle(paddle) {
    ctx.fillStyle = getCssVar('--pong-paddle', '#12421e');
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = getCssVar('--pong-ball', '#ff0000');
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function getCssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    return value ? value.trim() : fallback;
}

function updateStats() {
    scoreElement.textContent = playerScore;
    cpuScoreElement.textContent = cpuScore;
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
    if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        keysPressed.add(e.key);
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

function handleDifficultyChange(e) {
    const value = e.target.value;
    if (!DIFFICULTY_LEVELS[value]) return;
    currentDifficulty = value;
    localStorage.setItem('pong-difficulty', value);
    applyDifficulty(value);
}

function applyDifficulty(level) {
    const settings = DIFFICULTY_LEVELS[level];
    if (!settings) return;
    if (cpu) {
        cpu.speed = settings.aiSpeed;
        cpu.reactionDelay = settings.reactionDelay;
    }
    if (ball) {
        ball.maxSpeed = settings.maxBallSpeed;
    }
}

function initPointerControls() {
    const gameArea = document.querySelector('.pong-page');
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartedOnCanvas = false;
    const SWIPE_THRESHOLD = 20;

    const movePaddleTo = (clientY) => {
        const rect = canvas.getBoundingClientRect();
        const y = clientY - rect.top;
        player.y = y - player.height / 2;
        clampPaddle(player);
    };

    const isTouchOnCanvas = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        return (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        );
    };

    gameArea.addEventListener('mousemove', (e) => {
        if (gameState !== 'playing') return;
        movePaddleTo(e.clientY);
    });

    gameArea.addEventListener('touchstart', (e) => {
        if (gameState !== 'playing' && gameState !== 'paused') return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartedOnCanvas = isTouchOnCanvas(touchStartX, touchStartY);

        // If touch is on canvas and playing, move paddle immediately
        if (touchStartedOnCanvas && gameState === 'playing') {
            movePaddleTo(touchStartY);
        }
    }, { passive: true });

    gameArea.addEventListener('touchmove', (e) => {
        if (gameState !== 'playing') return;
        movePaddleTo(e.touches[0].clientY);
    }, { passive: true });

    gameArea.addEventListener('touchend', (e) => {
        if (gameState !== 'playing' && gameState !== 'paused') return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Only pause/resume if tap was OUTSIDE the canvas
        if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD && !touchStartedOnCanvas) {
            if (gameState === 'playing') {
                pauseGame();
            } else if (gameState === 'paused') {
                resumeGame();
            }
        }
        // If on canvas, just move paddle (already handled in touchstart/touchmove)
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

    player.y *= scaleY;
    cpu.y *= scaleY;
    if (ball) {
        ball.x *= scaleX;
        ball.y *= scaleY;
    }
    clampPaddle(player);
    clampPaddle(cpu);
}

// ============================================
// START
// ============================================

init();

}); // End DOMContentLoaded
