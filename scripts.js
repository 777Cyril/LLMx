const now = new Date();
let currentSide = "left";

function applyTimeBasedTheme() {
    const now = new Date();
    const hour = now.getHours();
  
    if (hour >= 19 || hour < 7) {
      document.documentElement.classList.add('darkmode');
    } else {
      document.documentElement.classList.remove('darkmode');
    }
  }
  
  applyTimeBasedTheme();

  
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