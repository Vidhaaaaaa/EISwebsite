document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav__toggle");
  const navClose = document.querySelector(".nav__close");
  const navLinks = document.querySelector(".nav__links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("is-open");
    });
  }

  if (navClose && navLinks) {
    navClose.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
    });
  }

  // Animated stat counter for About page
  const statNumbers = document.querySelectorAll('.stat-number');
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => {
    observer.observe(stat);
  });

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 30);
  }

  // Enhanced shooting stars background with cursor interaction
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  
  if (!prefersReducedMotion) {
    const canvas = document.createElement("canvas");
    canvas.className = "starfield";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");

    const state = {
      stars: [],
      shooters: [],
      mouseX: window.innerWidth / 2,
      mouseY: window.innerHeight / 2,
      targetMouseX: window.innerWidth / 2,
      targetMouseY: window.innerHeight / 2,
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Background stars - smaller and white
    for (let i = 0; i < 100; i++) {
      state.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.5, // Smaller stars
        alpha: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * 0.02 + 0.01,
      });
    }

    const spawnShooter = (x, y) => {
      if (state.shooters.length < 5) { // More shooters allowed
        state.shooters.push({
          x,
          y,
          vx: (Math.random() * 2 + 3) * (Math.random() > 0.5 ? 1 : -1),
          vy: -Math.random() * 2 - 3,
          life: 1,
        });
      }
    };

    let lastMouseMove = 0;
    window.addEventListener("pointermove", (e) => {
      state.targetMouseX = e.clientX;
      state.targetMouseY = e.clientY;
      const now = performance.now();
      if (now - lastMouseMove > 200) { // More frequent shooting
        lastMouseMove = now;
        spawnShooter(e.clientX, e.clientY);
      }
    });

    // Also spawn shooters periodically for constant effect
    setInterval(() => {
      if (Math.random() > 0.7) {
        spawnShooter(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }
    }, 1000);

    const loop = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Smooth mouse following
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.15;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.15;

      // Background stars with subtle parallax
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (const s of state.stars) {
        s.alpha += (Math.random() - 0.5) * s.twinkle;
        s.alpha = Math.max(0.2, Math.min(0.8, s.alpha));
        ctx.globalAlpha = s.alpha;
        
        // Subtle mouse parallax
        const parallaxX = (state.mouseX - window.innerWidth / 2) * 0.01 * s.r;
        const parallaxY = (state.mouseY - window.innerHeight / 2) * 0.01 * s.r;
        
        ctx.beginPath();
        ctx.arc(s.x + parallaxX, s.y + parallaxY, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars with enhanced trails
      ctx.globalAlpha = 1;
      for (let i = state.shooters.length - 1; i >= 0; i--) {
        const sh = state.shooters[i];
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.01;
        
        if (sh.life <= 0 || sh.y < -50 || sh.x < -50 || sh.x > window.innerWidth + 50) {
          state.shooters.splice(i, 1);
          continue;
        }
        
        // Enhanced gradient trail
        const gradient = ctx.createLinearGradient(
          sh.x, sh.y,
          sh.x - sh.vx * 12, sh.y - sh.vy * 12
        );
        gradient.addColorStop(0, `rgba(135, 206, 250, ${sh.life})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${sh.life * 0.8})`);
        gradient.addColorStop(1, "rgba(135, 206, 250, 0)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 12, sh.y - sh.vy * 12);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(135, 206, 250, 0.8)";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }
});
