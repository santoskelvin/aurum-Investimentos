/**
 * ============================================
 * MICRO CALCULATOR SECTION - ANIMAÇÕES DINÂMICAS
 * ============================================
 * 
 * Animações elegantes e inovadoras para a seção
 * "Simule em segundos - Converta seu aporte em patrimônio projetado"
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
    document.addEventListener('DOMContentLoaded', initMicroCalcAnimations);
  } else {
    initMicroCalcAnimations();
  }

  function initMicroCalcAnimations() {
    const section = document.querySelector('.micro-calc-section');
    
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
    // ANIMAÇÃO DO HEADER (Label, Título, Texto, Lista)
    // ============================================
    
    const headerLabel = section.querySelector('.micro-calc-label');
    const headerTitle = section.querySelector('.micro-calc-title');
    const headerText = section.querySelector('.micro-calc-text');
    const headerList = section.querySelector('.micro-calc-list');
    const listItems = headerList ? headerList.querySelectorAll('li') : [];

    if (headerLabel && headerTitle && headerText) {
      // Timeline para animação sequencial do header
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
          y: 20,
          scale: 0.95
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        })
        .fromTo(headerTitle, {
          opacity: 0,
          y: 40,
          scale: 0.98
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.4')
        .fromTo(headerText, {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.5');

      // Animar itens da lista com stagger
      if (listItems.length > 0) {
        headerTimeline.fromTo(listItems, {
          opacity: 0,
          x: -20
        }, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.15
        }, '-=0.4');
      }
    }

    // ============================================
    // ANIMAÇÃO DO CARD DO FORMULÁRIO
    // ============================================
    
    const calcCard = section.querySelector('.micro-calc-card');
    
    if (calcCard) {
      gsap.fromTo(calcCard, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        rotationY: 5
      }, {
        scrollTrigger: {
          trigger: calcCard,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // ============================================
      // ANIMAÇÃO DOS ELEMENTOS DO FORMULÁRIO
      // ============================================
      
      const inputGroup = calcCard.querySelector('.micro-input-group');
      const inputWrap = calcCard.querySelector('.micro-input-wrap');
      const input = calcCard.querySelector('input[type="number"]');
      const results = calcCard.querySelector('.micro-results');
      const resultItems = results ? results.querySelectorAll('.micro-result') : [];
      const submitBtn = calcCard.querySelector('.micro-calc-btn');

      // Timeline para elementos do formulário
      const formTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: calcCard,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        },
        delay: 0.2
      });

      // Animar input group
      if (inputGroup) {
        formTimeline.fromTo(inputGroup, {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      // Animar input wrap com efeito de "digitação"
      if (inputWrap) {
        formTimeline.fromTo(inputWrap, {
          opacity: 0,
          scale: 0.9,
          x: -20
        }, {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.7,
          ease: 'back.out(1.2)'
        }, '-=0.3');
      }

      // Animar resultados com stagger
      if (resultItems.length > 0) {
        formTimeline.fromTo(resultItems, {
          opacity: 0,
          y: 25,
          scale: 0.95
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.2
        }, '-=0.4');
      }

      // Animar botão
      if (submitBtn) {
        formTimeline.fromTo(submitBtn, {
          opacity: 0,
          scale: 0.9,
          y: 20
        }, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.3)'
        }, '-=0.3');
      }
    }

    // ============================================
    // HOVER EFFECTS MELHORADOS
    // ============================================
    
    if (calcCard) {
      const inputWrap = calcCard.querySelector('.micro-input-wrap');
      const submitBtn = calcCard.querySelector('.micro-calc-btn');
      
      // Hover no input wrap
      if (inputWrap) {
        inputWrap.addEventListener('mouseenter', () => {
          gsap.to(inputWrap, {
            scale: 1.02,
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        inputWrap.addEventListener('mouseleave', () => {
          gsap.to(inputWrap, {
            scale: 1,
            boxShadow: '',
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      }

      // Hover no botão
      if (submitBtn) {
        submitBtn.addEventListener('mouseenter', () => {
          gsap.to(submitBtn, {
            scale: 1.05,
            y: -2,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        submitBtn.addEventListener('mouseleave', () => {
          gsap.to(submitBtn, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      }
    }
  }

  // ============================================
  // FALLBACK: Animações CSS caso GSAP não esteja disponível
  // ============================================
  
  function initFallbackAnimations(section) {
    const animatedElements = section.querySelectorAll(
      '.micro-calc-label, .micro-calc-title, .micro-calc-text, .micro-calc-list li, .micro-calc-card'
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
      .micro-calc-section .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

