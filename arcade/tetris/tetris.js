// ============================================
// TETRIS - LLMx Arcade
// ============================================

document.addEventListener('DOMContentLoaded', function() {

// ============================================
// CONSTANTS
// ============================================

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_EMPTY = 0;

// Speed levels (ms per drop) - gets faster each level
const SPEEDS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 67, 50, 33, 17];

// Scoring: points for 1, 2, 3, 4 lines cleared
const LINE_POINTS = [40, 100, 300, 1200];

// Tetromino definitions (4x4 grid, rotations)
const TETROMINOS = {
    I: {
        color: 'I',
        shapes: [
            [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
            [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
            [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
            [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
        ]
    },
    O: {
        color: 'O',
        shapes: [
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]]
        ]
    },
    T: {
        color: 'T',
        shapes: [
            [[0,1,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,1,0], [0,1,0,0], [0,0,0,0]],
            [[0,1,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]]
        ]
    },
    S: {
        color: 'S',
        shapes: [
            [[0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,1,0], [0,0,1,0], [0,0,0,0]],
            [[0,0,0,0], [0,1,1,0], [1,1,0,0], [0,0,0,0]],
            [[1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]]
        ]
    },
    Z: {
        color: 'Z',
        shapes: [
            [[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,0,0], [0,1,1,0], [0,0,0,0]],
            [[0,1,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0]]
        ]
    },
    J: {
        color: 'J',
        shapes: [
            [[1,0,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,1,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,1,0], [0,0,1,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,0,0], [1,1,0,0], [0,0,0,0]]
        ]
    },
    L: {
        color: 'L',
        shapes: [
            [[0,0,1,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,0,0], [0,1,1,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,1,0], [1,0,0,0], [0,0,0,0]],
            [[1,1,0,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]]
        ]
    }
};

const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// ============================================
// GAME STATE
// ============================================

let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let currentRotation = 0;
let nextQueue = [];
let holdPiece = null;
let canHold = true;
let score = 0;
let level = 1;
let lines = 0;
let highScore = 0;
let gameLoop = null;
let gameState = 'idle'; // 'idle', 'playing', 'paused', 'gameover'
let lastDropTime = 0;

// ============================================
// DOM ELEMENTS
// ============================================

const boardElement = document.getElementById('game-board');
const holdGridElement = document.getElementById('hold-grid');
const nextGrid1 = document.getElementById('next-grid-1');
const nextGrid2 = document.getElementById('next-grid-2');
const nextGrid3 = document.getElementById('next-grid-3');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const highScoreElement = document.getElementById('high-score');
const overlayElement = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Load high score
    highScore = parseInt(localStorage.getItem('tetris-high-score')) || 0;
    highScoreElement.textContent = highScore;

    // Create board cells
    createBoardCells();
    createMiniGridCells(holdGridElement);
    createMiniGridCells(nextGrid1);
    createMiniGridCells(nextGrid2);
    createMiniGridCells(nextGrid3);

    // Reset board
    resetBoard();

    // Event listeners
    startBtn.addEventListener('click', handleStartButton);
    document.addEventListener('keydown', handleKeyDown);
    holdGridElement.addEventListener('click', handleHoldClick);
    holdGridElement.addEventListener('touchstart', handleHoldTouch, { passive: false });

    // Touch/swipe controls
    initTouchControls();
}

function createBoardCells() {
    boardElement.innerHTML = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            boardElement.appendChild(cell);
        }
    }
}

function createMiniGridCells(element) {
    element.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        element.appendChild(cell);
    }
}

function resetBoard() {
    board = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        board[y] = [];
        for (let x = 0; x < BOARD_WIDTH; x++) {
            board[y][x] = CELL_EMPTY;
        }
    }
}

// ============================================
// GAME LOOP
// ============================================

