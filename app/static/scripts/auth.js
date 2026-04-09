// Auth Page Animations and Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all effects
    // initParticles(); // Disabled - removed floating particles
    initCursorTrail();
    initCardTilt();
    initInputAnimations();
    initButtonAnimations();
    initFormStagger();
    initFormValidation();
    initTypingEffect();
});

// Clean up on browser back/forward navigation
window.addEventListener('pageshow', function(event) {
    // Remove any stuck overlays or particles
    const overlays = document.querySelectorAll('.page-transition-overlay');
    overlays.forEach(overlay => overlay.remove());
    
    // Reset body overflow
    document.body.style.overflow = '';
    
    // If page was loaded from cache (back button), reinitialize animations
    if (event.persisted) {
        // Reset form animations
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        });
        
        const buttons = document.querySelectorAll('.auth-btn, .auth-divider, .back-link');
        buttons.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        });
    }
});

// Particle System
function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const delay = Math.random() * 5;
        
        particle.style.left = startX + 'px';
        particle.style.bottom = '-10px';
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 15000 + delay * 1000);
    }
    
    // Create initial particles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle(), i * 300);
    }
    
    // Continuously create particles
    setInterval(createParticle, 2000);
}

// Cursor Trail Effect
function initCursorTrail() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;
    
    const trail = [];
    const maxTrails = 20;
    
    document.addEventListener('mousemove', (e) => {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(222, 46, 3, 0.8), rgba(255, 87, 34, 0.4));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translate(-50%, -50%);
            transition: opacity 0.5s, transform 0.5s;
        `;
        
        document.body.appendChild(dot);
        trail.push(dot);
        
        if (trail.length > maxTrails) {
            const oldDot = trail.shift();
            oldDot.style.opacity = '0';
            oldDot.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => oldDot.remove(), 500);
        }
        
        requestAnimationFrame(() => {
            dot.style.opacity = '0';
            dot.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        
        setTimeout(() => {
            if (dot.parentNode) {
                dot.remove();
            }
        }, 500);
    });
}

// Card Tilt Effect
function initCardTilt() {
    const card = document.querySelector('.auth-card');
    if (!card) return;
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
}

// Input Animations
function initInputAnimations() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', (e) => {
            e.target.parentElement.classList.add('focused');
            createInputRipple(e);
            createSparkles(e);
        });
        
        input.addEventListener('blur', (e) => {
            if (!e.target.value) {
                e.target.parentElement.classList.remove('focused');
            }
        });
        
        // Typing animation
        input.addEventListener('input', (e) => {
            if (e.target.value) {
                e.target.style.fontWeight = '600';
            } else {
                e.target.style.fontWeight = '400';
            }
        });
    });
}

// Create sparkles on input focus
function createSparkles(e) {
    const input = e.target;
    const rect = input.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 30;
        
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #de2e03;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            box-shadow: 0 0 10px rgba(222, 46, 3, 0.8);
        `;
        
        document.body.appendChild(sparkle);
        
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        setTimeout(() => {
            sparkle.style.transition = 'all 0.6s ease-out';
            sparkle.style.transform = `translate(${endX}px, ${endY}px) scale(0)`;
            sparkle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

// Input ripple effect
function createInputRipple(e) {
    const input = e.target;
    const ripple = document.createElement('div');
    const rect = input.getBoundingClientRect();
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(222, 46, 3, 0.2);
        width: 10px;
        height: 10px;
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        transform: translate(-50%, -50%) scale(0);
        animation: inputRipple 0.6s ease-out;
        pointer-events: none;
    `;
    
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Button Animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.auth-btn');
    
    buttons.forEach(button => {
        // Click ripple effect
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            
            // Create particles on click
            createClickParticles(e.clientX, e.clientY);
        });
        
        // Hover glow effect
        button.addEventListener('mouseenter', () => {
            button.classList.add('glow-on-hover');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('glow-on-hover');
        });
    });
}

// Create particles on button click
function createClickParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 50 + Math.random() * 50;
        
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: linear-gradient(135deg, #de2e03, #ff5722);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 10px rgba(222, 46, 3, 0.6);
        `;
        
        document.body.appendChild(particle);
        
        const endX = Math.cos(angle) * velocity;
        const endY = Math.sin(angle) * velocity;
        
        setTimeout(() => {
            particle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            particle.style.transform = `translate(${endX}px, ${endY}px) scale(0)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => particle.remove(), 800);
    }
}

// Form stagger animation
function initFormStagger() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Animate buttons
    const buttons = document.querySelectorAll('.auth-btn, .auth-divider, .back-link');
    buttons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            btn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 300 + 100 * index);
    });
}

// Form validation - Simplified to basic animations
function initFormValidation() {
    const form = document.querySelector('.auth-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('.auth-btn-primary');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                submitBtn.style.transform = '';
            }, 200);
        }
        // Let the form submit normally to the backend
    });
}

// Typing effect for title
function initTypingEffect() {
    const title = document.querySelector('.auth-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';
    
    let index = 0;
    const typingSpeed = 50;
    
    function type() {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        }
    }
    
    setTimeout(type, 300);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes inputRipple {
        to {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }

    @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
    }

    .error-shake {
        animation: errorShake 0.4s ease-in-out;
    }
`;
document.head.appendChild(style);
