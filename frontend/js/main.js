// js/main.js

// AUTO-DETECT API URL FOR LOCAL VS PRODUCTION
const API_BASE_URL = window.location.origin + '/api';

// Or use this more robust version:
const API_BASE_URL = (function() {
    // If on Railway (production)
    if (window.location.hostname.includes('railway.app')) {
        return window.location.origin + '/api';
    }
    // If on localhost (development)
    else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // Fallback
    else {
        return '/api';
    }
})();

// DOM Elements - Everything in one file
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.style.opacity = '0';
        }
    }, 2000);

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
});

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

// Theme Toggle
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const html = document.documentElement;
    
    if (!themeSwitch) return;
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeSwitch.checked = savedTheme === 'light';
    
    // Theme toggle event
    themeSwitch.addEventListener('change', () => {
        const newTheme = themeSwitch.checked ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Smooth transition
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    });
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

// Destination Cards
function initDestinationCards() {
    const destinations = [
        {
            name: "Tokyo Cyber City",
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "$2,499",
            days: "7 Days",
            description: "Experience futuristic Japan with neon lights, ancient temples, and cutting-edge technology",
            tags: ["Technology", "Culture", "Food"],
            travelers: "All Ages"
        },
        {
            name: "Swiss Alps Retreat",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "$3,299",
            days: "10 Days",
            description: "Luxury mountain escape with ski resorts, spa treatments, and breathtaking alpine views",
            tags: ["Luxury", "Adventure", "Romantic"],
            travelers: "Couples"
        },
        {
            name: "Dubai Oasis",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "$4,599",
            days: "8 Days",
            description: "Ultimate luxury experience with desert safaris, 7-star hotels, and architectural wonders",
            tags: ["Luxury", "Shopping", "Desert"],
            travelers: "Family"
        },
        {
            name: "Bali Paradise",
            image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "$1,899",
            days: "6 Days",
            description: "Tropical island getaway with pristine beaches, spiritual retreats, and exotic cuisine",
            tags: ["Beach", "Wellness", "Nature"],
            travelers: "Solo/Couples"
        },
        {
            name: "New York Lights",
            image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "$2,799",
            days: "5 Days",
            description: "The city that never sleeps with Broadway shows, iconic landmarks, and world-class dining",
            tags: ["City", "Culture", "Entertainment"],
            travelers: "All Ages"
        },
        {
            name: "Santorini Dreams",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            price: "$2,999",
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

// Contact Form
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showNotification('Message sent successfully! We will contact you soon.', 'success');
            form.reset();
            
        } catch (error) {
            showNotification('Connection error. Please try again.', 'error');
        }
    });
}

// Booking Form
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showNotification('Booking inquiry submitted successfully! Our travel experts will contact you within 24 hours.', 'success');
            closeBookingModal();
            form.reset();
            
        } catch (error) {
            showNotification('Connection error. Please try again.', 'error');
        }
    });
}

// Newsletter
function initNewsletter() {
    const newsletterBtn = document.querySelector('.newsletter button');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', subscribeNewsletter);
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        emailInput.value = '';
        
    } catch (error) {
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