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

// Play/pause SVG icons
const playIcon = '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2l10 6-10 6V2z"/></svg>';
const pauseIcon = '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><rect x="4.5" y="2" width="2.5" height="12"/><rect x="9" y="2" width="2.5" height="12"/></svg>';

// Toggle player expansion
musicPlayer.addEventListener('click', (e) => {
    // Don't toggle if clicking on control buttons
    if (e.target.closest('.control-btn')) return;

    if (!isExpanded && player) {
        expandPlayer();
        if (!isPlaying) {
            // Play a random video from the shuffled playlist
            playRandomSong();
        }
    }
});

function playRandomSong() {
    // YouTube's embedded player API has limitations with shuffle
    // We'll manually select a random video from the playlist
    try {
        const playlist = player.getPlaylist();
        if (playlist && playlist.length > 0) {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            console.log('Playing random index:', randomIndex, 'of', playlist.length);
            player.playVideoAt(randomIndex);
        } else {
            // Fallback: try to load playlist info and play random
            setTimeout(() => {
                const retryPlaylist = player.getPlaylist();
                if (retryPlaylist && retryPlaylist.length > 0) {
                    const randomIndex = Math.floor(Math.random() * retryPlaylist.length);
                    console.log('Retry: Playing random index:', randomIndex);
                    player.playVideoAt(randomIndex);
                } else {
                    // Last resort: just play
                    player.playVideo();
                }
            }, 500);
        }
    } catch (error) {
        console.log('Error playing random song:', error);
        player.playVideo();
    }
}

function expandPlayer() {
    musicPlayer.classList.add('expanded');
    isExpanded = true;

    // Force reflow to ensure animation triggers properly on mobile
    void trackName.offsetWidth;
}

function collapsePlayer() {
    musicPlayer.classList.remove('expanded');
    isExpanded = false;
}

// Auto-collapse after inactivity
let collapseTimeout;
function resetCollapseTimeout() {
    clearTimeout(collapseTimeout);
    if (isPlaying && isExpanded) {
        collapseTimeout = setTimeout(() => {
            collapsePlayer();
        }, 5000);
    }
}

// Touch/interaction tracking for mobile
let lastInteractionTime = Date.now();

musicPlayer.addEventListener('mouseenter', () => {
    if (isPlaying && !isExpanded) {
        expandPlayer();
    }
    clearTimeout(collapseTimeout);
    lastInteractionTime = Date.now();
});

musicPlayer.addEventListener('mouseleave', () => {
    if (isPlaying) {
        resetCollapseTimeout();
    }
});

// Track touches on mobile
musicPlayer.addEventListener('touchstart', () => {
    lastInteractionTime = Date.now();
    clearTimeout(collapseTimeout);
});

musicPlayer.addEventListener('touchend', () => {
    if (isPlaying && isExpanded) {
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
    // Enable shuffle mode
    player.setShuffle(true);

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
    playPauseBtn.innerHTML = playing ? pauseIcon : playIcon;
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
