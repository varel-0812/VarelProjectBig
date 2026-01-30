// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Start particles animation
        initParticles();
    }, 1500);
});

// Initialize particles animation
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `rgba(255, 0, 60, ${Math.random() * 0.5 + 0.1})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.boxShadow = '0 0 10px rgba(255, 0, 60, 0.5)';
        
        // Animation
        particle.animate([
            { transform: 'translate(0, 0)' },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)` }
        ], {
            duration: Math.random() * 3000 + 2000,
            iterations: Infinity,
            direction: 'alternate'
        });
        
        particlesContainer.appendChild(particle);
    }
}

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
    
    // Menu toggle for mobile
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Update active nav link
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
                section.style.opacity = '0';
            });
            
            // Show target section
            setTimeout(() => {
                targetSection.classList.add('active');
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                }, 50);
            }, 300);
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Initialize project cards
    initializeProjects();
    
    // Initialize media tabs
    initializeMediaTabs();
    
    // Initialize FAQ accordion
    initializeFAQ();
    
    // Initialize statistics counter
    initializeStatsCounter();
    
    // Initialize form submission
    initializeContactForm();
    
    // Initialize audio player
    initializeAudioPlayer();
    
    // Initialize skill bars animation
    initializeSkillBars();
});

// Project filtering and initialization
function initializeProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // DATA PROJECT DENGAN FOLDER LOKAL
    const projects = [
        {
            id: 1,
            title: "Website E-Commerce",
            description: "Website toko online dengan sistem pembayaran dan dashboard admin.",
            category: "web",
            tech: ["HTML", "CSS", "JavaScript", "PHP"],
            image: "../porto-project/images/fashion.png", // Gambar thumbnail di folder images
            demoUrl: "../porto-project/projects/ecommerce-web/index.html", // Path ke website di folder projects
            links: {
                demo: "../porto-project/projects/ecommerce-web/index.html", // Sama seperti demoUrl
                github: "https://github.com/username/ecommerce"
            }
        },
        {
            id: 2,
            title: "Aplikasi Todo List",
            description: "Aplikasi manajemen tugas dengan fitur drag & drop dan local storage.",
            category: "app",
            tech: ["JavaScript", "LocalStorage", "CSS Grid"],
            image: "../porto-project/images/todo.png",
            demoUrl: "../porto-project/projects/todo-app/index.html",
            links: {
                demo: "../porto-project/projects/todo-app/index.html",
                github: "https://github.com/username/todo-app"
            }
        },
        {
            id: 3,
            title: "Portfolio Design",
            description: "Desain website portfolio dengan animasi dan efek parallax.",
            category: "design",
            tech: ["Figma", "Photoshop", "CSS Animation"],
            image: "../porto-project/images/portodes.png",
            demoUrl: "../porto-project/projects/portofolio-design/index.html",
            links: {
                demo: "../porto-projectprojects/portfolio-design/index.html",
                behance: "#"
            }
        },
        {
            id: 4,
            title: "Weather Dashboard",
            description: "Dashboard cuaca dengan API integration dan chart visualisasi.",
            category: "web",
            tech: ["API", "Chart.js", "JavaScript"],
            image: "../porto-project/images/weatherrel.png",
            demoUrl: "../porto-project/projects/weather-dashboard/index.html",
            links: {
                demo: "../porto-project/projects/weather-dashboard/index.html",
                github: "https://github.com/username/weather-app"
            }
        },
        {
            id: 5,
            title: "Restaurant Website",
            description: "Website restoran dengan menu online dan sistem reservasi.",
            category: "web",
            tech: ["HTML5", "CSS3", "JavaScript", "Form Validation"],
            image: "../porto-project/images/restaurant.png",
            demoUrl: "../porto-project/projects/restaurant-website/index.html",
            links: {
                demo: "../porto-project/projects/restaurant-website/index.html",
                github: "https://github.com/username/restaurant"
            }
        },
        {
            id: 6,
            title: "Game JavaScript",
            description: "Game sederhana berbasis JavaScript dengan canvas dan animasi.",
            category: "app",
            tech: ["Canvas API", "JavaScript", "Game Physics"],
            image: "../porto-project/images/game.png",
            demoUrl: "../projects/javascript-game/index.html",
            links: {
                demo: "../projects/javascript-game/index.html",
                github: "https://github.com/username/javascript-game"
            }
        }
    ];
    
    // Render projects
    function renderProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);
            
            // Generate tech tags HTML
            const techTags = project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
            
            // Generate links HTML
            let linksHTML = '';
            if (project.links.demo) {
                linksHTML += `<a href="${project.links.demo}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>`;
            }
            if (project.links.github) {
                linksHTML += `<a href="${project.links.github}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>`;
            }
            if (project.links.behance) {
                linksHTML += `<a href="${project.links.behance}" class="project-link" target="_blank"><i class="fab fa-behance"></i> Behance</a>`;
            }
            
            // PROJECT CARD DENGAN GAMBAR YANG BISA DIKLIK
            projectCard.innerHTML = `
                <div class="project-img-container" data-demo-url="${project.demoUrl}">
                    <img src="${project.image}" alt="${project.title}" class="project-thumbnail">
                    <div class="img-overlay"></div>
                    <div class="view-demo-overlay">
                        <div class="view-demo-btn">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </div>
                        <p>Klik untuk membuka website</p>
                    </div>
                </div>
                <div class="project-content">
                    <span class="project-category">${project.category.toUpperCase()}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-tech">${techTags}</div>
                    <div class="project-links">${linksHTML}</div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
            
            // Tambahkan event listener untuk gambar yang bisa diklik
            const projectImgContainer = projectCard.querySelector('.project-img-container');
            const projectThumbnail = projectCard.querySelector('.project-thumbnail');
            const imgOverlay = projectCard.querySelector('.img-overlay');
            const viewDemoOverlay = projectCard.querySelector('.view-demo-overlay');
            const viewDemoBtn = projectCard.querySelector('.view-demo-btn');
            
            // Fungsi untuk membuka demo
            function openDemo() {
                window.open(project.demoUrl, '_blank');
            }
            
            // Klik pada gambar container
            projectImgContainer.addEventListener('click', openDemo);
            
            // Klik pada tombol "Live Demo"
            viewDemoBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Mencegah event bubbling
                openDemo();
            });
        });
    }
    
    // Initial render
    renderProjects();
    
    // Filter buttons event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            const filter = button.getAttribute('data-filter');
            renderProjects(filter);
        });
    });
}

// Media tabs functionality
function initializeMediaTabs() {
    const mediaTabs = document.querySelectorAll('.media-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    mediaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            mediaTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
            
            // If video tab is selected, play the video
            if (tabId === 'video') {
                const video = document.getElementById('mainVideo');
                video.play();
            }
            
            // If audio tab is selected, initialize audio
            if (tabId === 'audio') {
                initializeAudioPlayer();
            }
        });
    });
    
    // Video playlist functionality
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            playlistItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // In a real implementation, this would change the video source
            const video = document.getElementById('mainVideo');
            video.load();
            video.play();
        });
    });
}

// FAQ accordion functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Statistics counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Animate counting
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
            }
        }, 16);
    }
    
    // Check on scroll
    let animated = false;
    
    function checkStats() {
        if (!animated && isInViewport(document.querySelector('.stats-grid'))) {
            statNumbers.forEach(number => {
                animateCounter(number);
            });
            animated = true;
        }
    }
    
    // Initial check
    checkStats();
    
    // Check on scroll
    window.addEventListener('scroll', checkStats);
}

// Contact form submission
function initializeContactForm() {
    const contactForm = document.getElementById('messageForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Harap isi semua field!');
                return;
            }
            
            // In a real implementation, you would send this data to a server
            // For this example, we'll just show a success message
            alert(`Terima kasih ${name}! Pesan Anda telah berhasil dikirim. Saya akan menghubungi Anda melalui email segera.`);
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Audio player functionality
function initializeAudioPlayer() {
    const playBtn = document.querySelector('.play-btn');
    const progressFill = document.querySelector('.progress-fill');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeSlider = document.querySelector('.volume-slider');
    const audio = document.getElementById('backgroundAudio');
    
    if (!playBtn || !audio) return;
    
    // Format time (seconds to mm:ss)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    // Set total time
    function setTotalTime() {
        totalTimeEl.textContent = formatTime(audio.duration);
    }
    
    // Play/pause functionality
    playBtn.addEventListener('click', () => {
        const icon = playBtn.querySelector('i');
        
        if (audio.paused) {
            audio.play();
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            audio.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    });
    
    // Progress bar click
    progressBar.addEventListener('click', (e) => {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    });
    
    // Volume control
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });
    
    // Audio event listeners
    audio.addEventListener('loadedmetadata', setTotalTime);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        const icon = playBtn.querySelector('i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });
    
    // Playlist functionality
    const playlistItems = document.querySelectorAll('.playlist .playlist-item');
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            playlistItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // In a real implementation, this would change the audio source
            // For now, we'll just restart the current audio
            audio.currentTime = 0;
            audio.play();
            const icon = playBtn.querySelector('i');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        });
    });
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Animate skill bars when in viewport
    function animateSkillBars() {
        skillBars.forEach(bar => {
            if (isElementInViewport(bar) && !bar.dataset.animated) {
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = width;
                    bar.dataset.animated = 'true';
                }, 300);
            }
        });
    }
    
    // Initial check
    animateSkillBars();
    
    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);
}

// Interactive background effects on mouse move
document.addEventListener('mousemove', (e) => {
    const lightBeam = document.querySelector('.light-beam');
    if (lightBeam) {
        const x = e.clientX / window.innerWidth;
        lightBeam.style.transform = `translateX(-50%) rotate(${5 * x}deg)`;
    }
});

// Add cinematic typing effect to home page title
function typeWriterEffect() {
    const titleElement = document.querySelector('.main-title');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    
    // Start typing effect when page loads
    setTimeout(type, 1000);
}

// Initialize typing effect
window.addEventListener('load', typeWriterEffect);