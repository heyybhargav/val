// ===== DOM Elements =====
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const playfulMessage = document.getElementById('playfulMessage');
const tapCounter = document.getElementById('tapCounter');
const celebrationOverlay = document.getElementById('celebrationOverlay');
const heartsContainer = document.getElementById('heartsContainer');
const confettiContainer = document.getElementById('confettiContainer');

// ===== State =====
let noTapCount = 0;
let currentScale = 1;
let isEscaping = false;

// ===== Playful Messages =====
const playfulMessages = [
    "Are you sure? 🥺",
    "Think again... 💭",
    "Pretty please? 🙏",
    "You're breaking my heart! 💔",
    "One more chance? 🌹",
    "I'll be sad... 😢",
    "But I love you! 💕",
    "No isn't an option! 😤",
    "Try harder! 😏",
    "Nice try! 😜",
    "Really?! 😱",
    "Come on... 🥰",
    "I won't give up! 💪",
    "You can't escape love! 💘",
    "Almost got it... NOT! 😂"
];

// ===== Initialize Floating Hearts =====
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💝', '💓', '❤️', '🌹', '✨'];

    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (6 + Math.random() * 4) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        heartsContainer.appendChild(heart);
    }
}

// ===== Get Random Message =====
function getRandomMessage() {
    return playfulMessages[Math.floor(Math.random() * playfulMessages.length)];
}

// ===== Show Playful Message =====
function showPlayfulMessage() {
    playfulMessage.textContent = getRandomMessage();
    playfulMessage.classList.remove('show');

    // Force reflow for animation
    void playfulMessage.offsetWidth;

    playfulMessage.classList.add('show');
}

// ===== Update Tap Counter =====
function updateTapCounter() {
    if (noTapCount > 0) {
        tapCounter.textContent = `Attempts to say no: ${noTapCount} 😅`;
    }
}

// ===== Get Random Position =====
function getRandomPosition() {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = noBtn.getBoundingClientRect();

    // Keep button within visible area with padding
    const padding = 60;
    const maxX = (viewportWidth - btnRect.width) / 2 - padding;
    const maxY = 150; // Limit vertical movement

    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY;

    return { x: randomX, y: randomY };
}

// ===== Escape No Button =====
function escapeNoButton(event) {
    // Prevent default touch behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (isEscaping) return;
    isEscaping = true;

    noTapCount++;

    // Show message and update counter
    showPlayfulMessage();
    updateTapCounter();

    // Grow the Yes button gradually
    if (noTapCount <= 8) {
        yesBtn.style.transform = `scale(${1 + noTapCount * 0.05})`;
    }

    // Only start shrinking after 4 taps, and shrink slowly
    if (noTapCount > 4) {
        currentScale = Math.max(0.5, 1 - (noTapCount - 4) * 0.05);
    } else {
        currentScale = 1; // Stay full size for first 4 taps
    }

    // Get random position
    const pos = getRandomPosition();

    // Apply escape animation
    noBtn.classList.add('escaping');
    noBtn.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${currentScale})`;

    // Only shrink font after 4 taps
    if (noTapCount > 4) {
        noBtn.style.fontSize = `${Math.max(0.9, 1.25 - (noTapCount - 4) * 0.03)}rem`;
    }

    // Remove escaping class after animation
    setTimeout(() => {
        noBtn.classList.remove('escaping');
        isEscaping = false;
    }, 150);
}

// ===== Trigger Celebration =====
function triggerCelebration() {
    // Create confetti
    createConfetti();

    // Show overlay
    celebrationOverlay.classList.add('active');

    // Play celebration sound (optional, browsers may block auto-play)
    // You could add a sound file here if desired
}

// ===== Create Confetti =====
function createConfetti() {
    const colors = ['#ff6b9d', '#ffd700', '#ff6b6b', '#4ade80', '#a855f7', '#3b82f6', '#f59e0b'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (3 + Math.random() * 2) + 's';

        // Random shapes
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
            confetti.style.width = '12px';
            confetti.style.height = '12px';
        }

        confettiContainer.appendChild(confetti);
    }
}

// ===== Event Listeners =====

// No Button - Touch Events (for mobile)
noBtn.addEventListener('touchstart', escapeNoButton, { passive: false });

// No Button - Mouse Events (for desktop testing)
noBtn.addEventListener('mousedown', (e) => {
    // Only trigger on actual click, not touch
    if (e.pointerType !== 'touch') {
        escapeNoButton(e);
    }
});

// Prevent No button from being clicked
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

// Yes Button - Click Event
yesBtn.addEventListener('click', () => {
    triggerCelebration();
});

// Yes Button - Touch Event
yesBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    triggerCelebration();
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();

    // Prevent pull-to-refresh on mobile
    document.body.addEventListener('touchmove', (e) => {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });
});

// ===== Prevent Context Menu on Long Press =====
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
