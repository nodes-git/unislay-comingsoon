// Video audio control
const video = document.getElementById('bgVideo');
const unmuteButton = document.getElementById('unmuteButton');
const replayButton = document.getElementById('replayButton');

// Function to check if device is mobile
const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

// Function to set correct video source
const setVideoSource = () => {
    const sources = video.getElementsByTagName('source');
    const currentTime = video.currentTime;
    const wasPaused = video.paused;
    
    // Store the current muted state
    const wasMuted = video.muted;
    
    // Force reload the video to switch source
    video.load();
    
    // Restore playback state
    video.currentTime = currentTime;
    if (!wasPaused) {
        video.play();
    }
    
    // Restore muted state
    video.muted = wasMuted;
};

// Update video source based on screen width
function updateVideoSource() {
    const currentTime = video.currentTime;
    const isPaused = video.paused;
    
    if (window.innerWidth < 768) {
        video.src = 'background-mobile.mp4';
    } else {
        video.src = 'background.mp4';
    }
    
    video.currentTime = currentTime;
    if (!isPaused) {
        video.play();
    }
}

// Handle window resize
let lastIsMobile = isMobile();
window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (lastIsMobile !== nowMobile) {
        lastIsMobile = nowMobile;
        setVideoSource();
    }
    updateVideoSource();
});

// Log elements to ensure they're found
console.log('Video element:', video);
console.log('Unmute button:', unmuteButton);
console.log('Replay button:', replayButton);

// Start video muted (browser requirement)
video.muted = true;
video.volume = 1.0; // Set initial volume to max
unmuteButton.classList.add('muted');

// Function to play video
const playVideo = async () => {
    try {
        await video.play();
        console.log('Video started playing');
    } catch (err) {
        console.log('Video play failed:', err);
    }
};

// Play video initially
video.addEventListener('loadedmetadata', () => {
    playVideo();
});

// Show replay button when video ends
video.addEventListener('ended', () => {
    replayButton.classList.add('show');
});

// Handle replay button click
replayButton.addEventListener('click', async () => {
    video.currentTime = 0;
    replayButton.classList.remove('show');
    await playVideo();
});

// Ensure video plays
const ensureVideoPlays = async () => {
    try {
        await video.play();
        console.log('Video started playing');
    } catch (err) {
        console.log('Video autoplay failed:', err);
    }
};

// Play video when it's loaded
video.addEventListener('loadedmetadata', ensureVideoPlays);

// Add click handler
const handleUnmute = async (e) => {
    console.log('Unmute button clicked');
    e.preventDefault();
    e.stopPropagation();
    
    try {
        // Try to play the video first (needed for some browsers)
        const playPromise = video.play();
        if (playPromise !== undefined) {
            await playPromise;
        }
        
        // Toggle mute state
        video.muted = !video.muted;
        unmuteButton.classList.toggle('muted');
        console.log('Muted state:', video.muted);
        
        // If we're unmuting, ensure volume is up
        if (!video.muted) {
            video.volume = 1.0;
            console.log('Audio unmuted, volume:', video.volume);
        }
    } catch (err) {
        console.log('Error toggling audio:', err);
        alert('Please interact with the page first before playing audio');
    }
};

// Add multiple event listeners to ensure click is captured
unmuteButton.addEventListener('click', handleUnmute);
unmuteButton.addEventListener('touchend', handleUnmute);

// Initial call to set correct video source
document.addEventListener('DOMContentLoaded', updateVideoSource);

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
        
        const response = await fetch('api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        let data;
        try {
            data = await response.json();
        } catch (err) {
            throw new Error('Server response was not valid JSON');
        }
        
        if (response.ok) {
            emailInput.value = '';
            successMessage.classList.add('show');
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        } else {
            throw new Error(data?.message || 'Something went wrong');
        }
    } catch (error) {
        alert(error.message);
    } finally {
        submitButton.disabled = false;
        buttonText.textContent = 'JOIN';
    }
});
