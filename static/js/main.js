document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("is-open");
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

    // Background stars
    for (let i = 0; i < 80; i++) {
      state.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        twinkle: Math.random() * 0.015 + 0.005,
      });
    }

    const spawnShooter = (x, y) => {
      if (state.shooters.length < 3) { // Limit max shooters
        state.shooters.push({
          x,
          y,
          vx: (Math.random() * 1.5 + 2) * (Math.random() > 0.5 ? 1 : -1),
          vy: -Math.random() * 1.5 - 2,
          life: 1,
        });
      }
    };

    let lastMouseMove = 0;
    window.addEventListener("pointermove", (e) => {
      state.targetMouseX = e.clientX;
      state.targetMouseY = e.clientY;
      const now = performance.now();
      if (now - lastMouseMove > 300) { // Less frequent shooting
        lastMouseMove = now;
        spawnShooter(e.clientX, e.clientY);
      }
    });

    const loop = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Smooth mouse following
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.1;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.1;

      // Background stars with subtle parallax
      ctx.fillStyle = "rgba(229, 240, 255, 0.6)";
      for (const s of state.stars) {
        s.alpha += (Math.random() - 0.5) * s.twinkle;
        s.alpha = Math.max(0.1, Math.min(0.6, s.alpha));
        ctx.globalAlpha = s.alpha;
        
        // Subtle mouse parallax
        const parallaxX = (state.mouseX - window.innerWidth / 2) * 0.01 * s.r;
        const parallaxY = (state.mouseY - window.innerHeight / 2) * 0.01 * s.r;
        
        ctx.beginPath();
        ctx.arc(s.x + parallaxX, s.y + parallaxY, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      ctx.globalAlpha = 1;
      for (let i = state.shooters.length - 1; i >= 0; i--) {
        const sh = state.shooters[i];
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.015;
        
        if (sh.life <= 0 || sh.y < -50 || sh.x < -50 || sh.x > window.innerWidth + 50) {
          state.shooters.splice(i, 1);
          continue;
        }
        
        // Gradient trail
        const gradient = ctx.createLinearGradient(
          sh.x, sh.y,
          sh.x - sh.vx * 8, sh.y - sh.vy * 8
        );
        gradient.addColorStop(0, `rgba(191, 219, 254, ${sh.life * 0.9})`);
        gradient.addColorStop(1, "rgba(191, 219, 254, 0)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.stroke();
      }

      requestAnimationFrame(loop);
    };

    loop();
  }

  // Gallery category filtering
  const categoryBtns = document.querySelectorAll('.category-btn');
  if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Here you would typically filter gallery items
        // For now, it's just a visual feedback
        const category = btn.dataset.category;
        console.log(`Filtering by category: ${category}`);
      });
    });
  }

  // Interest tag interactions for Get Involved page
  const interestTags = document.querySelectorAll('.interest-tag');
  if (interestTags.length > 0) {
    interestTags.forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        
        // Get all active tags
        const activeTags = Array.from(document.querySelectorAll('.interest-tag.active'))
          .map(t => t.textContent);
        
        console.log('Selected interests:', activeTags);
      });
    });
  }

  // Navigation toggle only
});