function startGame() {
    resetBoard();
    score = 0;
    level = 1;
    lines = 0;
    holdPiece = null;
    canHold = true;
    nextQueue = [];

    updateStats();
    clearHoldDisplay();

    // Fill next queue
    for (let i = 0; i < 4; i++) {
        nextQueue.push(getRandomPiece());
    }
    updateNextDisplay();

    // Spawn first piece
    spawnPiece();

    // Start game loop
    gameState = 'playing';
    hideOverlay();
    lastDropTime = Date.now();
    gameLoop = requestAnimationFrame(update);
}

function update() {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const dropInterval = SPEEDS[Math.min(level - 1, SPEEDS.length - 1)];

    if (now - lastDropTime >= dropInterval) {
        if (!movePiece(0, 1)) {
            lockPiece();
        }
        lastDropTime = now;
    }

    render();
    gameLoop = requestAnimationFrame(update);
}

function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    cancelAnimationFrame(gameLoop);
    showOverlay('Paused', 'Press to continue', 'Resume');
}

function resumeGame() {
    if (gameState !== 'paused') return;
    gameState = 'playing';
    hideOverlay();
    lastDropTime = Date.now();
    gameLoop = requestAnimationFrame(update);
}

function endGame() {
    gameState = 'gameover';
    cancelAnimationFrame(gameLoop);

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('tetris-high-score', highScore);
        highScoreElement.textContent = highScore;
    }

    showOverlay('Game Over', `Score: ${score}`, 'Play Again');
}

// ============================================
// PIECE MANAGEMENT
// ============================================

function getRandomPiece() {
    const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    return type;
}

function spawnPiece() {
    currentPiece = nextQueue.shift();
    nextQueue.push(getRandomPiece());
    updateNextDisplay();

    currentRotation = 0;
    currentX = 3;
    currentY = 0;
    canHold = true;

    // Check if spawn position is valid
    if (!isValidPosition(currentX, currentY, currentRotation)) {
        endGame();
    }
}

function getPieceShape(type, rotation) {
    return TETROMINOS[type].shapes[rotation];
}

function isValidPosition(x, y, rotation, piece = currentPiece) {
    const shape = getPieceShape(piece, rotation);

    for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
            if (shape[py][px]) {
                const newX = x + px;
                const newY = y + py;

                // Check bounds
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return false;
                }

                // Check collision with locked pieces (ignore if above board)
                if (newY >= 0 && board[newY][newX] !== CELL_EMPTY) {
                    return false;
                }
            }
        }
    }
    return true;
}

function movePiece(dx, dy) {
    const newX = currentX + dx;
    const newY = currentY + dy;

    if (isValidPosition(newX, newY, currentRotation)) {
        currentX = newX;
        currentY = newY;
        return true;
    }
    return false;
}

function rotatePiece(direction) {
    const newRotation = (currentRotation + direction + 4) % 4;

    // Try basic rotation
    if (isValidPosition(currentX, currentY, newRotation)) {
        currentRotation = newRotation;
        return true;
    }

    // Wall kick attempts
    const kicks = [[-1, 0], [1, 0], [0, -1], [-2, 0], [2, 0]];
    for (const [kx, ky] of kicks) {
        if (isValidPosition(currentX + kx, currentY + ky, newRotation)) {
            currentX += kx;
            currentY += ky;
            currentRotation = newRotation;
            return true;
        }
    }

    return false;
}

function hardDrop() {
    let dropDistance = 0;
    while (movePiece(0, 1)) {
        dropDistance++;
    }
    score += dropDistance * 2;
    updateStats();
    lockPiece();
}

function softDrop() {
    if (movePiece(0, 1)) {
        score += 1;
        updateStats();
    }
}

function holdCurrentPiece() {
    if (!canHold) return;

    canHold = false;
    const temp = currentPiece;

    if (holdPiece) {
        currentPiece = holdPiece;
        currentRotation = 0;
        currentX = 3;
        currentY = 0;
    } else {
        spawnPiece();
    }

    holdPiece = temp;
    updateHoldDisplay();
}

function getGhostY() {
    let ghostY = currentY;
    while (isValidPosition(currentX, ghostY + 1, currentRotation)) {
        ghostY++;
    }
    return ghostY;
}

