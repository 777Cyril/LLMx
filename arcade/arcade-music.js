// Arcade Shuffle Music Player
// Picks a random song on page load, plays the next (non-repeating) song when one ends.

(function () {
  const SONGS = [
    '/arcade/arcade_music/background-music.mp3',
    '/arcade/arcade_music/clairo-juna-live-full-jimmy.mp3',
    '/arcade/arcade_music/Days Are Cold by Shawny Binladen.mp3',
    '/arcade/arcade_music/Hiatus Kaiyote Building A Ladder Live.mp3',
    '/arcade/arcade_music/Is It a Crime (Remastered) - Sade.mp3',
    '/arcade/arcade_music/No Ordinary Love.mp3',
    '/arcade/arcade_music/Sade - I Will Be Your Friend.mp3',
    '/arcade/arcade_music/Sade - Kiss Of Life - Official - 1993.mp3',
    '/arcade/arcade_music/Sade - Like a Tattoo (Audio).mp3',
    '/arcade/arcade_music/Sade - Lovers Rock (Audio).mp3',
    '/arcade/arcade_music/Swapa - Meeting God.mp3',
    '/arcade/arcade_music/The Sweetest Taboo - Sade.mp3',
    '/arcade/arcade_music/old habits - swapa.mp3',
  ];

  // Build a shuffled queue that never repeats back-to-back
  function buildQueue(currentIndex) {
    const indices = Array.from({ length: SONGS.length }, (_, i) => i)
      .filter(i => i !== currentIndex);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }

  // Pick a random starting song for this page load
  let currentIndex = Math.floor(Math.random() * SONGS.length);
  let queue = buildQueue(currentIndex);

  const music = document.getElementById('background-music');
  const musicToggle = document.getElementById('music-toggle');
  let musicEnabled = localStorage.getItem('musicEnabled') !== 'false';

  function loadSong(index) {
    music.src = SONGS[index];
    music.load();
  }

  function playNextSong() {
    if (queue.length === 0) {
      queue = buildQueue(currentIndex);
    }
    currentIndex = queue.shift();
    loadSong(currentIndex);
    if (musicEnabled) {
      music.play().catch(e => console.log('Music play failed:', e));
    }
  }

  // Load the starting song immediately (don't autoplay yet — wait for user interaction)
  loadSong(currentIndex);

  // When current song ends, play the next one
  music.addEventListener('ended', playNextSong);

  // Toggle button
  musicToggle.classList.toggle('active', musicEnabled);

  musicToggle.addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    musicToggle.classList.toggle('active', musicEnabled);
    localStorage.setItem('musicEnabled', musicEnabled);

    if (musicEnabled) {
      music.play().catch(e => console.log('Music play failed:', e));
    } else {
      music.pause();
    }
  });

  // Auto-play on game start — only advance song on a fresh start, not on resume
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!musicEnabled) return;
      // gameState is defined by each game's JS and is 'paused' when resuming
      const isResuming = typeof gameState !== 'undefined' && gameState === 'paused';
      if (isResuming) {
        // Just unpause the current song, same as pressing P
        music.play().catch(e => console.log('Music play failed:', e));
      } else {
        // Fresh start or game over restart — advance to next song
        playNextSong();
      }
    });
  }
})();
