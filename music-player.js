// YouTube Player Configuration
const YOUTUBE_CONFIG = {
    playlistId: 'PLtRGs3WbCee5XjDsoNdwdUL-txQr6aC_R',
    playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3
    }
};

let player;
let isPlaying = false;

// UI Elements
const musicToggle = document.getElementById('music-toggle');
const playerOverlay = document.getElementById('player-overlay');
const closePlayer = document.getElementById('close-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackName = document.getElementById('track-name');

// Event Listeners
musicToggle.addEventListener('click', () => {
    playerOverlay.classList.remove('hidden');
    if (player && !isPlaying) {
        player.playVideo();
    }
});

closePlayer.addEventListener('click', () => {
    playerOverlay.classList.add('hidden');
});

playerOverlay.addEventListener('click', (e) => {
    if (e.target === playerOverlay) {
        playerOverlay.classList.add('hidden');
    }
});

// YouTube API Ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
            ...YOUTUBE_CONFIG.playerVars,
            listType: 'playlist',
            list: YOUTUBE_CONFIG.playlistId
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    trackName.textContent = 'Ready to play';

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    prevBtn.addEventListener('click', () => {
        player.previousVideo();
    });

    nextBtn.addEventListener('click', () => {
        player.nextVideo();
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseButton(true);
        updateTrackInfo();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseButton(false);
    } else if (event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        updatePlayPauseButton(false);
    }
}

function updatePlayPauseButton(playing) {
    playPauseBtn.textContent = playing ? '⏸' : '▶';
}

function updateTrackInfo() {
    try {
        const videoData = player.getVideoData();
        if (videoData && videoData.title) {
            trackName.textContent = videoData.title;
        }
    } catch (error) {
        console.log('Could not get video data');
    }
}

// Update track info periodically when playing
setInterval(() => {
    if (isPlaying) {
        updateTrackInfo();
    }
}, 2000);

// Make function available globally for YouTube API
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
