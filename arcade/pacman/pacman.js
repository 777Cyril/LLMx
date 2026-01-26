// ============================================
// PAC-MAN - LLMx Arcade
// ============================================

document.addEventListener('DOMContentLoaded', function() {

// ============================================
// CONSTANTS
// ============================================

const GRID_SIZE = 21;
const TICK_RATE = 180;
const GHOST_TICK_RATE = 220;
const POWER_DURATION = 8000;
const GHOST_SPAWN_DELAY = [0, 3000, 6000, 9000];
const STARTING_LIVES = 3;
const SCATTER_DURATION = 7000;
const CHASE_DURATION = 20000;

// Maze layout: 0=path, 1=wall, 2=pellet, 3=power pellet, 4=ghost house, 5=ghost door
const MAZE_TEMPLATE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,2,1,1,1,1,2,1,2,1,1,1,1,2,1,1,3,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,1,0,1,0,1,1,1,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,5,4,5,1,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,4,4,4,4,4,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,1,1,0,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,1,2,1,2,1,1,1,1,2,1,1,2,1],
    [1,3,2,1,2,2,2,2,2,2,0,2,2,2,2,2,2,1,2,3,1],
    [1,1,2,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Ghost scatter corners
const SCATTER_TARGETS = {
    blinky: { x: 19, y: 0 },
    pinky: { x: 1, y: 0 },
    inky: { x: 19, y: 20 },
    clyde: { x: 1, y: 20 }
};

// ============================================
// GAME STATE
// ============================================

let maze = [];
let pelletCount = 0;
let totalPellets = 0;

let pacman = null;
let ghosts = [];

let score = 0;
let level = 1;
let lives = STARTING_LIVES;
let highScore = 0;

let gameLoop = null;
let ghostLoop = null;
let gameState = 'idle';
let frightened = false;
let frightenedTimer = null;
let frightenedEnding = false;
let ghostsEatenCombo = 0;
let modeTimer = null;
let currentMode = 'scatter';

// ============================================
// DOM ELEMENTS
// ============================================

const boardElement = document.getElementById('pacman-board');
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
    highScore = parseInt(localStorage.getItem('pacman-high-score')) || 0;
    highScoreElement.textContent = highScore;

    createMaze();
    createBoardCells();
    initPacman();
    initGhosts();
    updateStats();
    render();

    startBtn.addEventListener('click', handleStartButton);
    document.addEventListener('keydown', handleKeyDown);
    initTouchControls();
}

function createMaze() {
    maze = [];
    pelletCount = 0;
    totalPellets = 0;

    for (let y = 0; y < GRID_SIZE; y++) {
        maze[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            maze[y][x] = MAZE_TEMPLATE[y][x];
            if (maze[y][x] === 2 || maze[y][x] === 3) {
                totalPellets++;
            }
        }
    }
    pelletCount = totalPellets;
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

function initPacman() {
    pacman = {
        x: 10,
        y: 15,
        direction: { x: 0, y: 0 },
        nextDirection: { x: -1, y: 0 },
        dirName: 'left'
    };
}

function initGhosts() {
    ghosts = [
        { name: 'blinky', x: 10, y: 9, color: 'blinky', mode: 'scatter', startDelay: GHOST_SPAWN_DELAY[0], released: true, home: { x: 10, y: 9 } },
        { name: 'pinky', x: 9, y: 9, color: 'pinky', mode: 'scatter', startDelay: GHOST_SPAWN_DELAY[1], released: false, home: { x: 9, y: 9 } },
        { name: 'inky', x: 11, y: 9, color: 'inky', mode: 'scatter', startDelay: GHOST_SPAWN_DELAY[2], released: false, home: { x: 11, y: 9 } },
        { name: 'clyde', x: 10, y: 10, color: 'clyde', mode: 'scatter', startDelay: GHOST_SPAWN_DELAY[3], released: false, home: { x: 10, y: 10 } }
    ];

    // Schedule ghost releases
    ghosts.forEach((ghost, index) => {
        if (!ghost.released) {
            setTimeout(() => {
                if (gameState === 'playing') {
                    ghost.released = true;
                    ghost.x = 10;
                    ghost.y = 7;
                }
            }, ghost.startDelay);
        }
    });
}

// ============================================
// GAME LOOP
// ============================================

function startGame() {
    score = 0;
    level = 1;
    lives = STARTING_LIVES;
    frightened = false;
    frightenedEnding = false;
    currentMode = 'scatter';

    createMaze();
    createBoardCells();
    initPacman();
    initGhosts();
    updateStats();

    gameState = 'playing';
    hideOverlay();

    startModeTimer();

    if (gameLoop) clearInterval(gameLoop);
    if (ghostLoop) clearInterval(ghostLoop);
    gameLoop = setInterval(updatePacman, TICK_RATE);
    ghostLoop = setInterval(updateGhosts, GHOST_TICK_RATE);

    render();
}

function startLevel() {
    frightened = false;
    frightenedEnding = false;
    currentMode = 'scatter';

    createMaze();
    createBoardCells();
    initPacman();
    initGhosts();

    startModeTimer();

    if (gameLoop) clearInterval(gameLoop);
    if (ghostLoop) clearInterval(ghostLoop);
    gameLoop = setInterval(updatePacman, TICK_RATE);
    ghostLoop = setInterval(updateGhosts, Math.max(120, GHOST_TICK_RATE - level * 10));

    render();
}

function startModeTimer() {
    if (modeTimer) clearTimeout(modeTimer);
    currentMode = 'scatter';

    modeTimer = setTimeout(() => {
        if (gameState === 'playing' && !frightened) {
            currentMode = 'chase';
            scheduleModeSwitch();
        }
    }, SCATTER_DURATION);
}

function scheduleModeSwitch() {
    if (modeTimer) clearTimeout(modeTimer);

    modeTimer = setTimeout(() => {
        if (gameState === 'playing' && !frightened) {
            currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
            scheduleModeSwitch();
        }
    }, currentMode === 'scatter' ? SCATTER_DURATION : CHASE_DURATION);
}

function updatePacman() {
    if (gameState !== 'playing') return;

    // Try to change direction if requested
    const nextX = pacman.x + pacman.nextDirection.x;
    const nextY = pacman.y + pacman.nextDirection.y;

    if (canMove(nextX, nextY)) {
        pacman.direction = { ...pacman.nextDirection };
        updateDirName();
    }

    // Move in current direction
    const newX = pacman.x + pacman.direction.x;
    const newY = pacman.y + pacman.direction.y;

    if (canMove(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;

        // Wrap around tunnels
        if (pacman.x < 0) pacman.x = GRID_SIZE - 1;
        if (pacman.x >= GRID_SIZE) pacman.x = 0;

        // Check for pellets
        checkPellet();
    }

    // Check ghost collisions
    checkGhostCollision();

    render();
}

function updateGhosts() {
    if (gameState !== 'playing') return;

    ghosts.forEach(ghost => {
        if (!ghost.released) return;

        const target = getGhostTarget(ghost);
        const possibleMoves = getPossibleMoves(ghost);

        if (possibleMoves.length === 0) return;

        // Choose best move toward target (or random if frightened)
        let bestMove = possibleMoves[0];

        if (ghost.mode === 'frightened') {
            bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else if (ghost.mode === 'eaten') {
            // Go back to ghost house
            let bestDist = Infinity;
            possibleMoves.forEach(move => {
                const dist = distance(move.x, move.y, 10, 9);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestMove = move;
                }
            });

            // Check if back at ghost house
            if (ghost.x === 10 && ghost.y === 9) {
                ghost.mode = currentMode;
            }
        } else {
            let bestDist = Infinity;
            possibleMoves.forEach(move => {
                const dist = distance(move.x, move.y, target.x, target.y);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestMove = move;
                }
            });
        }

        ghost.prevX = ghost.x;
        ghost.prevY = ghost.y;
        ghost.x = bestMove.x;
        ghost.y = bestMove.y;

        // Wrap around tunnels
        if (ghost.x < 0) ghost.x = GRID_SIZE - 1;
        if (ghost.x >= GRID_SIZE) ghost.x = 0;
    });

    checkGhostCollision();
    render();
}

function getGhostTarget(ghost) {
    if (ghost.mode === 'scatter') {
        return SCATTER_TARGETS[ghost.name];
    }

    if (ghost.mode === 'frightened' || ghost.mode === 'eaten') {
        return { x: ghost.x, y: ghost.y };
    }

    // Chase mode - each ghost has different targeting
    switch (ghost.name) {
        case 'blinky':
            // Directly chase Pac-Man
            return { x: pacman.x, y: pacman.y };

        case 'pinky':
            // Target 4 tiles ahead of Pac-Man
            return {
                x: pacman.x + pacman.direction.x * 4,
                y: pacman.y + pacman.direction.y * 4
            };

        case 'inky':
            // Complex targeting based on Blinky and Pac-Man
            const blinky = ghosts.find(g => g.name === 'blinky');
            const aheadX = pacman.x + pacman.direction.x * 2;
            const aheadY = pacman.y + pacman.direction.y * 2;
            return {
                x: aheadX + (aheadX - blinky.x),
                y: aheadY + (aheadY - blinky.y)
            };

        case 'clyde':
            // Chase when far, scatter when close
            const dist = distance(ghost.x, ghost.y, pacman.x, pacman.y);
            if (dist > 8) {
                return { x: pacman.x, y: pacman.y };
            }
            return SCATTER_TARGETS.clyde;

        default:
            return { x: pacman.x, y: pacman.y };
    }
}

function getPossibleMoves(ghost) {
    const moves = [];
    const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 }
    ];

    directions.forEach(dir => {
        const newX = ghost.x + dir.x;
        const newY = ghost.y + dir.y;

        // Don't reverse direction (unless frightened just started)
        if (ghost.prevX !== undefined && newX === ghost.prevX && newY === ghost.prevY) {
            return;
        }

        if (canGhostMove(newX, newY, ghost.mode === 'eaten')) {
            moves.push({ x: newX, y: newY });
        }
    });

    // If no moves (corner case), allow reversing
    if (moves.length === 0) {
        directions.forEach(dir => {
            const newX = ghost.x + dir.x;
            const newY = ghost.y + dir.y;
            if (canGhostMove(newX, newY, ghost.mode === 'eaten')) {
                moves.push({ x: newX, y: newY });
            }
        });
    }

    return moves;
}

