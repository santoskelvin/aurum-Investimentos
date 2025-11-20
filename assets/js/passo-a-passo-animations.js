/**
 * ============================================
 * PASSO A PASSO SECTION - ANIMAÇÕES SIMPLES
 * ============================================
 * 
 * Animações sutis e elegantes para a seção
 * "passo a passo - Nós te guiamos"
 * 
 * Usa GSAP para animações suaves e performáticas
 */

(function() {
  'use strict';

  // Registrar plugin ScrollTrigger do GSAP
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Respeitar preferência de movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return; // Não executar animações se o usuário prefere movimento reduzido
  }

  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPassoAPassoAnimations);
  } else {
    initPassoAPassoAnimations();
  }

  function initPassoAPassoAnimations() {
    const section = document.querySelector('.passo-a-passo-section');
    
    if (!section) {
      return;
    }

    // Verificar se GSAP está disponível
    if (typeof gsap === 'undefined') {
      console.warn('GSAP não está disponível. Usando fallback de animações CSS.');
      initFallbackAnimations(section);
      return;
    }

    // ============================================
    // ANIMAÇÃO SIMPLES DO HEADER
    // ============================================
    
    const headerLabel = section.querySelector('.passo-a-passo-label');
    const headerTitle = section.querySelector('.passo-a-passo-title');
    const headerSubtitle = section.querySelector('.passo-a-passo-subtitle');

    if (headerLabel && headerTitle && headerSubtitle) {
      // Timeline simples para animação sequencial do header
      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      headerTimeline
        .fromTo(headerLabel, {
          opacity: 0,
          y: 15
        }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        .fromTo(headerTitle, {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.3')
        .fromTo(headerSubtitle, {
          opacity: 0,
          y: 15
        }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.4');
    }

    // ============================================
    // ANIMAÇÃO SIMPLES DOS CARDS (FADE IN SUAVE)
    // ============================================
    
    const passoCards = section.querySelectorAll('.passo-card');
    
    if (passoCards.length > 0) {
      // Animação simples: fade in com leve movimento vertical
      gsap.fromTo(passoCards, {
        opacity: 0,
        y: 30
      }, {
        scrollTrigger: {
          trigger: section.querySelector('.passo-a-passo-grid'),
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.15 // Delay simples entre os cards
      });
    }
  }

  // ============================================
  // FALLBACK: Animações CSS caso GSAP não esteja disponível
  // ============================================
  
  function initFallbackAnimations(section) {
    const animatedElements = section.querySelectorAll(
      '.passo-a-passo-label, .passo-a-passo-title, .passo-a-passo-subtitle, .passo-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Adicionar classe visible quando animado
    const style = document.createElement('style');
    style.textContent = `
      .passo-a-passo-section .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
})();
