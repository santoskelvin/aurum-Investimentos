/**
 * ============================================
 * AURUM PATRIMONIAL SECTION - ANIMAÇÕES DINÂMICAS
 * ============================================
 * 
 * Animações elegantes e inovadoras para a seção
 * "AURUM PATRIMONIAL"
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
    document.addEventListener('DOMContentLoaded', initAurumPatrimonialAnimations);
  } else {
    initAurumPatrimonialAnimations();
  }

  function initAurumPatrimonialAnimations() {
    const section = document.querySelector('.aurum-patrimonial');
    
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
    // ANIMAÇÃO DO CARD PRINCIPAL
    // ============================================
    
    const mainCard = section.querySelector('.aurum-patrimonial-card');
    
    if (mainCard) {
      // Garantir que o card esteja visível por padrão
      gsap.set(mainCard, { opacity: 1, visibility: 'visible' });
      
      // Definir estado inicial para animação
      gsap.set(mainCard, { opacity: 0, y: 50, scale: 0.95 });
      
      gsap.to(mainCard, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // ============================================
    // ANIMAÇÃO DO HEADER (Label, Título, Subtítulo)
    // ============================================
    
    const headerLabel = section.querySelector('.aurum-patrimonial-label');
    const headerTitle = section.querySelector('.aurum-patrimonial-title');
    const headerSubtitle = section.querySelector('.aurum-patrimonial-subtitle');

    if (headerLabel && headerTitle && headerSubtitle) {
      // Garantir que os elementos estejam visíveis por padrão
      gsap.set([headerLabel, headerTitle, headerSubtitle], {
        opacity: 1,
        visibility: 'visible'
      });
      
      // Definir estados iniciais para animação
      gsap.set(headerLabel, { opacity: 0, y: 20 });
      gsap.set(headerTitle, { opacity: 0, y: 30 });
      gsap.set(headerSubtitle, { opacity: 0, y: 20 });
      
      // Timeline para animação sequencial do header
      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      headerTimeline
        .to(headerLabel, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
        .to(headerTitle, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.4')
        .to(headerSubtitle, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.5');
    }

    // ============================================
    // ANIMAÇÃO DOS CARDS (Escalonada)
    // ============================================
    
    const aurumCards = section.querySelectorAll('.aurum-card');
    
    if (aurumCards.length > 0) {
      aurumCards.forEach((card, index) => {
        const cardIcon = card.querySelector('.aurum-card-icon');
        const cardTitle = card.querySelector('.aurum-card-title');
        const cardText = card.querySelector('.aurum-card-text');
        
        // Usar fromTo para garantir que os elementos sempre terminem visíveis
        // e comecem do estado inicial apenas quando a animação disparar
        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        });

        // Animação do ícone (scale + rotate)
        if (cardIcon) {
          cardTimeline.fromTo(cardIcon, 
            {
              opacity: 0,
              scale: 0,
              rotation: -180
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.7,
              ease: 'back.out(1.7)'
            }
          );
        }

        // Animação do título (fade + slide up)
        if (cardTitle) {
          cardTimeline.fromTo(cardTitle,
            {
              opacity: 0,
              y: 20
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out'
            }, 
            index > 0 ? '-=0.4' : '-=0.3'
          );
        }

        // Animação do texto (fade + slide up)
        if (cardText) {
          cardTimeline.fromTo(cardText,
            {
              opacity: 0,
              y: 15
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out'
            }, 
            '-=0.4'
          );
        }

        // Animação do card completo (fade + scale)
        cardTimeline.fromTo(card,
          {
            opacity: 0,
            y: 30
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, 
          '-=0.6'
        );
      });
    }

    // ============================================
    // HOVER EFFECTS MELHORADOS
    // ============================================
    
    aurumCards.forEach(card => {
      const cardIcon = card.querySelector('.aurum-card-icon');
      const cardTitle = card.querySelector('.aurum-card-title');
      
      card.addEventListener('mouseenter', () => {
        if (cardIcon) {
          gsap.to(cardIcon, {
            scale: 1.15,
            rotation: 5,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
        
        if (cardTitle) {
          gsap.to(cardTitle, {
            y: -2,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        gsap.to(card, {
          y: -8,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        if (cardIcon) {
          gsap.to(cardIcon, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
        
        if (cardTitle) {
          gsap.to(cardTitle, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        gsap.to(card, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  }

  // ============================================
  // FALLBACK: Animações CSS caso GSAP não esteja disponível
  // ============================================
  
  function initFallbackAnimations(section) {
    const animatedElements = section.querySelectorAll('.aurum-patrimonial-label, .aurum-patrimonial-title, .aurum-patrimonial-subtitle, .aurum-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);
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
      .aurum-patrimonial .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

