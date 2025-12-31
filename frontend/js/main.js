// js/main.js - UPDATED WITH DARK MODE SELECT FIX

// API Configuration - AUTO DETECTS LOCAL VS PRODUCTION
const API_BASE_URL = (function() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    console.log('Hostname:', hostname);
    console.log('Protocol:', protocol);
    
    // If on Railway (production)
    if (hostname.includes('railway.app')) {
        return window.location.origin + '/api';
    }
    // If on localhost (development)
    else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // Fallback - use current origin
    else {
        return window.location.origin + '/api';
    }
})();

console.log('🚀 API Base URL:', API_BASE_URL);

// DOM Elements - Everything in one file
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded - Initializing components...');
    
    // Initialize loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.style.opacity = '0';
            console.log('✅ Loading screen hidden');
        }
    }, 1500);

    // Initialize all components
    initNavigation();
    initTypewriter();
    initStatsCounter();
    initDestinationCards();
    initScrollAnimations();
    initContactForm();
    initBookingForm();
    initNewsletter();
    initParticles();
    initMobileMenu();
    initModalClose();
    initHeaderScroll();
    initThemeToggle();
    init3DEffects();
    initParallax3D();
    
    // Initialize select dropdowns for dark mode
    updateSelectDropdowns();
    
    // Test API connection on load
    testAPIConnection();
});

// Test API Connection
async function testAPIConnection() {
    try {
        console.log('Testing API connection to:', API_BASE_URL + '/health');
        const response = await fetch(API_BASE_URL + '/health');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Connection Successful:', data);
        } else {
            console.warn('⚠️ API responded but with error:', response.status);
        }
    } catch (error) {
        console.error('❌ API Connection Failed:', error);
        // Show user-friendly message
       // showNotification('');
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Theme Toggle with Select Dropdown Fix
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const html = document.documentElement;
    
    if (!themeSwitch) return;
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeSwitch.checked = savedTheme === 'light';
    
    // Fix select dropdowns on initial load
    updateSelectDropdowns();
    
    // Theme toggle event
    themeSwitch.addEventListener('change', () => {
        const newTheme = themeSwitch.checked ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update select dropdowns
        updateSelectDropdowns();
        
        // Smooth transition
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    });
    
    // Also update on theme attribute changes
    const observer = new MutationObserver(() => {
        updateSelectDropdowns();
    });
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
}

// Update select dropdown colors based on theme
function updateSelectDropdowns() {
    const theme = document.documentElement.getAttribute('data-theme');
    const selects = document.querySelectorAll('.form-select');
    
    selects.forEach(select => {
        // Force update select styles for dark/light mode
        if (theme === 'dark') {
            select.style.backgroundColor = 'var(--glass-bg)';
            select.style.color = 'var(--light-text)';
            select.style.borderColor = 'var(--glass-border)';
            
            // Update all options
            Array.from(select.options).forEach(option => {
                option.style.backgroundColor = 'var(--dark-card)';
                option.style.color = 'var(--light-text)';
            });
        } else {
            select.style.backgroundColor = '#f8f9fa';
            select.style.color = '#333';
            select.style.borderColor = '#dee2e6';
            
            // Update all options
            Array.from(select.options).forEach(option => {
                option.style.backgroundColor = '#ffffff';
                option.style.color = '#333';
            });
        }
    });
    
    console.log(`✅ Updated select dropdowns for ${theme} mode`);
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const texts = [
        'AI-powered itineraries',
        'virtual reality tours',
        'satellite tracking',
        'blockchain security',
        'luxury experiences'
    ];
    
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
        currentText = texts[count];
        
        if (isDeleting) {
            letter = currentText.substring(0, index - 1);
            index--;
            typeSpeed = 50;
        } else {
            letter = currentText.substring(0, index + 1);
            index++;
            typeSpeed = 100;
        }
        
        typewriterElement.textContent = letter;
        typewriterElement.setAttribute('data-text', letter);
        
        if (!isDeleting && letter === currentText) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && letter === '') {
            isDeleting = false;
            count = (count + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
}

// Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    // Fetch real stats from API
    fetchStatsFromAPI();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    if (isNaN(target)) return;
                    
                    let current = 0;
                    const increment = target / 100;
                    const duration = 2000;
                    const steps = 100;
                    const stepDuration = duration / steps;
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target + (target === 98 ? '%' : '+');
                            clearInterval(counter);
                        } else {
                            stat.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
                        }
                    }, stepDuration);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.hero-stats'));
}

