/**
 * ============================================
 * RENTABILIDADE POR ESTRATÉGIA - JavaScript
 * ============================================
 * 
 * Componente vanilla JS para renderizar gráficos
 * de rentabilidade com animações e interatividade.
 * 
 * COMO TROCAR OS DADOS:
 * - Substitua os arrays 'data' abaixo pelos dados da API
 * - Exemplo: fetch('/api/projections').then(r => r.json())
 * 
 * COMO DESATIVAR ANIMAÇÕES:
 * - Adicione class 'no-animation' no container
 * - Ou defina window.DISABLE_ANIMATIONS = true
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURAÇÃO E DADOS
  // ============================================
  
  const DISABLE_ANIMATIONS = window.DISABLE_ANIMATIONS || false;
  
  // DATASET DE EXEMPLO (substituir por dados da API)
  const datasets = {
    'renda-fixa': {
      label: 'Renda Fixa — 1% a.m',
      values: [270110, 300000, 350000, 400000, 516200, 580000, 640000, 780000, 830000, 900000, 940000, 980000, 1010000, 1100000, 1200000, 1300000, 1450000, 1600000, 1800000, 1944000],
      highlights: [
        { year: 0, value: 270110, label: 'R$ 270.110' },
        { year: 9, value: 900000, label: 'R$ 900.000' },
        { year: 19, value: 1944000, label: 'R$ 1.944.000' }
      ]
    },
    'alavancagem': {
      label: 'Alavancagem — 3% a.m',
      values: [270110, 400000, 600000, 850000, 1200000, 1500000, 1700000, 1971900, 2200000, 2600000, 3000000, 3400000, 3700000, 4200000, 4600000, 4900000, 5205000, 5400000, 5600000, 5800000],
      highlights: [
        { year: 0, value: 270110, label: 'R$ 270.110' },
        { year: 9, value: 2600000, label: 'R$ 2.600.000' },
        { year: 19, value: 5800000, label: 'R$ 5.800.000' }
      ]
    },
    'acoes': {
      label: 'Ações — 1.5% a.m',
      values: [233210, 350000, 550000, 800000, 950000, 1100000, 1268270, 1500000, 1700000, 1900000, 2100000, 2350000, 2600000, 2800000, 3000000, 3120000, 3300000, 3450000, 3600000, 3720000],
      highlights: [
        { year: 0, value: 233210, label: 'R$ 233.210' },
        { year: 6, value: 1268270, label: 'R$ 1.268.270' },
        { year: 19, value: 3720000, label: 'R$ 3.720.000' }
      ]
    }
  };

  // Tokens CSS
  const tokens = {
    amber: '#B7791F',
    greenStart: '#1F7A3A',
    greenEnd: '#34D399',
    dark: '#072E28',
    textLight: 'rgba(255, 255, 255, 0.9)',
    textMuted: 'rgba(255, 255, 255, 0.6)'
  };

  // ============================================
  // UTILITÁRIOS
  // ============================================
  
  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  function createSVGElement(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  }

  // ============================================
  // RENDERIZAÇÃO DO GRÁFICO
  // ============================================
  
  function renderChart(svg, data, strategy) {
    const width = 400;
    const height = 280;
    const padding = { top: 20, right: 20, bottom: 40, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const values = data.values;
    const maxValue = Math.max(...values);
    const barCount = values.length;
    const barWidth = (chartWidth / barCount) - 4;
    const spacing = 4;
    
    // Limpar SVG
    svg.innerHTML = '';
    
    // Definir viewBox
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Grupo principal
    const g = createSVGElement('g', {
      transform: `translate(${padding.left}, ${padding.top})`
    });
    
    // Definir gradiente
    const defs = createSVGElement('defs', {});
    const gradient = createSVGElement('linearGradient', {
      id: `gradient-${strategy}`,
      x1: '0%',
      y1: '100%',
      x2: '0%',
      y2: '0%'
    });
    
    const stop1 = createSVGElement('stop', {
      offset: '0%',
      'stop-color': tokens.greenStart
    });
    const stop2 = createSVGElement('stop', {
      offset: '100%',
      'stop-color': tokens.greenEnd
    });
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Renderizar barras
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = index * (barWidth + spacing);
      const y = chartHeight - barHeight;
      
      const rect = createSVGElement('rect', {
        x: x,
        y: y,
        width: barWidth,
        height: barHeight,
        fill: `url(#gradient-${strategy})`,
        rx: '8',
        'data-year': index,
        'data-value': value,
        class: 'chart-bar',
        style: DISABLE_ANIMATIONS ? '' : 'opacity: 0; transform: scaleY(0); transform-origin: bottom;'
      });
      
      // Adicionar overlay dourado no topo
      const overlay = createSVGElement('rect', {
        x: x,
        y: y,
        width: barWidth,
        height: Math.min(barHeight * 0.15, 8),
        fill: tokens.amber,
        opacity: '0.6',
        rx: '8'
      });
      
      g.appendChild(rect);
      g.appendChild(overlay);
      
      // Animar barra
      if (!DISABLE_ANIMATIONS) {
        setTimeout(() => {
          rect.style.transition = 'opacity 0.3s ease, transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1)';
          rect.style.opacity = '1';
          rect.style.transform = 'scaleY(1)';
        }, index * 30);
      } else {
        rect.style.opacity = '1';
        rect.style.transform = 'scaleY(1)';
      }
    });
    
    // Renderizar trendline e highlights
    if (data.highlights && data.highlights.length > 0) {
      renderTrendline(g, data.highlights, values, chartWidth, chartHeight, maxValue);
      renderHighlights(g, data.highlights, values, chartWidth, chartHeight, maxValue, barWidth, spacing);
    }
    
    svg.appendChild(g);
    
    // Adicionar interatividade
    addChartInteractivity(svg, values, chartWidth, chartHeight, maxValue, padding);
  }

  // ============================================
  // TRENDLINE (LINHA PONTILHADA)
  // ============================================
  
  function renderTrendline(g, highlights, values, chartWidth, chartHeight, maxValue) {
    if (highlights.length < 2) return;
    
    const pathData = highlights.map((h, i) => {
      const x = (h.year / (values.length - 1)) * chartWidth;
      const y = chartHeight - (h.value / maxValue) * chartHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    const path = createSVGElement('path', {
      d: pathData,
      stroke: tokens.amber,
      'stroke-width': '2',
      'stroke-dasharray': '4 4',
      fill: 'none',
      opacity: '0.6',
      class: 'trendline',
      style: DISABLE_ANIMATIONS ? '' : 'stroke-dashoffset: 1000;'
    });
    
    g.appendChild(path);
    
    // Animar trendline
    if (!DISABLE_ANIMATIONS) {
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 1s ease-out';
        path.style.strokeDashoffset = '0';
      }, 800);
    } else {
      path.style.strokeDashoffset = '0';
    }
  }

  // ============================================
  // HIGHLIGHTS (PONTOS E LABELS)
  // ============================================
  
  function renderHighlights(g, highlights, values, chartWidth, chartHeight, maxValue, barWidth, spacing) {
    highlights.forEach((h) => {
      const x = (h.year / (values.length - 1)) * chartWidth;
      const y = chartHeight - (h.value / maxValue) * chartHeight;
      
      // Ponto dourado
      const circle = createSVGElement('circle', {
        cx: x,
        cy: y,
        r: '6',
        fill: tokens.amber,
        stroke: '#fff',
        'stroke-width': '2',
        class: 'highlight-point'
      });
      
      // Label
      const labelGroup = createSVGElement('g', {
        transform: `translate(${x}, ${y - 25})`
      });
      
      const labelBg = createSVGElement('rect', {
        x: '-40',
        y: '-12',
        width: '80',
        height: '24',
        rx: '6',
        fill: 'rgba(7, 46, 40, 0.9)',
        stroke: tokens.amber,
        'stroke-width': '1'
      });
      
      const labelText = createSVGElement('text', {
        x: '0',
        y: '4',
        'text-anchor': 'middle',
        fill: tokens.amber,
        'font-size': '11',
        'font-weight': '600',
        'font-family': 'Inter, system-ui, sans-serif'
      });
      labelText.textContent = h.label;
      
      labelGroup.appendChild(labelBg);
      labelGroup.appendChild(labelText);
      
      g.appendChild(circle);
      g.appendChild(labelGroup);
    });
  }

  // ============================================
  // INTERATIVIDADE (TOOLTIPS)
  // ============================================
  
  function addChartInteractivity(svg, values, chartWidth, chartHeight, maxValue, padding) {
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltip);
    
    const bars = svg.querySelectorAll('.chart-bar');
    
    bars.forEach((bar, index) => {
      const year = parseInt(bar.getAttribute('data-year'));
      const value = parseFloat(bar.getAttribute('data-value'));
      const percent = ((value / values[0] - 1) * 100).toFixed(1);
      
      function showTooltip(e) {
        const rect = svg.getBoundingClientRect();
        const barRect = bar.getBoundingClientRect();
        
        tooltip.innerHTML = `
          <div class="chart-tooltip-year">${year === 0 ? 'Aplicação' : year + ' anos'}</div>
          <div class="chart-tooltip-value">${formatCurrency(value)}</div>
          <div class="chart-tooltip-percent">+${percent}% acumulado</div>
        `;
        
        tooltip.style.left = barRect.left + (barRect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = barRect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.classList.add('visible');
        tooltip.setAttribute('aria-hidden', 'false');
      }
      
      function hideTooltip() {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }
      
      bar.addEventListener('mouseenter', showTooltip);
      bar.addEventListener('mouseleave', hideTooltip);
      bar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showTooltip(e);
      });
      
      // Fechar tooltip ao tocar fora (mobile)
      document.addEventListener('touchstart', (e) => {
        if (!bar.contains(e.target) && !tooltip.contains(e.target)) {
          hideTooltip();
        }
      });
    });
  }

  // ============================================
  // CAROUSEL (Mobile)
  // ============================================
  
  function initCarousel() {
    const container = document.getElementById('rentabilidade-container');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelector('.carousel-indicators');
    
    if (!container || !prevBtn || !nextBtn || !indicators) return;
    if (window.innerWidth >= 768) return;
    
    // Prevenir múltiplas inicializações
    if (container.dataset.carouselInitialized === 'true') return;
    container.dataset.carouselInitialized = 'true';
    
    const cards = container.querySelectorAll('.chart-card');
    let currentIndex = 0;
    
    // Limpar indicadores existentes antes de criar novos
    indicators.innerHTML = '';
    
    // Criar indicators
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
      dot.addEventListener('click', () => scrollToCard(index));
      indicators.appendChild(dot);
    });
    
    function updateIndicators() {
      indicators.querySelectorAll('.carousel-indicator').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    function scrollToCard(index) {
      currentIndex = Math.max(0, Math.min(index, cards.length - 1));
      const card = cards[currentIndex];
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      updateIndicators();
    }
    
    prevBtn.addEventListener('click', () => {
      scrollToCard(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
      scrollToCard(currentIndex + 1);
    });
    
    // Swipe touch - versão melhorada que não bloqueia scroll da página
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      // Calcular direção do movimento
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      
      // Apenas prevenir scroll se o movimento for predominantemente horizontal
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    
    container.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          scrollToCard(currentIndex + 1);
        } else {
          scrollToCard(currentIndex - 1);
        }
      }
    }, { passive: true });
    
    // Scroll snap detection
    container.addEventListener('scroll', () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 24; // gap included
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateIndicators();
      }
    });
  }

  // ============================================
  // INICIALIZAÇÃO
  // ============================================
  
  function init() {
    const charts = document.querySelectorAll('.bar-chart');
    
    charts.forEach(chart => {
      const card = chart.closest('.chart-card');
      const strategy = card.getAttribute('data-strategy');
      const data = datasets[strategy];
      
      if (data) {
        renderChart(chart, data, strategy);
      }
    });
    
    // Inicializar carousel se mobile
    if (window.innerWidth < 768) {
      initCarousel();
    }
    
    // Re-inicializar carousel no resize
    let resizeTimer;
    let lastWidth = window.innerWidth;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        
        // Só reinicializar se mudar de desktop para mobile ou vice-versa
        if ((lastWidth >= 768 && currentWidth < 768) || (lastWidth < 768 && currentWidth >= 768)) {
          const container = document.getElementById('rentabilidade-container');
          if (container) {
            container.dataset.carouselInitialized = 'false';
          }
          
          if (currentWidth < 768) {
            initCarousel();
          }
        }
        
        lastWidth = currentWidth;
      }, 250);
    });
  }

  // Aguardar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // API PÚBLICA (para integração)
  // ============================================
  
  window.RentabilidadeCharts = {
    updateData: function(strategy, newData) {
      const chart = document.querySelector(`#chart-${strategy}`);
      if (chart && newData) {
        datasets[strategy] = newData;
        renderChart(chart, newData, strategy);
      }
    },
    
    refresh: function() {
      init();
    }
  };
})();

