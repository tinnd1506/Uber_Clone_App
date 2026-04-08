// ============================================
// VITEGO - FAST & QUALITY RIDE-SHARING
// Speed Meets Excellence
// ============================================

let currentAuthAction = 'login';

// ============================================
// NAVIGATION SCROLL EFFECTS
// ============================================

const navBar = document.getElementById('navBar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navBar?.classList.add('scrolled');
    } else {
        navBar?.classList.remove('scrolled');
    }
});

// ============================================
// PARTICLE SYSTEM
// ============================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const colors = ['#a855f7', '#ec4899', '#06b6d4', '#f97316'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (8 + Math.random() * 6) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = 0.3 + Math.random() * 0.4;
        container.appendChild(particle);
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showAuthModal(action) {
    currentAuthAction = action;
    const modal = document.getElementById('authModal');
    const title = document.getElementById('modalTitle');
    
    if (action === 'login') {
        title.textContent = 'Welcome Back! 👋';
    } else {
        title.textContent = "Let's Get Rolling! 🚀";
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function redirectPage(action, role) {
    // Energetic transition
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
    `;
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    
    setTimeout(() => {
        window.location.href = `/${action}?role=${role}`;
    }, 500);
}

// Clean up any leftover overlays on page load (fixes back button issue)
window.addEventListener('pageshow', function(event) {
    // Remove any transition overlays that might be stuck
    const overlays = document.querySelectorAll('.page-transition-overlay');
    overlays.forEach(overlay => overlay.remove());
    
    // Ensure body overflow is reset
    document.body.style.overflow = '';
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// ============================================
// RIPPLE EFFECT FOR BUTTONS
// ============================================

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// ============================================
// BOUNCY HOVER EFFECTS
// ============================================

function addBouncyHover(element) {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// ============================================
// MOUSE TRACKING FOR CARDS
// ============================================

function addTiltEffect(element) {
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Create particles
    createParticles();
    
    // Observe reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .role-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
    
    // Add bouncy hover to role cards
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => addBouncyHover(card));
    
    // Add tilt effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => addTiltEffect(card));
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('authModal');
            if (modal && modal.classList.contains('active')) {
                hideAuthModal();
            }
        }
    });
    
    // Animate floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };
    
    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
});

// Add ripple CSS dynamically
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn, .role-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyles);

// ============================================
// PARALLAX MOUSE MOVEMENT FOR SHAPES
// ============================================

function initParallaxShapes() {
    const shapes = document.querySelectorAll('.shape');
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function animate() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        shapes.forEach((shape, index) => {
            const depth = (index + 1) * 10;
            const moveX = currentX * depth;
            const moveY = currentY * depth;
            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================

function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn-primary, .role-btn');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ============================================
// INTERACTIVE PARTICLES ON CLICK
// ============================================

function createClickParticles(x, y) {
    const colors = ['#a855f7', '#ec4899', '#06b6d4', '#f97316', '#84cc16'];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 50 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}

// ============================================
// SCROLL VELOCITY EFFECTS
// ============================================

function initScrollVelocity() {
    let lastScroll = 0;
    let velocity = 0;
    let rafId = null;
    
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        velocity = currentScroll - lastScroll;
        lastScroll = currentScroll;
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${currentScroll * 0.3}px)`;
        }
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${currentScroll * -0.2}px) rotate(${velocity * 0.1}deg)`;
        }
        
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${currentScroll * -0.2}px) rotate(0deg)`;
            }
        });
    }, { passive: true });
}

// ============================================
// RANDOM GLITCH TRIGGERS
// ============================================

function initRandomGlitches() {
    const glitchElements = document.querySelectorAll('.logo, .section-title');
    
    setInterval(() => {
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        randomElement.classList.add('glitch');
        
        setTimeout(() => {
            randomElement.classList.remove('glitch');
        }, 500);
    }, 5000);
}

// ============================================
// WOBBLE EFFECT ON HOVER
// ============================================

