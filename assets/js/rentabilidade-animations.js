/**
 * ============================================
 * RENTABILIDADE SECTION - ANIMAÇÕES DINÂMICAS
 * ============================================
 * 
 * Animações elegantes e inovadoras para a seção
 * "ALAVANCAGEM IMOBILIÁRIA - As rentabilidades mais inteligentes do mercado"
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
    document.addEventListener('DOMContentLoaded', initRentabilidadeAnimations);
  } else {
    initRentabilidadeAnimations();
  }

  function initRentabilidadeAnimations() {
    const section = document.querySelector('.rentabilidade-section');
    
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
    // ANIMAÇÃO DO HEADER (Label, Título, Descrição, CTA)
    // ============================================
    
    const headerLabel = section.querySelector('.rentabilidade-label');
    const headerTitle = section.querySelector('.rentabilidade-title');
    const headerDescription = section.querySelector('.rentabilidade-description');
    const headerCTA = section.querySelector('.rentabilidade-cta');

    if (headerLabel && headerTitle && headerDescription) {
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
        .fromTo(headerDescription, {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.5');

      // Animar CTA separadamente (se existir)
      if (headerCTA) {
        headerTimeline.fromTo(headerCTA, {
          opacity: 0,
          x: 30,
          scale: 0.9
        }, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.3');
      }
    }

    // ============================================
    // ANIMAÇÃO DOS CARDS DE GRÁFICOS (STAGGERED)
    // ============================================
    
    const chartCards = section.querySelectorAll('.chart-card');
    
    if (chartCards.length > 0) {
      // Animar cards com stagger (entrada escalonada)
      gsap.fromTo(chartCards, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotationX: 15
      }, {
        scrollTrigger: {
          trigger: section.querySelector('.rentabilidade-grid'),
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        },
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: {
          amount: 0.6,
          from: 'start'
        }
      });

      // ============================================
      // ANIMAÇÃO DOS ELEMENTOS INTERNOS DOS CARDS
      // ============================================
      
      chartCards.forEach((card, index) => {
        const cardHeader = card.querySelector('.card-header');
        const strategyLabel = card.querySelector('.strategy-label');
        const kpiSummary = card.querySelector('.kpi-summary');
        const kpiValue = card.querySelector('.kpi-value');
        const kpiBadge = card.querySelector('.kpi-badge');
        const chartContainer = card.querySelector('.chart-container');
        const chartFooter = card.querySelector('.chart-footer');

        // Timeline para cada card
        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          },
          delay: index * 0.15 // Delay escalonado
        });

        // Animar header do card
        if (cardHeader) {
          cardTimeline.fromTo(cardHeader, {
            opacity: 0,
            y: 20
          }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }

        // Animar label da estratégia
        if (strategyLabel) {
          cardTimeline.fromTo(strategyLabel, {
            opacity: 0,
            x: -20
          }, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'power2.out'
          }, '-=0.3');
        }

        // Animar KPI summary
        if (kpiSummary) {
          cardTimeline.fromTo(kpiSummary, {
            opacity: 0,
            scale: 0.8
          }, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.3)'
          }, '-=0.2');
        }

        // Animar valor KPI com contador
        if (kpiValue) {
          const finalValue = kpiValue.textContent;
          const numericValue = parseFloat(finalValue.replace(/[^\d,]/g, '').replace(',', '.'));
          
          if (!isNaN(numericValue)) {
            gsap.fromTo({ value: 0 }, {
              value: numericValue,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none',
                once: true
              },
              onUpdate: function() {
                const formatted = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(this.targets()[0].value);
                kpiValue.textContent = formatted;
              }
            });
          } else {
            // Fallback: apenas fade-in
            cardTimeline.fromTo(kpiValue, {
              opacity: 0,
              scale: 0.9
            }, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out'
            }, '-=0.3');
          }
        }

        // Animar badge KPI
        if (kpiBadge) {
          cardTimeline.fromTo(kpiBadge, {
            opacity: 0,
            scale: 0,
            rotation: -180
          }, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
          }, '-=0.4');
        }

        // Animar container do gráfico
        if (chartContainer) {
          cardTimeline.fromTo(chartContainer, {
            opacity: 0,
            scale: 0.95,
            y: 20
          }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
          }, '-=0.5');
        }

        // Animar footer do gráfico
        if (chartFooter) {
          cardTimeline.fromTo(chartFooter, {
            opacity: 0,
            y: 15
          }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, '-=0.3');
        }
      });

      // ============================================
      // HOVER EFFECTS MELHORADOS NOS CARDS
      // ============================================
      
      chartCards.forEach(card => {
        const kpiBadge = card.querySelector('.kpi-badge');
        const kpiValue = card.querySelector('.kpi-value');
        
        card.addEventListener('mouseenter', () => {
          // Elevar card
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            duration: 0.3,
            ease: 'power2.out'
          });

          // Animar badge
          if (kpiBadge) {
            gsap.to(kpiBadge, {
              scale: 1.1,
              rotation: 5,
              duration: 0.3,
              ease: 'power2.out'
            });
          }

          // Destaque no valor KPI
          if (kpiValue) {
            gsap.to(kpiValue, {
              scale: 1.05,
              color: '#D4AF37',
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          // Resetar card
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            duration: 0.3,
            ease: 'power2.out'
          });

          // Resetar badge
          if (kpiBadge) {
            gsap.to(kpiBadge, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          }

          // Resetar valor KPI
          if (kpiValue) {
            gsap.to(kpiValue, {
              scale: 1,
              color: '',
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        });
      });
    }

    // ============================================
    // ANIMAÇÃO DOS GRÁFICOS SVG (BARRAS CRESCENDO)
    // ============================================
    
    // Aguardar gráficos serem renderizados (se houver script de renderização)
    setTimeout(() => {
      const svgCharts = section.querySelectorAll('.bar-chart');
      
      svgCharts.forEach((svg, index) => {
        const bars = svg.querySelectorAll('rect[data-bar]');
        
        if (bars.length > 0) {
          gsap.fromTo(bars, {
            scaleY: 0,
            transformOrigin: 'bottom center'
          }, {
            scrollTrigger: {
              trigger: svg.closest('.chart-card'),
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true
            },
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.out',
            stagger: {
              amount: 0.4,
              from: 'start'
            },
            delay: index * 0.2
          });
        }
      });
    }, 500); // Delay para garantir que os gráficos foram renderizados
  }

  // ============================================
  // FALLBACK: Animações CSS caso GSAP não esteja disponível
  // ============================================
  
  function initFallbackAnimations(section) {
    const animatedElements = section.querySelectorAll(
      '.rentabilidade-label, .rentabilidade-title, .rentabilidade-description, .rentabilidade-cta, .chart-card'
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
      .rentabilidade-section .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

