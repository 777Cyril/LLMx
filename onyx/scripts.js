// Toggle darkmode based on local time
function applyTimeBasedTheme() {
    const hour = new Date().getHours();
    document.documentElement.classList.toggle('darkmode', hour >= 19 || hour < 7);
}
applyTimeBasedTheme();

// Slide panels left↔right on mousemove or device tilt
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
