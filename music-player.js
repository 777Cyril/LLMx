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
let isExpanded = false;

// UI Elements
const musicPlayer = document.getElementById('music-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackName = document.getElementById('track-name');

// Toggle player expansion
musicPlayer.addEventListener('click', (e) => {
    // Don't toggle if clicking on control buttons
    if (e.target.closest('.control-btn')) return;

    if (!isExpanded) {
        expandPlayer();
        if (player && !isPlaying) {
            player.playVideo();
        }
    }
});

function expandPlayer() {
    musicPlayer.classList.add('expanded');
    isExpanded = true;
}

function collapsePlayer() {
    musicPlayer.classList.remove('expanded');
    isExpanded = false;
}

// Auto-collapse after inactivity (optional - can be removed if you want it always expanded when playing)
let collapseTimeout;
function resetCollapseTimeout() {
    clearTimeout(collapseTimeout);
    if (isPlaying) {
        collapseTimeout = setTimeout(() => {
            if (!musicPlayer.matches(':hover')) {
                collapsePlayer();
            }
        }, 5000);
    }
}

musicPlayer.addEventListener('mouseenter', () => {
    if (isPlaying && !isExpanded) {
        expandPlayer();
    }
    clearTimeout(collapseTimeout);
});

musicPlayer.addEventListener('mouseleave', () => {
    if (isPlaying) {
        resetCollapseTimeout();
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
    trackName.textContent = '';

    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
            expandPlayer();
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.previousVideo();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.nextVideo();
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseButton(true);
        updateTrackInfo();
        expandPlayer();
        resetCollapseTimeout();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseButton(false);
        clearTimeout(collapseTimeout);
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
