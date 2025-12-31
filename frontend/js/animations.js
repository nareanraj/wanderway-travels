// Advanced Animations and Effects

// 3D Tilt Effect for Cards
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tilt effects
    initTiltEffect();
    initParallax();
    initScrollProgress();
    initMouseTrail();
    initAudioEffects();
});

// Tilt Effect for Interactive Cards
function initTiltEffect() {
    const cards = document.querySelectorAll('.destination-card, .service-card, .stat-card');
    
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

// Parallax Scrolling
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Mouse Trail Effect
function initMouseTrail() {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    document.body.appendChild(trail);
    
    let trailElements = [];
    const trailCount = 15;
    
    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        trail.appendChild(dot);
        trailElements.push(dot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trailElements.forEach((dot, index) => {
            const scale = 1 - (index / trailCount);
            const x = trailX - 5 + (index * 0.5);
            const y = trailY - 5 + (index * 0.5);
            
            dot.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            dot.style.opacity = scale * 0.5;
            dot.style.background = `radial-gradient(circle, var(--primary-color), transparent)`;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Audio Effects for Interactions
function initAudioEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    document.querySelectorAll('button, .nav-link, .destination-card').forEach(element => {
        element.addEventListener('click', () => {
            playClickSound();
        });
        
        element.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
    
    function playClickSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    function playHoverSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Real-time Clock
function initClock() {
    const clockElement = document.createElement('div');
    clockElement.className = 'digital-clock';
    document.querySelector('.hero').appendChild(clockElement);
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        clockElement.innerHTML = `
            <div class="clock-time">${timeString}</div>
            <div class="clock-date">${now.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</div>
        `;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Weather Integration (Example)
async function initWeatherWidget() {
    try {
        // This is a mock API call - replace with real weather API
        const weatherData = {
            temperature: 22,
            condition: 'Sunny',
            location: 'Global HQ'
        };
        
        const weatherWidget = document.createElement('div');
        weatherWidget.className = 'weather-widget';
        weatherWidget.innerHTML = `
            <i class="fas fa-sun"></i>
            <div class="weather-info">
                <div class="weather-temp">${weatherData.temperature}°C</div>
                <div class="weather-location">${weatherData.location}</div>
            </div>
        `;
        
        document.querySelector('.hero').appendChild(weatherWidget);
    } catch (error) {
        console.log('Weather widget not available');
    }
}

// Currency Converter (Example)
function initCurrencyConverter() {
    const converter = document.createElement('div');
    converter.className = 'currency-converter';
    converter.innerHTML = `
        <h4><i class="fas fa-exchange-alt"></i> Quick Convert</h4>
        <div class="converter-inputs">
            <input type="number" value="100" id="amount">
            <select id="fromCurrency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
            </select>
            <i class="fas fa-arrow-right"></i>
            <select id="toCurrency">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
            </select>
            <div class="converted-amount" id="convertedAmount">89.50 EUR</div>
        </div>
    `;
    
    document.querySelector('.footer').prepend(converter);
}

// Initialize all advanced features
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initWeatherWidget();
    initCurrencyConverter();
    
    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: var(--dark-card);
            border-left: 4px solid var(--primary-color);
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            z-index: 10000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-color: var(--accent-color);
        }
        
        .notification.error {
            border-color: #ff4757;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 9999;
            transition: width 0.1s ease;
        }
        
        .mouse-trail {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        }
        
        .trail-dot {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            pointer-events: none;
        }
        
        .card-glow {
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(0, 243, 255, 0.3), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: glowExpand 0.5s ease-out forwards;
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
        
        .digital-clock {
            position: absolute;
            top: 20px;
            right: 20px;
            font-family: 'Courier New', monospace;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid var(--glass-border);
        }
        
        .clock-time {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .weather-widget {
            position: absolute;
            top: 20px;
            left: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid var(--glass-border);
        }
        
        .weather-widget i {
            font-size: 2rem;
            color: #ffd700;
        }
        
        .currency-converter {
            background: var(--dark-card);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .converter-inputs {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        
        .converter-inputs input,
        .converter-inputs select {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
        }
        
        .converted-amount {
            padding: 8px 12px;
            background: var(--glass-bg);
            border-radius: 5px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});