function addWobbleEffect(element) {
    element.addEventListener('mouseenter', function() {
        this.classList.add('wiggle');
        setTimeout(() => this.classList.remove('wiggle'), 1000);
    });
}

// ============================================
// TYPEWRITER EFFECT FOR HERO SUBTITLE
// ============================================

function typewriterEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================

function initCursorTrail() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Create custom cursor dot
    const customCursor = document.createElement('div');
    customCursor.id = 'custom-cursor';
    customCursor.style.cssText = `
        position: fixed;
        width: 12px;
        height: 12px;
        background: #de2e03;
        border: 2px solid white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease-out, width 0.2s, height 0.2s;
        box-shadow: 0 0 10px rgba(222, 46, 3, 0.5);
    `;
    document.body.appendChild(customCursor);
    
    let trails = [];
    const maxTrails = 12;
    
    document.addEventListener('mousemove', (e) => {
        // Update custom cursor position
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
        
        // Create trail
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(222, 46, 3, 0.6), rgba(255, 87, 34, 0.3));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transition: opacity 0.5s, transform 0.5s;
        `;
        document.body.appendChild(trail);
        trails.push(trail);
        
        if (trails.length > maxTrails) {
            const oldTrail = trails.shift();
            oldTrail.style.opacity = '0';
            oldTrail.style.transform = 'scale(0)';
            setTimeout(() => oldTrail.remove(), 500);
        }
        
        requestAnimationFrame(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(2)';
        });
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.remove();
                trails = trails.filter(t => t !== trail);
            }
        }, 500);
    });
    
    // Add hover effect to scale cursor on interactive elements
    document.querySelectorAll('button, a, .role-option, .role-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
            customCursor.style.width = '16px';
            customCursor.style.height = '16px';
            customCursor.style.background = '#ff5722';
        });
        el.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            customCursor.style.width = '12px';
            customCursor.style.height = '12px';
            customCursor.style.background = '#de2e03';
        });
    });
}

// ============================================
// BREATHING ANIMATION FOR CARDS
// ============================================

function initBreathingCards() {
    const cards = document.querySelectorAll('.feature-card, .role-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('breathe');
    });
}

// ============================================
// ENHANCED INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Create particles
    createParticles();
    
    // Initialize parallax shapes
    initParallaxShapes();
    
    // Initialize magnetic buttons
    initMagneticButtons();
    
    // Initialize scroll velocity
    initScrollVelocity();
    
    // Initialize random glitches
    initRandomGlitches();
    
    // Initialize cursor trail
    initCursorTrail();
    
    // Initialize breathing cards
    initBreathingCards();
    
    // Add click particles to buttons
    document.querySelectorAll('.btn, .role-btn, .nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            createClickParticles(e.clientX, e.clientY);
        });
    });
    
    // Observe reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .role-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
    
    // Add bouncy hover to role cards
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        addBouncyHover(card);
        addWobbleEffect(card);
    });
    
    // Add tilt effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => addTiltEffect(card));
    
    // Add wobble to nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => addWobbleEffect(btn));
    
    // Typewriter effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typewriterEffect(heroSubtitle, originalText, 30);
        }, 1000);
    }
    
    // Close modal when clicking outside the modal content
    const modalOverlay = document.getElementById('authModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                hideAuthModal();
            }
        });
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('authModal');
            if (modal && modal.classList.contains('active')) {
                hideAuthModal();
            }
        }
    });
    
    // Animate floating cards with stagger
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add scramble effect to logo on hover
    const logo = document.querySelector('.logo');
    if (logo) {
        const scramble = new TextScramble(logo);
        const originalText = logo.textContent;
        
        logo.addEventListener('mouseenter', () => {
            scramble.setText('ZOOM!');
        });
        
        logo.addEventListener('mouseleave', () => {
            scramble.setText(originalText);
        });
    }
    
    // Add neon glow to primary buttons periodically
    setInterval(() => {
        const primaryBtns = document.querySelectorAll('.btn-primary');
        const randomBtn = primaryBtns[Math.floor(Math.random() * primaryBtns.length)];
        if (randomBtn) {
            randomBtn.classList.add('neon-glow');
            setTimeout(() => randomBtn.classList.remove('neon-glow'), 2000);
        }
    }, 3000);
    
    // Initialize scroll journey
    initScrollJourney();
    
    // Initialize canvas road renderer
    initRoadCanvas();
});

// ============================================
// SIGNIFICANT 3D PARALLAX SCROLLING
// ============================================

function initScrollJourney() {
    const scene3d = document.getElementById('scene3d');
    const world3d = document.getElementById('world3d');
    const car3d = document.getElementById('car3d');
    const road3d = document.getElementById('road3d');
    const floatingElements = document.querySelectorAll('.floating-3d-element');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const phoneMockup = document.querySelector('.phone-mockup');
    const floatingCards = document.querySelectorAll('.floating-card');
    const featureCards = document.querySelectorAll('.feature-card');
    const roleCards = document.querySelectorAll('.role-card');
    const heroContent = document.querySelector('.hero-content');
    
    // Create speed lines container
    const speedLinesContainer = document.createElement('div');
    speedLinesContainer.className = 'speed-lines-container';
    document.body.appendChild(speedLinesContainer);
    
    // Smooth lerp function
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Current smoothed values (for lerping)
    let current = {
        scrollY: 0,
        velocity: 0,
        mouseX: 0,
        mouseY: 0,
        worldRotX: 60,
        worldRotY: 0,
        worldZ: -500,
        carZ: 100,
        carY: 60,
        carTilt: 0,
        roadOffset: 0
    };
    
    // Target values (instant from scroll)
    let target = {
        scrollY: 0,
        velocity: 0,
        mouseX: 0,
        mouseY: 0
    };
    
    let lastScrollY = 0;
    const LERP_SPEED = 0.08; // lower = smoother/slower
    const LERP_FAST = 0.12;
    let isRunning = true;
    
    // Initialize 3D floating elements with Z positions
    floatingElements.forEach(el => {
        const z = parseInt(el.getAttribute('data-z')) || 0;
        el.style.setProperty('--z', `${z}px`);
    });
    
    function smoothUpdate() {
        if (!isRunning) return;
        
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const windowHeight = window.innerHeight;
        
        // Set targets
        target.scrollY = scrolled;
        target.velocity = scrolled - lastScrollY;
        lastScrollY = scrolled;
        
        // Lerp current values toward targets
        current.scrollY = lerp(current.scrollY, target.scrollY, LERP_SPEED);
        current.velocity = lerp(current.velocity, target.velocity, LERP_SPEED);
        current.mouseX = lerp(current.mouseX, target.mouseX, 0.05);
        current.mouseY = lerp(current.mouseY, target.mouseY, 0.05);
        
        const smoothScroll = current.scrollY;
        const smoothPercent = smoothScroll / maxScroll;
        const smoothVelocity = current.velocity;
        
        // 3D World rotation and movement
        if (world3d) {
            const targetRotX = -15 - (smoothPercent * 10);
            const targetRotY = smoothPercent * 5 + current.mouseX * 3;
            const targetZ = -200 - (smoothScroll * 2);
            const mouseRotX = -current.mouseY * 3;
            
            current.worldRotX = lerp(current.worldRotX, targetRotX + mouseRotX, LERP_SPEED);
            current.worldRotY = lerp(current.worldRotY, targetRotY, LERP_SPEED);
            current.worldZ = lerp(current.worldZ, targetZ, LERP_SPEED);
            
            world3d.style.transform = `translate(-50%, -50%) rotateX(${current.worldRotX}deg) rotateY(${current.worldRotY}deg) translateZ(${current.worldZ}px)`;
        }
        
        // 3D Car movement - starts near and drives away into distance
        if (car3d) {
            const targetCarZ = 400 - (smoothScroll * 3);
            const targetCarY = 70 + (smoothPercent * 5);
            const targetCarTilt = smoothVelocity * 0.05;
            const carBounce = Math.sin(smoothScroll * 0.05) * 2;
            
            current.carZ = lerp(current.carZ, targetCarZ, LERP_SPEED);
            current.carY = lerp(current.carY, targetCarY + carBounce, LERP_SPEED);
            current.carTilt = lerp(current.carTilt, targetCarTilt, 0.06);
            
            // Scale car down as it moves away
            const distanceScale = Math.max(0.3, 1 - (smoothPercent * 0.7));
            
            car3d.style.transform = `translate(-50%, -50%) translateZ(${current.carZ}px) translateY(${current.carY}%) scale(${distanceScale}) rotateX(${-current.carTilt}deg)`;
            
            // Speed lines on fast scroll
            if (Math.abs(smoothVelocity) > 8) {
                speedLinesContainer.classList.add('active');
                createSpeedLines();
            } else {
                speedLinesContainer.classList.remove('active');
            }
        }
        
        // Road animation - moves toward viewer to create forward motion illusion
        if (road3d) {
            const targetRoad = -(smoothScroll * 3) % 600;
            current.roadOffset = lerp(current.roadOffset, targetRoad, LERP_FAST);
            road3d.style.transform = `translate(-50%, -50%) translateZ(300px) rotateX(90deg) translateY(${current.roadOffset}px)`;
        }
        
        // Floating 3D elements parallax
        floatingElements.forEach((el, index) => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
            const z = parseInt(el.getAttribute('data-z')) || 0;
            const yPos = -(smoothScroll * speed * 0.5);
            const rotateY = smoothScroll * 0.05 * (index + 1);
            const floatOffset = Math.sin(smoothScroll * 0.003 + index) * 20;
            
            el.style.transform = `translateZ(${z}px) translateY(${yPos + floatOffset}px) rotateY(${rotateY}deg)`;
        });
        
        // Background parallax layers
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
            const yPos = -(smoothScroll * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        // Phone mockup 3D parallax
        if (phoneMockup) {
            const heroRect = document.querySelector('.hero').getBoundingClientRect();
            if (heroRect.bottom > 0) {
                const yPos = smoothScroll * 0.15;
                const rotateY = smoothScroll * 0.02;
                const rotateX = smoothScroll * 0.01;
                phoneMockup.style.transform = `translate3d(0, ${yPos}px, ${smoothScroll * 0.1}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
        }
        
        // Floating cards 3D parallax
        floatingCards.forEach((card, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = smoothScroll * speed;
            const xOffset = Math.sin(smoothScroll * 0.002 + index) * 15;
            const zOffset = Math.cos(smoothScroll * 0.002 + index) * 30;
            card.style.transform = `translate3d(${xOffset}px, ${yPos}px, ${zOffset}px)`;
        });
        
        // Role cards 3D effect
        roleCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (cardVisible) {
                const progress = 1 - (rect.top / windowHeight);
                const direction = index === 0 ? 1 : -1;
                const rotateY = direction * (progress * 20);
                const translateZ = 80 + (progress * 70);
                const scale = 1 + (Math.sin(smoothScroll * 0.003) * 0.02);
                
                card.style.transform = `perspective(1000px) translate3d(0, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            }
        });
        
        // Hero content 3D parallax
        if (heroContent) {
            const heroRect = document.querySelector('.hero').getBoundingClientRect();
            if (heroRect.bottom > 0) {
                const yPos = smoothScroll * 0.08;
                const opacity = 1 - (smoothScroll / windowHeight * 0.5);
                const translateZ = 100 - (smoothScroll * 0.1);
                heroContent.style.transform = `translate3d(0, ${yPos}px, ${Math.max(0, translateZ)}px)`;
                heroContent.style.opacity = Math.max(0.3, opacity);
            }
        }
        
        // Continue the animation loop
        requestAnimationFrame(smoothUpdate);
    }
    
    // Create speed lines
    function createSpeedLines() {
        if (speedLinesContainer.children.length > 15) return;
        
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('div');
            line.className = 'speed-line-3d';
            line.style.left = Math.random() * 100 + '%';
            line.style.animationDelay = Math.random() * 0.3 + 's';
            line.style.animationDuration = (0.4 + Math.random() * 0.4) + 's';
            speedLinesContainer.appendChild(line);
            
            setTimeout(() => line.remove(), 800);
        }
    }
    
    // Start the continuous animation loop (no scroll listener needed)
    requestAnimationFrame(smoothUpdate);
    
    // Smooth reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateZ(50px)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) translateZ(0)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        revealObserver.observe(el);
    });
    
    // Mouse parallax - store target, lerped in the loop
    document.addEventListener('mousemove', (e) => {
        target.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        target.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
}

// Add 3D parallax styles
const parallaxStyles = document.createElement('style');
parallaxStyles.textContent = `
    .parallax-layer, .world-3d, .car-3d, .floating-3d-element {
        will-change: transform;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform: translateZ(0);
    }
    
    .phone-mockup, .floating-card {
        will-change: transform;
    }
    
    .feature-card, .role-card {
        will-change: transform;
    }
    
    .hero-content {
        will-change: transform, opacity;
    }
    
    .scene-3d, .world-3d, .car-3d, .road-3d {
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
    }
`;
document.head.appendChild(parallaxStyles);

// Add scramble char styles
const scrambleStyles = document.createElement('style');
scrambleStyles.textContent = `
    .scramble-char {
        display: inline-block;
        color: var(--accent-cyan);
        font-weight: bold;
    }
`;
document.head.appendChild(scrambleStyles);

// ============================================
// CANVAS ROAD RENDERER
// ============================================

function initRoadCanvas() {
    const canvas = document.getElementById('roadCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let animOffset = 0;
    let tMouseX = 0, tMouseY = 0;
    let sMouseX = 0, sMouseY = 0;
    let lastScrollY = 0;
    let scrollVel = 0;      // smoothed scroll velocity
    let targetVel = 0;      // instantaneous scroll velocity

    document.addEventListener('mousemove', e => {
        tMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        tMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function drawFrame(ts) {
        const W = canvas.width;
        const H = canvas.height;

        sMouseX = lerp(sMouseX, tMouseX, 0.04);
        sMouseY = lerp(sMouseY, tMouseY, 0.04);

        // Track scroll velocity with smooth decay
        const scrollY = window.pageYOffset;
        const rawDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;

        // Target velocity (only positive = scrolling down)
        targetVel = Math.max(0, rawDelta);
        // Smoothly interpolate current velocity toward target (fast attack, slow decay)
        const attack = 0.35;  // quick response to scroll
        const decay  = 0.92;  // gradual slowdown when scrolling stops
        if (targetVel > scrollVel) {
            scrollVel = lerp(scrollVel, targetVel, attack);
        } else {
            scrollVel = scrollVel * decay;
        }

        // Advance animation based on smoothed velocity
        if (scrollVel > 0.05) {
            const baseSpeed = 1.2 + Math.min(scrollY * 0.004, 4);
            animOffset = (animOffset + scrollVel * baseSpeed * 0.015) % 1;
        }

        ctx.clearRect(0, 0, W, H);

        // Vanishing point — shifts with mouse for parallax feel
        const vpX = W * 0.5 + sMouseX * 35;
        const vpY = H * 0.40 + sMouseY * 18;

        // ── SKY ──────────────────────────────────────
        const skyGrad = ctx.createLinearGradient(0, 0, 0, vpY);
        skyGrad.addColorStop(0, '#fef3c7');
        skyGrad.addColorStop(0.55, '#fef9c3');
        skyGrad.addColorStop(1, '#fffbeb');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, vpY);

        // Sun
        const sunG = ctx.createRadialGradient(vpX - W * 0.15, vpY - H * 0.05, 0, vpX - W * 0.15, vpY - H * 0.05, 45);
        sunG.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sunG.addColorStop(0.3, 'rgba(252, 211, 77, 0.6)');
        sunG.addColorStop(0.7, 'rgba(251, 191, 36, 0.2)');
        sunG.addColorStop(1, 'transparent');
        ctx.fillStyle = sunG;
        ctx.beginPath();
        ctx.arc(vpX - W * 0.15, vpY - H * 0.05, 45, 0, Math.PI * 2);
        ctx.fill();

        // Clouds
        const cloudY = vpY - H * 0.08;
        [[vpX - W * 0.25, 0.8], [vpX + W * 0.18, 0.6], [vpX + W * 0.32, 0.5]].forEach(([cx, scale]) => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(cx, cloudY, 25 * scale, 0, Math.PI * 2);
            ctx.arc(cx + 20 * scale, cloudY - 10 * scale, 35 * scale, 0, Math.PI * 2);
            ctx.arc(cx + 50 * scale, cloudY, 28 * scale, 0, Math.PI * 2);
            ctx.fill();
        });

        // ── GROUND ───────────────────────────────────
        const groundGrad = ctx.createLinearGradient(0, vpY, 0, H);
        groundGrad.addColorStop(0, '#f0fdf4');
        groundGrad.addColorStop(1, '#dcfce7');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, vpY, W, H - vpY);

        // Road boundaries at the bottom of the screen
        const roadLX = W * 0.06;
        const roadRX = W * 0.94;

        // ── ROAD SURFACE ─────────────────────────────
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(roadRX, H);
        ctx.lineTo(roadLX, H);
        ctx.closePath();
        ctx.clip();

        const roadGrad = ctx.createLinearGradient(0, vpY, 0, H);
        roadGrad.addColorStop(0,   '#57534e');
        roadGrad.addColorStop(0.25,'#78716c');
        roadGrad.addColorStop(0.7, '#a8a29e');
        roadGrad.addColorStop(1,   '#d6d3d1');
        ctx.fillStyle = roadGrad;
        ctx.fillRect(0, vpY, W, H - vpY);

        // Subtle road centre sheen
        const sheenGrad = ctx.createLinearGradient(W*0.35, vpY, W*0.65, H);
        sheenGrad.addColorStop(0,   'transparent');
        sheenGrad.addColorStop(0.5, 'rgba(222, 46, 3, 0.04)');
        sheenGrad.addColorStop(1,   'transparent');
        ctx.fillStyle = sheenGrad;
        ctx.fillRect(0, vpY, W, H - vpY);
        ctx.restore();

        // ── ROAD EDGE LINES (deep orange) ──────────────────
        function drawEdge(x0, y0, x1, y1) {
            const eg = ctx.createLinearGradient(x0, y0, x1, y1);
            eg.addColorStop(0, 'rgba(222, 46, 3, 0.6)');
            eg.addColorStop(1, 'rgba(222, 46, 3, 0.95)');
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = eg;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        drawEdge(vpX, vpY, roadLX, H);
        drawEdge(vpX, vpY, roadRX, H);

        // ── ANIMATED LANE DASHES ──────────────────────
        const NUM_DASHES = 14;
        // 2 lane divider lines at ±28% of half-road-width
        [-1, 1].forEach(side => {
            for (let i = 0; i < NUM_DASHES; i++) {
                const t1 = ((i / NUM_DASHES) + animOffset) % 1;
                const t2 = Math.min(1, t1 + (1 / NUM_DASHES) * 0.42);
                if (t2 <= 0 || t1 >= 1) continue;

                const y1 = vpY + (H - vpY) * t1;
                const y2 = vpY + (H - vpY) * t2;

                // Road half-width at this depth
                const hw1 = ((roadRX - vpX)) * t1;
                const hw2 = ((roadRX - vpX)) * t2;

                const x1 = vpX + side * hw1 * 0.56;
                const x2 = vpX + side * hw2 * 0.56;

                const alpha = Math.min(0.92, 0.08 + t1 * 0.9);
                const lw = 0.8 + t1 * 5.5;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                ctx.lineWidth = lw;
                ctx.stroke();
            }
        });

        // ── ROADSIDE LAMP POSTS ───────────────────────
        const NUM_LAMPS = 6;
        for (let i = 0; i < NUM_LAMPS; i++) {
            const t = ((i / NUM_LAMPS) + animOffset * 0.6) % 1;
            if (t < 0.02) continue;

            const y = vpY + (H - vpY) * t;
            const hw = (roadRX - vpX) * t;
            const postH = 80 * t;
            const postW = 3 * t;
            const alpha = Math.min(0.85, t * 1.2);

            [-1, 1].forEach(side => {
                const baseX = vpX + side * (hw + 18 * t);

                ctx.beginPath();
                ctx.moveTo(baseX, y);
                ctx.lineTo(baseX + side * postH * 0.25, y - postH);
                ctx.strokeStyle = `rgba(120, 113, 108, ${alpha * 0.9})`;
                ctx.lineWidth = postW;
                ctx.stroke();

                const lampX = baseX + side * postH * 0.25;
                const lampY = y - postH;
                const lampGrad = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, 30 * t);
                lampGrad.addColorStop(0, `rgba(255, 112, 67, ${alpha * 0.4})`);
                lampGrad.addColorStop(0.3, `rgba(222, 46, 3, ${alpha * 0.15})`);
                lampGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = lampGrad;
                ctx.beginPath();
                ctx.arc(lampX, lampY, 30 * t, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // ── CAR ───────────────────────────────────────
        const carY = H * 0.76;
        drawCar(ctx, vpX + sMouseX * -12, carY, ts);

        // ── HORIZON FOG ───────────────────────────────
        const fogGrad = ctx.createLinearGradient(0, vpY - 25, 0, vpY + 70);
        fogGrad.addColorStop(0,   'rgba(255,255,255,0)');
        fogGrad.addColorStop(0.45,'rgba(255,255,255,0.4)');
        fogGrad.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, vpY - 25, W, 95);

        // Bottom vignette (light)
        const vigGrad = ctx.createLinearGradient(0, H * 0.78, 0, H);
        vigGrad.addColorStop(0, 'transparent');
        vigGrad.addColorStop(1, 'rgba(0,0,0,0.08)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, H * 0.78, W, H * 0.22);

        requestAnimationFrame(drawFrame);
    }

    function drawCar(ctx, cx, baseY, ts) {
        const t = ts * 0.001;
        const bounce = Math.sin(t * 9) * 1.8;
        const lean = sMouseX * 1.5; // very slight tilt

        ctx.save();
        ctx.translate(cx, baseY + bounce);
        ctx.rotate(lean * Math.PI / 180);

        // ── Shadow ────────────────────────────────────
        const shadowG = ctx.createRadialGradient(0, 54, 0, 0, 54, 88);
        shadowG.addColorStop(0,   'rgba(0,0,0,0.25)');
        shadowG.addColorStop(0.5, 'rgba(0,0,0,0.1)');
        shadowG.addColorStop(1,   'transparent');
        ctx.fillStyle = shadowG;
        ctx.beginPath();
        ctx.ellipse(0, 58, 72, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // ── Car chassis (lower body) ──────────────────
        const chassisG = ctx.createLinearGradient(-54, 12, -54, 57);
        chassisG.addColorStop(0,   '#de2e03');
        chassisG.addColorStop(0.3, '#ff7043');
        chassisG.addColorStop(0.75,'#c41e00');
        chassisG.addColorStop(1,   '#a31500');
        ctx.fillStyle = chassisG;
        ctx.beginPath();
        ctx.roundRect(-54, 14, 108, 43, [5, 5, 11, 11]);
        ctx.fill();

        // Chassis top edge highlight
        ctx.strokeStyle = 'rgba(255, 204, 188, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-54, 14, 108, 9, [5, 5, 0, 0]);
        ctx.stroke();

        // ── Roof / cabin ──────────────────────────────
        const roofG = ctx.createLinearGradient(-40, -22, -40, 16);
        roofG.addColorStop(0,   '#ff7043');
        roofG.addColorStop(0.5, '#de2e03');
        roofG.addColorStop(1,   '#c41e00');
        ctx.fillStyle = roofG;
        ctx.beginPath();
        ctx.moveTo(-40, 16);
        ctx.lineTo(-33, -20);
        ctx.lineTo(33, -20);
        ctx.lineTo(40, 16);
        ctx.closePath();
        ctx.fill();

        // Roof specular
        const roofSpec = ctx.createLinearGradient(-18, -20, 18, -20);
        roofSpec.addColorStop(0,   'transparent');
        roofSpec.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        roofSpec.addColorStop(1,   'transparent');
        ctx.fillStyle = roofSpec;
        ctx.beginPath();
        ctx.moveTo(-40, 16);
        ctx.lineTo(-33, -20);
        ctx.lineTo(33, -20);
        ctx.lineTo(40, 16);
        ctx.closePath();
        ctx.fill();

        // ── Windshield ────────────────────────────────
        const windG = ctx.createLinearGradient(-30, -17, -30, 14);
        windG.addColorStop(0,   'rgba(255, 204, 188, 0.6)');
        windG.addColorStop(0.5, 'rgba(255, 204, 188, 0.4)');
        windG.addColorStop(1,   'rgba(255, 171, 145, 0.5)');
        ctx.fillStyle = windG;
        ctx.strokeStyle = 'rgba(255, 235, 230, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-31, 14);
        ctx.lineTo(-26, -16);
        ctx.lineTo(26, -16);
        ctx.lineTo(31, 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Windshield glare streak
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.moveTo(-24, 12);
        ctx.lineTo(-20, -13);
        ctx.lineTo(-8,  -13);
        ctx.lineTo(-11, 12);
        ctx.closePath();
        ctx.fill();

        // ── Headlight housings + lens ─────────────────
        [[-44, 1], [44, -1]].forEach(([lx, dir]) => {
            // Housing
            ctx.strokeStyle = 'rgba(255, 204, 188, 0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(lx, 24, 13, 8, dir * 0.15, 0, Math.PI * 2);
            ctx.stroke();

            // Lens
            ctx.fillStyle = 'rgba(255, 255, 245, 0.95)';
            ctx.beginPath();
            ctx.ellipse(lx, 24, 9, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // ── Tail lights ───────────────────────────────
        [-44, 44].forEach(lx => {
            ctx.fillStyle = 'rgba(196, 30, 0, 0.9)';
            ctx.beginPath();
            ctx.ellipse(lx, 38, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // ── Wheels ────────────────────────────────────
        drawWheel(ctx, -42, 54, 17, t);
        drawWheel(ctx, 42, 54, 17, t);

        // ── Undercar reflection ────────────────────────
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.scale(1, -0.2);
        ctx.translate(0, -(58 * 2 + 58 * 2 / 0.2));
        ctx.fillStyle = '#de2e03';
        ctx.beginPath();
        ctx.roundRect(-54, 14, 108, 43, [5, 5, 11, 11]);
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }

    function drawWheel(ctx, x, y, r, t) {
        // Tire
        const tireG = ctx.createRadialGradient(x - r*0.3, y - r*0.3, 0, x, y, r);
        tireG.addColorStop(0, '#374151');
        tireG.addColorStop(1, '#1f2937');
        ctx.fillStyle = tireG;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(156, 163, 175, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();

        // Spinning rim (5 spokes)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 3);
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * r * 0.68, Math.sin(a) * r * 0.68);
            ctx.strokeStyle = 'rgba(209, 213, 219, 0.9)';
            ctx.lineWidth = r * 0.22;
            ctx.stroke();
        }
        // Hub
        const hubG = ctx.createRadialGradient(-r*0.1, -r*0.1, 0, 0, 0, r*0.28);
        hubG.addColorStop(0, '#e5e7eb');
        hubG.addColorStop(1, '#9ca3af');
        ctx.fillStyle = hubG;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    requestAnimationFrame(drawFrame);
}