function canMove(x, y) {
    // Handle tunnel wrapping
    if (x < 0 || x >= GRID_SIZE) return true;
    if (y < 0 || y >= GRID_SIZE) return false;

    const cell = maze[y][x];
    return cell !== 1 && cell !== 4 && cell !== 5;
}

function canGhostMove(x, y, isEaten) {
    if (x < 0 || x >= GRID_SIZE) return true;
    if (y < 0 || y >= GRID_SIZE) return false;

    const cell = maze[y][x];
    if (cell === 1) return false;
    if (cell === 5 && !isEaten) return false; // Ghost door only for eaten ghosts
    return true;
}

function checkPellet() {
    const cell = maze[pacman.y][pacman.x];

    if (cell === 2) {
        maze[pacman.y][pacman.x] = 0;
        score += 10;
        pelletCount--;
        updateStats();
        checkLevelComplete();
    } else if (cell === 3) {
        maze[pacman.y][pacman.x] = 0;
        score += 50;
        pelletCount--;
        updateStats();
        activatePowerMode();
        checkLevelComplete();
    }
}

function activatePowerMode() {
    frightened = true;
    frightenedEnding = false;
    ghostsEatenCombo = 0;

    ghosts.forEach(ghost => {
        if (ghost.released && ghost.mode !== 'eaten') {
            ghost.mode = 'frightened';
            // Allow reversing direction when frightened
            ghost.prevX = undefined;
            ghost.prevY = undefined;
        }
    });

    if (frightenedTimer) clearTimeout(frightenedTimer);

    // Warning flash before power ends
    setTimeout(() => {
        if (gameState === 'playing' && frightened) {
            frightenedEnding = true;
            render();
        }
    }, POWER_DURATION - 2000);

    frightenedTimer = setTimeout(() => {
        if (gameState === 'playing') {
            frightened = false;
            frightenedEnding = false;
            ghosts.forEach(ghost => {
                if (ghost.mode === 'frightened') {
                    ghost.mode = currentMode;
                }
            });
            render();
        }
    }, POWER_DURATION);
}