function lockPiece() {
    const shape = getPieceShape(currentPiece, currentRotation);
    const color = TETROMINOS[currentPiece].color;

    for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
            if (shape[py][px]) {
                const boardY = currentY + py;
                const boardX = currentX + px;
                if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                    board[boardY][boardX] = color;
                }
            }
        }
    }

    // Check for line clears
    checkLines();

    // Spawn next piece
    spawnPiece();
}

// ============================================
// LINE CLEARING
// ============================================

function checkLines() {
    const linesToClear = [];

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        let complete = true;
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] === CELL_EMPTY) {
                complete = false;
                break;
            }
        }
        if (complete) {
            linesToClear.push(y);
        }
    }

    if (linesToClear.length > 0) {
        // Animate line clear
        animateLineClear(linesToClear, () => {
            clearLines(linesToClear);
        });
    }
}

function animateLineClear(lineRows, callback) {
    // Add clearing class to cells
    lineRows.forEach(y => {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell = boardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                cell.classList.add('clearing');
            }
        }
    });

    // Remove after animation
    setTimeout(() => {
        lineRows.forEach(y => {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const cell = boardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (cell) {
                    cell.classList.remove('clearing');
                }
            }
        });
        callback();
    }, 300);
}

function clearLines(lineRows) {
    const numLines = lineRows.length;

    // Remove lines from top to bottom
    lineRows.sort((a, b) => a - b);
    lineRows.forEach(y => {
        board.splice(y, 1);
        board.unshift(new Array(BOARD_WIDTH).fill(CELL_EMPTY));
    });

    // Update score
    const points = LINE_POINTS[Math.min(numLines - 1, 3)] * level;
    score += points;
    lines += numLines;

    // Level up every 10 lines
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
        level = newLevel;
    }

    updateStats();
}

// ============================================
// RENDERING
// ============================================

function render() {
    // Clear board display
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell';
    });

    // Draw locked pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] !== CELL_EMPTY) {
                const cell = boardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (cell) {
                    cell.classList.add(board[y][x]);
                }
            }
        }
    }

    // Draw ghost piece
    if (currentPiece) {
        const ghostY = getGhostY();
        const shape = getPieceShape(currentPiece, currentRotation);
        const color = TETROMINOS[currentPiece].color;

        for (let py = 0; py < 4; py++) {
            for (let px = 0; px < 4; px++) {
                if (shape[py][px]) {
                    const boardY = ghostY + py;
                    const boardX = currentX + px;
                    if (boardY >= 0 && boardY < BOARD_HEIGHT) {
                        const cell = boardElement.querySelector(`[data-x="${boardX}"][data-y="${boardY}"]`);
                        if (cell && !cell.classList.contains(color)) {
                            cell.classList.add(`ghost-${color}`);
                        }
                    }
                }
            }
        }

        // Draw current piece
        for (let py = 0; py < 4; py++) {
            for (let px = 0; px < 4; px++) {
                if (shape[py][px]) {
                    const boardY = currentY + py;
                    const boardX = currentX + px;
                    if (boardY >= 0 && boardY < BOARD_HEIGHT) {
                        const cell = boardElement.querySelector(`[data-x="${boardX}"][data-y="${boardY}"]`);
                        if (cell) {
                            cell.className = 'cell ' + color;
                        }
                    }
                }
            }
        }
    }
}

function updateStats() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

function updateHoldDisplay() {
    if (!holdPiece) {
        clearHoldDisplay();
        return;
    }

    holdGridElement.classList.add('has-piece');
    const cells = holdGridElement.querySelectorAll('.cell');
    cells.forEach(cell => cell.className = 'cell');

    const shape = getPieceShape(holdPiece, 0);
    const color = TETROMINOS[holdPiece].color;

    for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
            if (shape[py][px]) {
                const idx = py * 4 + px;
                cells[idx].classList.add(color);
            }
        }
    }
}

