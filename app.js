// Video audio control
const video = document.getElementById('bgVideo');
const unmuteButton = document.getElementById('unmuteButton');
const replayButton = document.getElementById('replayButton');

// Function to check if device is mobile
const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

// Function to play video
const playVideo = async () => {
    try {
        video.muted = true; // Must be muted for autoplay
        const playPromise = video.play();
        if (playPromise !== undefined) {
            await playPromise;
            console.log('Video started playing');
        }
    } catch (err) {
        console.error('Video play failed:', err);
        // Retry play after a short delay
        setTimeout(playVideo, 1000);
    }
};

// Function to set correct video source
const setVideoSource = () => {
    const currentTime = video.currentTime;
    const wasPaused = video.paused;
    
    if (window.innerWidth < 768) {
        video.src = '/background-mobile.mp4';
    } else {
        video.src = '/background.mp4';
    }
    
    video.load();
    playVideo(); // Try to play immediately after source change
};

// Handle window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(setVideoSource, 250);
});

// Start video muted (browser requirement)
video.muted = true;
video.volume = 1.0;
unmuteButton.classList.add('muted');

// Play video when it's loaded
video.addEventListener('loadedmetadata', playVideo);
video.addEventListener('loadeddata', playVideo);

// Ensure video plays on user interaction
document.addEventListener('click', playVideo, { once: true });
document.addEventListener('touchstart', playVideo, { once: true });

// Show replay button when video ends
video.addEventListener('ended', () => {
    replayButton.classList.add('show');
});

// Handle replay button click
replayButton.addEventListener('click', () => {
    video.currentTime = 0;
    replayButton.classList.remove('show');
    playVideo();
});

// Handle unmute button click
const handleUnmute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    video.muted = !video.muted;
    unmuteButton.classList.toggle('muted');
    
    if (!video.muted) {
        video.volume = 1.0;
        playVideo(); // Try to play when unmuting
    }
};

unmuteButton.addEventListener('click', handleUnmute);
unmuteButton.addEventListener('touchend', handleUnmute);

// Initial video source setup
document.addEventListener('DOMContentLoaded', () => {
    setVideoSource();
    playVideo(); // Try to play on page load
});

// Email subscription form
document.getElementById('subscribeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const submitButton = e.target.querySelector('button');
    const buttonText = submitButton.querySelector('.button-text');
    const successMessage = document.querySelector('.success-message');
    const email = emailInput.value;
    
    try {
        submitButton.disabled = true;
        buttonText.textContent = 'Subscribing...';
        
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to subscribe');
        }
        
        emailInput.value = '';
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    } catch (error) {
        console.error('Subscription error:', error);
        alert(error.message || 'Failed to subscribe. Please try again.');
    } finally {
        submitButton.disabled = false;
        buttonText.textContent = 'JOIN';
    }
});
