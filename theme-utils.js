// Shared theme and side-panel utilities.
// Used by pages that don't need the full localStorage-persisted theme toggle
// (see /scripts.js for the version with toggle button + localStorage).

function applyTimeBasedTheme() {
    const hour = new Date().getHours();
    document.documentElement.classList.toggle('darkmode', hour >= 19 || hour < 7);
}

let currentSide = "left";

function setSide(target) {
    if (currentSide === target) return;
    document.body.classList.replace(currentSide, target);
    currentSide = target;
}

document.addEventListener("mousemove", (event) => {
    setSide(event.clientX < window.innerWidth / 2 ? 'left' : 'right');
});

window.addEventListener("deviceorientation", (event) => {
    setSide(event.gamma < 0 ? 'left' : 'right');
});

applyTimeBasedTheme();
