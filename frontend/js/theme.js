// Theme Management for 3D Effects
document.addEventListener('DOMContentLoaded', () => {
    initParallax3D();
    init3DEffects();
});

// 3D Parallax Effect
function initParallax3D() {
    const layers = document.querySelectorAll('.parallax-layer');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        layers.forEach((layer, index) => {
            const depth = (index + 1) * 0.5;
            const moveX = x * 50 * depth;
            const moveY = y * 30 * depth;
            
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });
    
    // Mobile touch support
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth - 0.5) * 2;
        const y = (touch.clientY / window.innerHeight - 0.5) * 2;
        
        layers.forEach((layer, index) => {
            const depth = (index + 1) * 0.3;
            const moveX = x * 20 * depth;
            const moveY = y * 15 * depth;
            
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });
}

// 3D Card Effects
function init3DEffects() {
    const cards = document.querySelectorAll('.destination-card, .service-card, .cyber-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // Add glow effect
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            card.appendChild(glow);
            
            setTimeout(() => {
                if (glow.parentNode === card) {
                    card.removeChild(glow);
                }
            }, 500);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Add CSS for 3D effects
const style3D = document.createElement('style');
style3D.textContent = `
    .card-glow {
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, var(--primary-color), transparent);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: glowExpand 0.5s ease-out forwards;
        z-index: 1;
    }
    
    @keyframes glowExpand {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
`;
document.head.appendChild(style3D);