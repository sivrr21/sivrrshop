/**
 * SVIRR SCRIPT • Interactivity, Liquid Navigation & Glass Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navButtons = document.querySelectorAll('.nav-btn');
  const navIndicator = document.querySelector('.nav-indicator');
  const panels = document.querySelectorAll('.category-panel');
  const tiltCards = document.querySelectorAll('[data-tilt]');

  /**
   * Updates the floating indicator pill behind the active navigation button
   */
  function updateNavIndicator(activeBtn) {
    if (!activeBtn || !navIndicator) return;
    const parent = activeBtn.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const left = btnRect.left - parentRect.left;
    const width = btnRect.width;

    navIndicator.style.transform = `translateX(${left}px)`;
    navIndicator.style.width = `${width}px`;
  }

  /**
   * Switches category panel with smooth animation
   */
  function switchCategory(targetId, clickedBtn) {
    // 1. Update button states
    navButtons.forEach(btn => {
      const isActive = btn === clickedBtn;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 2. Reposition indicator
    updateNavIndicator(clickedBtn);

    // 3. Switch panel visibility
    panels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  // Setup click events on navigation buttons
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchCategory(targetId, btn);
    });
  });

  // Initialize indicator on load
  const initialActive = document.querySelector('.nav-btn.active');
  if (initialActive) {
    // Wait for fonts/layout to settle
    requestAnimationFrame(() => {
      updateNavIndicator(initialActive);
    });
  }

  // Update on window resize
  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-btn.active');
    if (currentActive) updateNavIndicator(currentActive);
  });

  // Keyboard navigation between categories (Left / Right arrows)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const currentActive = document.querySelector('.nav-btn.active');
      const currentIndex = Array.from(navButtons).indexOf(currentActive);
      let nextIndex = 0;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % navButtons.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + navButtons.length) % navButtons.length;
      }

      const nextBtn = navButtons[nextIndex];
      const targetId = nextBtn.getAttribute('data-target');
      switchCategory(targetId, nextBtn);
    }
  });

  /**
   * Interactive Liquid Glass specular highlight & 3D tilt
   */
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update specular highlight gradient variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D subtle tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // Max -4deg to 4deg
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '0%');
    });
  });

  // Dynamic light following mouse globally for ambient background reflection
  const bgBlobs = document.querySelector('.blob-3');
  if (bgBlobs) {
    let mouseTimeout;
    window.addEventListener('mousemove', (e) => {
      if (mouseTimeout) cancelAnimationFrame(mouseTimeout);
      mouseTimeout = requestAnimationFrame(() => {
        const xPercent = (e.clientX / window.innerWidth) * 20 - 10;
        const yPercent = (e.clientY / window.innerHeight) * 20 - 10;
        bgBlobs.style.transform = `translate(${xPercent}px, ${yPercent}px)`;
      });
    });
  }

  // Smooth click ripple effect on main Discord CTA
  const discordTrigger = document.getElementById('main-discord-trigger');
  if (discordTrigger) {
    discordTrigger.addEventListener('mousedown', (e) => {
      const rect = discordTrigger.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.35);
        pointer-events: none;
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
      `;

      discordTrigger.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // Add ripple animation keyframes dynamically if not present
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes rippleEffect {
      to {
        transform: scale(2.4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleEl);
});
