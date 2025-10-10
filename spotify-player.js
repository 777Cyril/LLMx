// Spotify Player Configuration
const SPOTIFY_CONFIG = {
    clientId: '1e96cd30eeee45e5a24522ae3df8082d', // Replace with your Client ID
    redirectUri: 'https://llmxai.co/callback',
    scopes: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state'
    ],
    playlistUri: 'spotify:playlist:28NUO4BqecLblXnHPGzjSF'
};

let player;
let deviceId;
let accessToken;

// UI Elements
const musicToggle = document.getElementById('music-toggle');
const playerOverlay = document.getElementById('player-overlay');
const closePlayer = document.getElementById('close-player');
const spotifyLoginBtn = document.getElementById('spotify-login');
const authSection = document.getElementById('auth-section');
const playerSection = document.getElementById('player-section');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackName = document.getElementById('track-name');
const trackArtist = document.getElementById('track-artist');

// Event Listeners
musicToggle.addEventListener('click', () => {
    playerOverlay.classList.remove('hidden');
});

closePlayer.addEventListener('click', () => {
    playerOverlay.classList.add('hidden');
});

playerOverlay.addEventListener('click', (e) => {
    if (e.target === playerOverlay) {
        playerOverlay.classList.add('hidden');
    }
});

spotifyLoginBtn.addEventListener('click', initiateSpotifyAuth);

// Check for auth callback
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
        accessToken = token;
        localStorage.setItem('spotify_access_token', token);
        window.location.hash = '';
        initializePlayer();
    } else {
        const storedToken = localStorage.getItem('spotify_access_token');
        if (storedToken) {
            accessToken = storedToken;
            initializePlayer();
        }
    }
});

function initiateSpotifyAuth() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${SPOTIFY_CONFIG.clientId}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.redirectUri)}&` +
        `scope=${encodeURIComponent(SPOTIFY_CONFIG.scopes.join(' '))}`;

    window.location.href = authUrl;
}

function initializePlayer() {
    authSection.classList.add('hidden');
    playerSection.classList.remove('hidden');

    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: 'LLMx Player',
            getOAuthToken: cb => { cb(accessToken); },
            volume: 0.5
        });

        // Player ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            deviceId = device_id;
            startPlaylist();
        });

        // Player state changed
        player.addListener('player_state_changed', state => {
            if (!state) return;

            const currentTrack = state.track_window.current_track;
            trackName.textContent = currentTrack.name;
            trackArtist.textContent = currentTrack.artists.map(a => a.name).join(', ');

            updatePlayPauseButton(!state.paused);
        });

        // Connect to the player
        player.connect();
    };

    // Control buttons
    playPauseBtn.addEventListener('click', () => {
        player.togglePlay();
    });

    prevBtn.addEventListener('click', () => {
        player.previousTrack();
    });

    nextBtn.addEventListener('click', () => {
        player.nextTrack();
    });
}

function updatePlayPauseButton(isPlaying) {
    playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
}

async function startPlaylist() {
    try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({
                context_uri: SPOTIFY_CONFIG.playlistUri,
                offset: { position: 0 },
                position_ms: 0
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        console.error('Error starting playback:', error);
    }
}
