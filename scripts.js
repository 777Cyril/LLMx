const now = new Date();
let currentSide = "left";

function applyTimeBasedTheme() {
    const hour = new Date().getHours();
    document.documentElement.classList.toggle('darkmode', hour >= 19 || hour < 7);
}

function updateToggleLabel() {
    const btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    btn.textContent = document.documentElement.classList.contains('darkmode') ? 'Light' : 'Dark';
}

function applyTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.classList.toggle('darkmode', saved === 'dark');
    } else {
        applyTimeBasedTheme();
    }
    updateToggleLabel();
}

applyTheme();

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('dark-mode-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('darkmode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateToggleLabel();
        });
    }
});

  
document.addEventListener("mousemove", (event) => {
    const isLeft = event.clientX < window.innerWidth / 2;
    const targetSide = isLeft ? 'left' : 'right';

    if (currentSide !== targetSide) {
        document.body.classList.remove(currentSide);
        document.body.classList.add(targetSide);
        currentSide = targetSide;
    }
});

window.addEventListener("deviceorientation", (event) => {
    const gamma = event.gamma;
    const isLeft = event.gamma < 0;
    const targetSide = isLeft ? 'left' : 'right';

    if (currentSide !== targetSide) {
        document.body.classList.remove(currentSide);
        document.body.classList.add(targetSide);
        currentSide = targetSide;
    }
});