function checkGhostCollision() {
    ghosts.forEach(ghost => {
        if (!ghost.released) return;

        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            if (ghost.mode === 'frightened') {
                eatGhost(ghost);
            } else if (ghost.mode !== 'eaten') {
                pacmanDeath();
            }
        }
    });
}

function eatGhost(ghost) {
    ghost.mode = 'eaten';
    ghostsEatenCombo++;
    const points = 200 * Math.pow(2, ghostsEatenCombo - 1);
    score += points;
    updateStats();
}

function pacmanDeath() {
    gameState = 'dying';
    if (gameLoop) clearInterval(gameLoop);
    if (ghostLoop) clearInterval(ghostLoop);
    if (modeTimer) clearTimeout(modeTimer);
    if (frightenedTimer) clearTimeout(frightenedTimer);

    lives--;
    updateStats();

    setTimeout(() => {
        if (lives <= 0) {
            endGame();
        } else {
            // Reset positions but keep score and level
            initPacman();
            initGhosts();
            frightened = false;
            frightenedEnding = false;
            currentMode = 'scatter';

            gameState = 'playing';
            startModeTimer();

            gameLoop = setInterval(updatePacman, TICK_RATE);
            ghostLoop = setInterval(updateGhosts, Math.max(120, GHOST_TICK_RATE - level * 10));
            render();
        }
    }, 1000);
}

