

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  const links = qsa('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Ignorar links vazios ou apenas "#"
      if (href === '#' || href === '') {
        return;
      }
      
      const target = qs(href);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// SECTION OBSERVER (FADE IN)
// ============================================

function initFadeInObserver() {
  const fadeElements = qsa('.fade-in, .fade-up, .fade-bottom');
  
  if (fadeElements.length === 0) {
    return;
  }
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve após ativar para melhor performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// HEADER BEHAVIOR (Sticky + Shrink)
// ============================================

function initHeaderBehavior() {
  const header = qs('.site-header');
  
  if (!header) {
    return;
  }
  
  let ticking = false;
  
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Verificar estado inicial
  handleScroll();
}

// ============================================
// MOBILE NAVIGATION TOGGLE
// ============================================

function initMobileNav() {
  const navToggle = qs('.nav-toggle');
  const mainNav = qs('.main-nav');
  
  if (!navToggle || !mainNav) {
    return;
  }
  
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('open');
    
    if (isOpen) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    } else {
      mainNav.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Fechar menu');
    }
  });
  
  // Fechar menu ao clicar em um link
  const navLinks = qsa('.nav-list a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
  
  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
      navToggle.focus();
    }
  });
}

// ============================================
// INIT FUNCTION
// ============================================

function init() {
  initSmoothScroll();
  initFadeInObserver();
  initHeaderBehavior();
  initMobileNav();
}

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', init);