// Fetch real stats from API
async function fetchStatsFromAPI() {
    try {
        const response = await fetch(API_BASE_URL + '/stats');
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Real stats:', data);
            
            // Update stat cards with real data
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length >= 3 && data.stats) {
                // Update travelers count
                const travelersCard = statCards[0];
                const travelersNumber = travelersCard.querySelector('.stat-number');
                if (travelersNumber) {
                    travelersNumber.setAttribute('data-count', 10000 + data.stats.total_bookings * 100);
                }
                
                // Update destinations count (static)
                // Update satisfaction rate (static)
            }
        }
    } catch (error) {
        console.log('Using default stats (API unavailable)');
    }
}

// Destination Cards
function initDestinationCards() {
    const destinations = [
        {
            name: "Tokyo Cyber City",
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "₹2,499",
            days: "7 Days",
            description: "Experience futuristic Japan with neon lights, ancient temples, and cutting-edge technology",
            tags: ["Technology", "Culture", "Food"],
            travelers: "All Ages"
        },
        {
            name: "Swiss Alps Retreat",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "₹3,299",
            days: "10 Days",
            description: "Luxury mountain escape with ski resorts, spa treatments, and breathtaking alpine views",
            tags: ["Luxury", "Adventure", "Romantic"],
            travelers: "Couples"
        },
        {
            name: "Dubai Oasis",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "₹4,599",
            days: "8 Days",
            description: "Ultimate luxury experience with desert safaris, 7-star hotels, and architectural wonders",
            tags: ["Luxury", "Shopping", "Desert"],
            travelers: "Family"
        },
        {
            name: "Bali Paradise",
            image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "₹1,899",
            days: "6 Days",
            description: "Tropical island getaway with pristine beaches, spiritual retreats, and exotic cuisine",
            tags: ["Beach", "Wellness", "Nature"],
            travelers: "Solo/Couples"
        },
        {
            name: "New York Lights",
            image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "₹2,799",
            days: "5 Days",
            description: "The city that never sleeps with Broadway shows, iconic landmarks, and world-class dining",
            tags: ["City", "Culture", "Entertainment"],
            travelers: "All Ages"
        },
        {
            name: "Santorini Dreams",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "₹2,999",
            days: "7 Days",
            description: "Mediterranean romance with white architecture, sunset views, and crystal-clear waters",
            tags: ["Romantic", "Beach", "Luxury"],
            travelers: "Honeymoon"
        }
    ];
    
    const grid = document.querySelector('.destinations-grid');
    if (!grid) return;
    
    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'destination-card scroll-reveal';
        card.innerHTML = `
            <img src="${dest.image}" alt="${dest.name}" class="destination-image">
            <div class="destination-overlay">
                <div class="destination-info">
                    <h3>${dest.name}</h3>
                    <p class="destination-desc">${dest.description}</p>
                    <div class="destination-meta">
                        <span><i class="fas fa-calendar"></i> ${dest.days}</span>
                        <span><i class="fas fa-users"></i> ${dest.travelers}</span>
                        <span class="destination-price">${dest.price}</span>
                    </div>
                    <div class="destination-tags">
                        ${dest.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="btn-neon" onclick="openBookingModal('${dest.name}')">
                        <i class="fas fa-plane"></i> Book Now
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Scroll Animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Contact Form - UPDATED FOR API
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!validateEmail(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        try {
            showNotification('Sending message...', 'info');
            
            const response = await fetch(API_BASE_URL + '/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Message sent successfully! We will contact you soon.', 'success');
                form.reset();
            } else {
                showNotification(data.error || 'Failed to send message', 'error');
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Connection error. Please try again.', 'error');
        }
    });
}

// Booking Form - UPDATED FOR API
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            full_name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            destination: document.getElementById('bookingDestination').value,
            travel_date: document.getElementById('bookingDate').value,
            travelers: document.getElementById('bookingTravelers').value,
            budget: document.getElementById('bookingBudget').value,
            special_requests: document.getElementById('bookingRequests').value
        };
        
        // Validate form
        if (!formData.full_name || !formData.email || !formData.destination || !formData.travel_date || !formData.travelers || !formData.budget) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!validateEmail(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        try {
            showNotification('Submitting booking inquiry...', 'info');
            
            const response = await fetch(API_BASE_URL + '/booking-inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Booking inquiry submitted successfully! Our travel experts will contact you within 24 hours.', 'success');
                closeBookingModal();
                form.reset();
            } else {
                showNotification(data.error || 'Failed to submit booking', 'error');
            }
            
        } catch (error) {
            console.error('Booking form error:', error);
            showNotification('Connection error. Please try again.', 'error');
        }
    });
}

// Newsletter - UPDATED FOR API
function initNewsletter() {
    const newsletterBtn = document.querySelector('.newsletter button');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', subscribeNewsletter);
    }
    
    // Also handle form submit
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            subscribeNewsletter();
        });
    }
}

async function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    if (!emailInput) return;
    
    const email = emailInput.value;
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        showNotification('Subscribing...', 'info');
        
        const response = await fetch(API_BASE_URL + '/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        } else {
            showNotification(data.error || 'Subscription failed', 'error');
        }
        
    } catch (error) {
        console.error('Newsletter error:', error);
        showNotification('Subscription failed. Please try again.', 'error');
    }
}

// MODAL FUNCTIONS
function openBookingModal(destination = '') {
    const modal = document.getElementById('bookingModal');
    const destinationInput = document.getElementById('bookingDestination');
    
    if (destination && destinationInput) {
        destinationInput.value = destination;
        destinationInput.dispatchEvent(new Event('input'));
    }
    
    // Clear other form fields
    const form = document.getElementById('bookingForm');
    if (form) {
        form.reset();
    }
    
    // Show modal
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Focus on first input
    setTimeout(() => {
        const firstNameInput = document.getElementById('bookingName');
        if (firstNameInput) {
            firstNameInput.focus();
        }
    }, 300);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function initModalClose() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBookingModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeBookingModal();
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('active');
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Particles Effect
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.backgroundColor = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.opacity = '0.3';
        particle.style.animation = `float3d ${Math.random() * 20 + 10}s infinite linear`;
        
        container.appendChild(particle);
    }
}

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
    const cards = document.querySelectorAll('.destination-card, .service-card, .cyber-card, .stat-card, .value-card');
    
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

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                max-width: 400px;
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
            
            .notification.info {
                border-color: var(--primary-color);
            }
            
            .notification i {
                font-size: 1.2rem;
            }
            
            .theme-transition * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function scrollToDestinations() {
    const destinations = document.getElementById('destinations');
    if (destinations) {
        destinations.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

function openVideoModal() {
    showNotification('Travel video feature coming soon! Stay tuned for immersive journey previews.', 'info');
}

function showAllDestinations() {
    showNotification('Loading all 150+ destinations... Get ready for endless travel possibilities!', 'info');
    scrollToDestinations();
}

// Form label handling
document.addEventListener('DOMContentLoaded', () => {
    // Handle form input labels
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-select');
    
    formInputs.forEach(input => {
        // Set initial state
        if (input.value) {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.top = '-20px';
                label.style.fontSize = '0.8rem';
                label.style.color = 'var(--primary-color)';
            }
        }
        
        // Handle input events
        input.addEventListener('input', function() {
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (this.value) {
                    label.style.top = '-20px';
                    label.style.fontSize = '0.8rem';
                    label.style.color = 'var(--primary-color)';
                } else {
                    label.style.top = '12px';
                    label.style.fontSize = '1rem';
                    label.style.color = 'var(--gray-text)';
                }
            }
        });
        
        // Handle focus
        input.addEventListener('focus', function() {
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.color = 'var(--primary-color)';
            }
        });
        
        // Handle blur
        input.addEventListener('blur', function() {
            if (!this.value) {
                const label = this.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.color = 'var(--gray-text)';
                }
            }
        });
    });
});

// Debug helper - test API manually
window.testAPI = function() {
    console.log('Testing API endpoints...');
    
    fetch(API_BASE_URL + '/health')
        .then(r => r.json())
        .then(data => console.log('Health:', data))
        .catch(e => console.error('Health failed:', e));
    
    fetch(API_BASE_URL + '/stats')
        .then(r => r.json())
        .then(data => console.log('Stats:', data))
        .catch(e => console.error('Stats failed:', e));
};

// Force update selects when they gain focus
document.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('form-select')) {
        updateSelectDropdowns();
    }
});