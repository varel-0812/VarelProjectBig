// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Initialize all features after loading
        initWebsite();
    }, 2000);
});

function initWebsite() {
    // Initialize Particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#00d4ff"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#00d4ff",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                }
            }
        }
    });

    // Typewriter Effect
    const typedText = document.querySelector('.typed-text');
    const cursor = document.querySelector('.cursor');
    
    const textArray = ["a Developer", "a Designer", "a Problem Solver", "an Innovator", "Your Next Hire"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 1500;
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedText.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedText.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }
    
    // Start typing effect after loading
    setTimeout(type, 1500);

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.progress-bar');
    const stats = document.querySelectorAll('.stat-number');
    
    function animateOnScroll() {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (barPosition < screenPosition) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }
        });
        
        stats.forEach(stat => {
            const statPosition = stat.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (statPosition < screenPosition) {
                const finalValue = stat.getAttribute('data-count');
                animateCounter(stat, finalValue);
            }
        });
    }
    
    // Counter animation
    function animateCounter(element, finalValue) {
        if (element.getAttribute('data-animated') === 'true') return;
        
        element.setAttribute('data-animated', 'true');
        let currentValue = 0;
        const increment = finalValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 30);
    }
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Audio control
    const audioToggle = document.getElementById('audioToggle');
    const bgAudio = document.getElementById('bgAudio');
    
    // Try to play audio (some browsers require user interaction)
    audioToggle.addEventListener('click', function() {
        if (bgAudio.paused) {
            bgAudio.volume = 0.3;
            bgAudio.play();
            audioToggle.classList.remove('muted');
        } else {
            bgAudio.pause();
            audioToggle.classList.add('muted');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
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
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Form submission
    const messageForm = document.getElementById('messageForm');
    
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData);
        
        // In a real application, you would send this data to a server
        // For demo purposes, we'll just show an alert
        alert('Pesan berhasil dikirim! (Ini hanya demo)');
        
        // Reset form
        this.reset();
        
        // Add some visual feedback
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        const originalIcon = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
        submitBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalIcon;
            submitBtn.style.background = '';
        }, 3000);
    });
    
    // Add hover effect to data cards
    const dataCards = document.querySelectorAll('.data-card');
    
    dataCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const glow = this.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const glow = this.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
    
    // Initialize animate on scroll for initial view
    animateOnScroll();
    
    // Add some cinematic effects
    const heroTitle = document.querySelector('.hero-title');
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroTitle) {
            heroTitle.style.transform = `translate3d(0px, ${rate}px, 0px)`;
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .submit-btn, .audio-btn, .scroll-top');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', function() {
            navLinksContainer.style.display = navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
            this.classList.toggle('active');
        });
        
        // Adjust for mobile on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinksContainer.style.display = 'flex';
            } else {
                navLinksContainer.style.display = 'none';
            }
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Space to toggle audio
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            audioToggle.click();
        }
        
        // Escape to scroll to top
        if (e.code === 'Escape') {
            scrollTopBtn.click();
        }
    });
    
    // Add console greeting
    console.log('%c✨ Welcome to My Cinematic Portfolio ✨', 'font-size: 20px; color: #00d4ff; font-weight: bold;');
    console.log('%cDesigned with passion and code.', 'font-size: 14px; color: #b0b0d0;');
}