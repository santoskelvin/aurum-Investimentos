/**
 * ============================================
 * HOW IT WORKS SECTION - ANIMAÇÕES DINÂMICAS
 * ============================================
 * 
 * Animações elegantes e inovadoras para a seção
 * "Como funciona a Alavancagem Patrimonial"
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
    document.addEventListener('DOMContentLoaded', initHowItWorksAnimations);
  } else {
    initHowItWorksAnimations();
  }

  function initHowItWorksAnimations() {
    const section = document.querySelector('.how-it-works');
    
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
    // ANIMAÇÃO DO HEADER (Label, Título, Subtítulo)
    // ============================================
    
    const headerLabel = section.querySelector('.how-it-works-label');
    const headerTitle = section.querySelector('.how-it-works-title');
    const headerSubtitle = section.querySelector('.how-it-works-subtitle');

    if (headerLabel && headerTitle && headerSubtitle) {
      // Timeline para animação sequencial do header
      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      headerTimeline
        .from(headerLabel, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out'
        })
        .from(headerTitle, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.4')
        .from(headerSubtitle, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.5');
    }

    // ============================================
    // ANIMAÇÃO DA ILUSTRAÇÃO SVG
    // ============================================
    
    const illustration = section.querySelector('.how-it-works-illustration');
    
    if (illustration) {
      gsap.from(illustration, {
        scrollTrigger: {
          trigger: illustration,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.8,
        x: -50,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // ============================================
    // ANIMAÇÃO DOS STEPS CARDS
    // ============================================
    
    const stepItems = section.querySelectorAll('.step-item');
    
    if (stepItems.length > 0) {
      stepItems.forEach((step, index) => {
        const stepNumber = step.querySelector('.step-number');
        const stepContent = step.querySelector('.step-content');
        
        // Timeline para cada step
        const stepTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        // Animação do número (pulse + fade)
        if (stepNumber) {
          stepTimeline.from(stepNumber, {
            opacity: 0,
            scale: 0,
            rotation: -180,
            duration: 0.6,
            ease: 'back.out(1.7)'
          });
        }

        // Animação do conteúdo (slide da direita)
        if (stepContent) {
          stepTimeline.from(stepContent, {
            opacity: 0,
            x: 50,
            duration: 0.7,
            ease: 'power2.out'
          }, index > 0 ? '-=0.3' : '-=0.2');
        }

        // Animação do card completo (fade + scale)
        stepTimeline.from(step, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.7');
      });
    }

    // ============================================
    // HOVER EFFECTS MELHORADOS
    // ============================================
    
    stepItems.forEach(step => {
      const stepNumber = step.querySelector('.step-number');
      
      step.addEventListener('mouseenter', () => {
        if (stepNumber) {
          gsap.to(stepNumber, {
            scale: 1.1,
            rotation: 360,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
        
        gsap.to(step, {
          y: -5,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      step.addEventListener('mouseleave', () => {
        if (stepNumber) {
          gsap.to(stepNumber, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
        
        gsap.to(step, {
          y: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // ============================================
    // ANIMAÇÃO DE LINHA CONECTORA (OPCIONAL)
    // ============================================
    
    // Criar linha conectora visual entre os steps (opcional, pode ser desabilitado)
    // Esta animação desenha uma linha vertical conectando os steps
    if (stepItems.length > 1) {
      const stepsContainer = section.querySelector('.how-it-works-steps');
      
      if (stepsContainer) {
        // Adicionar linha conectora via CSS ou SVG se necessário
        // Por enquanto, apenas animamos a aparição dos steps
      }
    }
  }

  // ============================================
  // FALLBACK: Animações CSS caso GSAP não esteja disponível
  // ============================================
  
  function initFallbackAnimations(section) {
    const animatedElements = section.querySelectorAll('.how-it-works-label, .how-it-works-title, .how-it-works-subtitle, .how-it-works-illustration, .step-item');
    
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
      .how-it-works .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

