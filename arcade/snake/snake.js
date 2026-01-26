// ============================================
// SNAKE - LLMx Arcade
// ============================================

document.addEventListener('DOMContentLoaded', function() {

// ============================================
// CONSTANTS
// ============================================

const GRID_SIZE = 20;
const INITIAL_LENGTH = 3;
const TICK_RATE = 120;

// ============================================
// GAME STATE
// ============================================

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = null;
let score = 0;
let highScore = 0;
let gameLoop = null;
let gameState = 'idle'; // 'idle', 'playing', 'paused', 'gameover'

// ============================================
// DOM ELEMENTS
// ============================================

const boardElement = document.getElementById('snake-board');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const overlayElement = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    highScore = parseInt(localStorage.getItem('snake-high-score')) || 0;
    highScoreElement.textContent = highScore;

    createBoardCells();

    startBtn.addEventListener('click', handleStartButton);
    document.addEventListener('keydown', handleKeyDown);

    initTouchControls();
}

function createBoardCells() {
    boardElement.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            boardElement.appendChild(cell);
        }
    }
}

// ============================================
// GAME LOOP
// ============================================

function startGame() {
    score = 0;
    updateStats();

    const startX = Math.floor(GRID_SIZE / 2);
    const startY = Math.floor(GRID_SIZE / 2);
    snake = [];
    for (let i = 0; i < INITIAL_LENGTH; i++) {
        snake.push({ x: startX - i, y: startY });
    }

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    spawnFood();
    render();

    gameState = 'playing';
    hideOverlay();

    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, TICK_RATE);
}

function update() {
    if (gameState !== 'playing') return;

    direction = { ...nextDirection };
    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    if (isCollision(newHead)) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    if (food && newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        updateStats();
        spawnFood();
    } else {
        snake.pop();
    }

    render();
}

function isCollision(position) {
    if (position.x < 0 || position.x >= GRID_SIZE || position.y < 0 || position.y >= GRID_SIZE) {
        return true;
    }
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function spawnFood() {
    let newFood = null;
    while (!newFood || snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    }
    food = newFood;
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
}

function endGame() {
    gameState = 'gameover';
    if (gameLoop) clearInterval(gameLoop);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snake-high-score', highScore);
        highScoreElement.textContent = highScore;
    }

    showOverlay('Game Over', `Score: ${score}`, 'Play Again');
}

// ============================================
// RENDERING
// ============================================

function render() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell';
    });

    snake.forEach((segment, index) => {
        const cell = boardElement.querySelector(`[data-x="${segment.x}"][data-y="${segment.y}"]`);
        if (!cell) return;
        cell.classList.add('snake');
        if (index === 0) {
            cell.classList.add('snake-head');
        }
    });

    if (food) {
        const foodCell = boardElement.querySelector(`[data-x="${food.x}"][data-y="${food.y}"]`);
        if (foodCell) {
            foodCell.classList.add('food');
        }
    }
}

function updateStats() {
    scoreElement.textContent = score;
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

function setDirection(dx, dy) {
    if (direction.x === -dx && direction.y === -dy) return;
    nextDirection = { x: dx, y: dy };
}

function handleKeyDown(e) {
    if (gameState === 'playing') {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                setDirection(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                setDirection(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                setDirection(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                setDirection(1, 0);
                break;
            case 'p':
            case 'P':
            case 'Escape':
                e.preventDefault();
                pauseGame();
                break;
        }
    } else if (gameState === 'paused') {
        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
            e.preventDefault();
            resumeGame();
        }
    }
}

// ============================================
// TOUCH CONTROLS
// ============================================

function initTouchControls() {
    const gameArea = document.querySelector('.snake-page');
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 20;

    gameArea.addEventListener('touchstart', (e) => {
        if (gameState !== 'playing' && gameState !== 'paused') return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
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
                pauseGame();
            } else {
                resumeGame();
            }
            return;
        }

        if (absX > absY) {
            setDirection(deltaX > 0 ? 1 : -1, 0);
        } else {
            setDirection(0, deltaY > 0 ? 1 : -1);
        }
    }, { passive: true });

    gameArea.addEventListener('touchmove', (e) => {
        if (gameState === 'playing') {
            e.preventDefault();
        }
    }, { passive: false });
}

// ============================================
// START
// ============================================

init();

}); // End DOMContentLoaded
