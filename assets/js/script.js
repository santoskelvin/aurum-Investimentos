

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
// HERO PARALLAX EFFECT
// ============================================

function initHeroParallax() {
  const heroBg = qs('.hero-bg-image');
  
  if (!heroBg) {
    return;
  }
  
  // Respeitar preferência de movimento reduzido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  let ticking = false;
  
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const heroSection = qs('.hero');
        
        if (!heroSection) {
          ticking = false;
          return;
        }
        
        const heroRect = heroSection.getBoundingClientRect();
        const isVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
        
        if (isVisible) {
          // Calcular o deslocamento baseado na posição do scroll
          // Movimento suave e sutil (até 30px)
          const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / (heroRect.height + window.innerHeight)));
          const parallaxOffset = scrollProgress * 30;
          
          heroBg.style.transform = `translateY(${parallaxOffset}px)`;
        } else if (heroRect.bottom < 0) {
          // Reset quando a hero section está completamente acima da viewport
          heroBg.style.transform = 'translateY(0px)';
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
// HERO ANIMATIONS (Hierarchical Loading + Counter)
// ============================================

function initHeroAnimations() {
  const heroSection = qs('.hero');
  if (!heroSection) return;
  
  // Respeitar preferência de movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Animar elementos hierarquicamente
  const animateItems = qsa('.hero-animate-item');
  
  if (animateItems.length === 0) return;
  
  // Função para animar um item
  function animateItem(item, delay) {
    setTimeout(() => {
      item.classList.add('visible');
    }, delay * 1000);
  }
  
  // Animar todos os itens com seus delays
  animateItems.forEach(item => {
    const delay = parseFloat(item.getAttribute('data-animate-delay')) || 0;
    animateItem(item, delay);
  });
  
  // Animar contadores de números
  function animateCounter(element, target, duration = 2000) {
    if (prefersReducedMotion) {
      element.textContent = target;
      return;
    }
    
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const start = 0;
    const startTime = performance.now();
    
    // Adicionar classe de animação
    element.classList.add('animating');
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      
      // Formatar o valor
      let displayValue = current.toString();
      
      // Adicionar prefixo/sufixo se necessário
      if (prefix && suffix) {
        displayValue = `${prefix}${displayValue}${suffix}`;
      } else if (prefix) {
        displayValue = `${prefix}${displayValue}`;
      } else if (suffix) {
        displayValue = `${displayValue}${suffix}`;
      } else {
        displayValue = current.toString();
      }
      
      element.textContent = displayValue;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Garantir valor final exato
        let finalValue = target.toString();
        if (prefix && suffix) {
          finalValue = `${prefix}${finalValue}${suffix}`;
        } else if (prefix) {
          finalValue = `${prefix}${finalValue}`;
        } else if (suffix) {
          finalValue = `${finalValue}${suffix}`;
        } else {
          finalValue = target.toString();
        }
        element.textContent = finalValue;
        element.classList.remove('animating');
      }
    }
    
    requestAnimationFrame(update);
  }
  
  // Iniciar animação dos contadores após um delay
  setTimeout(() => {
    const metricValues = qsa('.hero-metric-value[data-target]');
    metricValues.forEach((element, index) => {
      const target = parseInt(element.getAttribute('data-target'));
      const delay = index * 200; // Delay escalonado entre os números
      
      setTimeout(() => {
        animateCounter(element, target);
      }, delay);
    });
  }, 800); // Iniciar após as animações de texto começarem
}

// ============================================
// INIT FUNCTION
// ============================================

function init() {
  initSmoothScroll();
  initFadeInObserver();
  initHeaderBehavior();
  initMobileNav();
  initHeroParallax();
  initHeroAnimations();
}

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', init);