function checkLevelComplete() {
    if (pelletCount <= 0) {
        gameState = 'levelcomplete';
        if (gameLoop) clearInterval(gameLoop);
        if (ghostLoop) clearInterval(ghostLoop);
        if (modeTimer) clearTimeout(modeTimer);
        if (frightenedTimer) clearTimeout(frightenedTimer);

        level++;
        updateStats();

        setTimeout(() => {
            if (gameState === 'levelcomplete') {
                gameState = 'playing';
                startLevel();
            }
        }, 2000);
    }
}

function endGame() {
    gameState = 'gameover';
    if (gameLoop) clearInterval(gameLoop);
    if (ghostLoop) clearInterval(ghostLoop);
    if (modeTimer) clearTimeout(modeTimer);
    if (frightenedTimer) clearTimeout(frightenedTimer);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('pacman-high-score', highScore);
        highScoreElement.textContent = highScore;
    }

    showOverlay('Game Over', `Score: ${score}`, 'Play Again');
}

function updateDirName() {
    if (pacman.direction.x === 1) pacman.dirName = 'right';
    else if (pacman.direction.x === -1) pacman.dirName = 'left';
    else if (pacman.direction.y === -1) pacman.dirName = 'up';
    else if (pacman.direction.y === 1) pacman.dirName = 'down';
}

function distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// ============================================
// RENDERING
// ============================================

function render() {
    const cells = boardElement.querySelectorAll('.cell');

    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const mazeCell = maze[y][x];

        // Reset classes
        cell.className = 'cell';

        // Set cell type
        if (mazeCell === 1) {
            cell.classList.add('wall');
        } else if (mazeCell === 2) {
            cell.classList.add('path', 'pellet');
        } else if (mazeCell === 3) {
            cell.classList.add('path', 'power-pellet');
        } else if (mazeCell === 4 || mazeCell === 5) {
            cell.classList.add('ghost-house');
        } else {
            cell.classList.add('path');
        }
    });

    // Render Pac-Man
    const pacmanCell = boardElement.querySelector(`[data-x="${pacman.x}"][data-y="${pacman.y}"]`);
    if (pacmanCell) {
        pacmanCell.classList.add('pacman', `dir-${pacman.dirName}`);
    }

    // Render ghosts
    ghosts.forEach(ghost => {
        if (!ghost.released && ghost.mode !== 'eaten') return;

        const ghostCell = boardElement.querySelector(`[data-x="${ghost.x}"][data-y="${ghost.y}"]`);
        if (ghostCell) {
            ghostCell.classList.add('ghost', ghost.color);

            if (ghost.mode === 'frightened') {
                ghostCell.classList.add('frightened');
                if (frightenedEnding) {
                    ghostCell.classList.add('ending');
                }
            } else if (ghost.mode === 'eaten') {
                ghostCell.classList.add('eaten');
            }
        }
    });
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

function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    if (gameLoop) clearInterval(gameLoop);
    if (ghostLoop) clearInterval(ghostLoop);
    showOverlay('Paused', 'Tap or press P to continue', 'Resume');
}

function resumeGame() {
    if (gameState !== 'paused') return;
    gameState = 'playing';
    hideOverlay();
    gameLoop = setInterval(updatePacman, TICK_RATE);
    ghostLoop = setInterval(updateGhosts, Math.max(120, GHOST_TICK_RATE - level * 10));
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
    pacman.nextDirection = { x: dx, y: dy };
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
    const gameArea = document.querySelector('.pacman-page');
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

        // Tap to pause/resume
        if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
            if (gameState === 'playing') {
                pauseGame();
            } else if (gameState === 'paused') {
                resumeGame();
            }
            return;
        }

        // Swipe to move
        if (gameState === 'playing') {
            if (absX > absY) {
                setDirection(deltaX > 0 ? 1 : -1, 0);
            } else {
                setDirection(0, deltaY > 0 ? 1 : -1);
            }
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
