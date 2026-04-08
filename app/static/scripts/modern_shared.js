// Modern Shared JavaScript - ViteGo
// Shared animations and interactions across all app pages

document.addEventListener('DOMContentLoaded', () => {
    initModernNav();
    initCardAnimations();
    initButtonEffects();
    initFormAnimations();
    initPageCleanup();
});

// Modern Navigation
function initModernNav() {
    const nav = document.querySelector('.modern-nav');
    if (!nav) return;
    
    // Add scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Card Animations
function initCardAnimations() {
    const cards = document.querySelectorAll('.modern-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Button Effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-modern, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Ripple effect
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
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Form Animations
function initFormAnimations() {
    const inputs = document.querySelectorAll('.form-input, .form-select');
    
    inputs.forEach(input => {
        // Focus animation
        input.addEventListener('focus', (e) => {
            const parent = e.target.parentElement;
            parent.classList.add('focused');
            
            // Create focus ring
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                border: 2px solid rgba(222, 46, 3, 0.3);
                border-radius: 16px;
                pointer-events: none;
                animation: focusRing 0.3s ease-out;
            `;
            
            parent.style.position = 'relative';
            parent.appendChild(ring);
            
            setTimeout(() => ring.remove(), 300);
        });
        
        input.addEventListener('blur', (e) => {
            if (!e.target.value) {
                e.target.parentElement.classList.remove('focused');
            }
        });
    });
}

// Page Cleanup (for browser back button)
function initPageCleanup() {
    window.addEventListener('pageshow', (event) => {
        // Remove any stuck overlays
        const overlays = document.querySelectorAll('.page-transition-overlay');
        overlays.forEach(overlay => overlay.remove());
        
        // Reset body overflow
        document.body.style.overflow = '';
        
        // If page was loaded from cache, ensure animations are visible
        if (event.persisted) {
            const cards = document.querySelectorAll('.modern-card');
            cards.forEach(card => {
                card.style.opacity = '1';
            });
        }
    });
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
    
    @keyframes focusRing {
        from {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
