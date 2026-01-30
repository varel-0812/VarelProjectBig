/* ===== DEVICE CHECK ===== */
const isMobile = window.innerWidth <= 768;

/* ===== PARTICLE BACKGROUND ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = "rgba(255,80,120,0.6)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const total = isMobile ? 40 : 120; // 👈 hanya ini beda
  for (let i = 0; i < total; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ===== PARALLAX (DESKTOP ONLY) ===== */
const card = document.querySelector(".hero-card");
const hud = document.querySelector(".hud-core");

if (!isMobile) {
  document.addEventListener("mousemove", e => {
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;

    card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });

  document.addEventListener("mousemove", e => {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;

    hud.style.transform = `translate(${x}px, ${y}px)`;
  });
} else {
  // 📱 Mobile tetap rapi
  card.style.transform = "none";
  hud.style.transform = "none";
}

/* ===== SYSTEM BOOT ===== */
const boot = document.getElementById("boot-screen");
const progress = document.getElementById("boot-progress");
const text = document.getElementById("boot-text");

const messages = [
  "Loading core modules...",
  "Initializing UI system...",
  "Syncing particle engine...",
  "Calibrating HUD...",
  "System ready."
];

let percent = 0;
let msgIndex = 0;

const bootInterval = setInterval(() => {
  percent += Math.random() * 12;
  if (percent > 100) percent = 100;

  progress.style.width = percent + "%";

  if (percent > (msgIndex + 1) * 20 && messages[msgIndex]) {
    text.textContent = messages[msgIndex];
    msgIndex++;
  }

  if (percent === 100) {
    clearInterval(bootInterval);
    setTimeout(() => {
      boot.style.opacity = 0;
      boot.style.pointerEvents = "none";
      setTimeout(() => boot.remove(), 800);
    }, 600);
  }
}, 300);

/* ===== TYPING TITLE ===== */
const titleText = "Welcome to\nmy Portfolio\nWebsite";
const titleEl = document.getElementById("type-title");

let i = 0;
function typeEffect() {
  if (i < titleText.length) {
    titleEl.innerHTML += titleText[i] === "\n" ? "<br>" : titleText[i];
    i++;
    setTimeout(typeEffect, 55);
  }
}
setTimeout(typeEffect, 1200);

/* ===== TITLE PARALLAX (DESKTOP ONLY) ===== */
const heroLeft = document.querySelector(".hero-left");

if (!isMobile) {
  heroLeft.addEventListener("mousemove", e => {
    const rect = heroLeft.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;

    titleEl.style.transform = `translate(${x}px, ${y}px)`;
  });

  heroLeft.addEventListener("mouseleave", () => {
    titleEl.style.transform = "translate(0,0)";
  });
}

/* ===== PAGE TRANSITION ===== */
const nextPage = document.getElementById("nextPage");

nextPage.addEventListener("click", function (e) {
  e.preventDefault();
  document.body.classList.add("page-fade");

  setTimeout(() => {
    window.location.href = this.href;
  }, 700);
});