function clearHoldDisplay() {
    holdGridElement.classList.remove('has-piece');
    const cells = holdGridElement.querySelectorAll('.cell');
    cells.forEach(cell => cell.className = 'cell');
}

function updateNextDisplay() {
    const grids = [nextGrid1, nextGrid2, nextGrid3];

    for (let i = 0; i < 3; i++) {
        const grid = grids[i];
        const piece = nextQueue[i];

        if (!piece) {
            grid.classList.remove('has-piece');
            const cells = grid.querySelectorAll('.cell');
            cells.forEach(cell => cell.className = 'cell');
            continue;
        }

        grid.classList.add('has-piece');
        const cells = grid.querySelectorAll('.cell');
        cells.forEach(cell => cell.className = 'cell');

        const shape = getPieceShape(piece, 0);
        const color = TETROMINOS[piece].color;

        for (let py = 0; py < 4; py++) {
            for (let px = 0; px < 4; px++) {
                if (shape[py][px]) {
                    const idx = py * 4 + px;
                    cells[idx].classList.add(color);
                }
            }
        }
    }
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
    if (gameState === 'playing') {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                softDrop();
                break;
            case 'ArrowUp':
                e.preventDefault();
                rotatePiece(1);
                break;
            case 'z':
            case 'Z':
                e.preventDefault();
                rotatePiece(-1);
                break;
            case ' ':
                e.preventDefault();
                hardDrop();
                break;
            case 'c':
            case 'C':
                e.preventDefault();
                holdCurrentPiece();
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

function handleHoldClick(e) {
    if (gameState !== 'playing') return;
    e.stopPropagation();
    holdCurrentPiece();
}

function handleHoldTouch(e) {
    if (gameState !== 'playing') return;
    e.preventDefault();
    e.stopPropagation();
    holdCurrentPiece();
}

// ============================================
// TOUCH / SWIPE CONTROLS
// ============================================

function initTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let lastTapTime = 0;
    let longPressTimer = null;
    let lastMoveX = 0;
    let lastMoveY = 0;
    let gestureMoved = false;
    const SWIPE_THRESHOLD = 15;
    const TAP_THRESHOLD = 10;
    const DOUBLE_TAP_DELAY = 300;
    const LONG_PRESS_DELAY = 500;

    const gameArea = document.querySelector('.tetris-page');

    gameArea.addEventListener('touchstart', (e) => {
        if (gameState !== 'playing') return;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        lastMoveX = touchStartX;
        lastMoveY = touchStartY;
        gestureMoved = false;

        // Start long press timer
        longPressTimer = setTimeout(() => {
            pauseGame();
        }, LONG_PRESS_DELAY);
    }, { passive: true });

    gameArea.addEventListener('touchmove', (e) => {
        if (gameState !== 'playing') return;

        // Cancel long press on move
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - lastMoveX;
        const deltaY = touchY - lastMoveY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX >= SWIPE_THRESHOLD && absX >= absY) {
            const steps = Math.floor(absX / SWIPE_THRESHOLD);
            const direction = deltaX > 0 ? 1 : -1;
            for (let i = 0; i < steps; i++) {
                movePiece(direction, 0);
            }
            lastMoveX = touchX;
            lastMoveY = touchY;
            gestureMoved = true;
        }
    }, { passive: true });

    gameArea.addEventListener('touchend', (e) => {
        if (gameState !== 'playing') return;

        // Cancel long press
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        if (gestureMoved) {
            gestureMoved = false;
            return;
        }

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const touchDuration = Date.now() - touchStartTime;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Check for tap (minimal movement)
        if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD && touchDuration < 300) {
            rotatePiece(1);
            return;
        }

        // Swipe detection
        if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
            if (absX > absY) {
                // Horizontal swipe
                if (deltaX > 0) {
                    movePiece(1, 0); // Right
                } else {
                    movePiece(-1, 0); // Left
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    hardDrop(); // Down = hard drop
                } else {
                    holdCurrentPiece(); // Up = hold
                }
            }
        }
    }, { passive: true });

    // Prevent default touch behaviors on game area
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
