# 📊 Integração: Seção Rentabilidade por Estratégia

## 📁 Arquivos Criados

1. **rentabilidade-section.html** - HTML completo com Tailwind CSS inline
2. **rentabilidade.js** - JavaScript vanilla para renderização e interatividade
3. **assets/bar-clip.svg** - Máscara para barras (opcional)
4. **assets/dot-marker.svg** - Ícone de ponto destacado
5. **assets/trendline.svg** - Exemplo de trendline (renderizado via JS)

## 🚀 Como Integrar

### Passo 1: Substituir a Seção Atual

No arquivo `index.html`, localize a seção:

```html
<!-- Gráficos de Rentabilidade -->
<section class="charts-section fade-up">
  ...
</section>
```

Substitua pelo conteúdo de `rentabilidade-section.html`.

### Passo 2: Adicionar o JavaScript

Antes do `</body>`, adicione:

```html
<script src="assets/js/rentabilidade.js"></script>
```

Ou copie o conteúdo de `rentabilidade.js` para `assets/js/rentabilidade.js`.

### Passo 3: Adicionar Fontes (Opcional)

Se quiser usar Playfair Display ou Merriweather, adicione no `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
```

## 🔧 Como Trocar os Dados

### Opção 1: Substituir Arrays no JavaScript

No arquivo `rentabilidade.js`, localize o objeto `datasets` e substitua os arrays:

```javascript
const datasets = {
  'renda-fixa': {
    values: [/* seus dados aqui */],
    highlights: [/* seus highlights */]
  },
  // ...
};
```

### Opção 2: Integração com API

Modifique a função `init()` em `rentabilidade.js`:

```javascript
async function init() {
  try {
    const response = await fetch('/api/projections');
    const apiData = await response.json();
    
    // Mapear dados da API para o formato esperado
    datasets['renda-fixa'] = {
      values: apiData.rendaFixa.values,
      highlights: apiData.rendaFixa.highlights
    };
    // ... outros datasets
    
    // Renderizar gráficos
    renderAllCharts();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    // Usar dados de fallback
    renderAllCharts();
  }
}
```

### Opção 3: Atualização Dinâmica

Use a API pública:

```javascript
// Atualizar dados de uma estratégia
RentabilidadeCharts.updateData('renda-fixa', {
  values: [/* novos valores */],
  highlights: [/* novos highlights */]
});

// Recarregar todos os gráficos
RentabilidadeCharts.refresh();
```

## 🎨 Como Personalizar Cores

No arquivo `rentabilidade-section.html`, localize a seção `:root` e altere:

```css
:root {
  --aurum-amber: #B7791F;      /* Dourado primário */
  --aurum-dark: #072E28;        /* Fundo verde escuro */
  --aurum-green-start: #1F7A3A; /* Base gradiente */
  --aurum-green-end: #34D399;   /* Topo gradiente */
  --aurum-card-dark: rgba(15, 23, 42, 0.6);
  --aurum-card-light: #F5F7FA;
}
```

## ⚡ Como Desativar Animações

### Opção 1: Variável Global

Antes de carregar o script:

```html
<script>
  window.DISABLE_ANIMATIONS = true;
</script>
<script src="assets/js/rentabilidade.js"></script>
```

### Opção 2: Classe CSS

Adicione `no-animation` no container:

```html
<div class="rentabilidade-grid no-animation">
```

## 📱 Comportamento Responsivo

- **Desktop (≥1024px)**: Grid de 3 colunas, card central destacado
- **Tablet (768px-1023px)**: Grid de 2 colunas
- **Mobile (<768px)**: Carousel horizontal com swipe touch

## ♿ Acessibilidade

- ✅ ARIA labels em todos os elementos interativos
- ✅ Contraste AA garantido
- ✅ Suporte a `prefers-reduced-motion`
- ✅ Tooltips com `aria-hidden` apropriado
- ✅ Fallback para imagens estáticas sem JS

## 🔍 Integração com Next.js/React

### Componente React

```jsx
import { useEffect, useRef } from 'react';

export function RentabilidadeSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Carregar script
    const script = document.createElement('script');
    script.src = '/assets/js/rentabilidade.js';
    script.async = true;
    document.body.appendChild(script);

    // Carregar dados da API
    fetch('/api/projections')
      .then(r => r.json())
      .then(data => {
        if (window.RentabilidadeCharts) {
          Object.keys(data).forEach(strategy => {
            window.RentabilidadeCharts.updateData(strategy, data[strategy]);
          });
        }
      });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{
      __html: require('./rentabilidade-section.html')
    }} />
  );
}
```

### Hydration Manual

```javascript
function hydrateGraph(elementId, data) {
  const chart = document.querySelector(`#${elementId}`);
  if (chart && window.RentabilidadeCharts) {
    const strategy = elementId.replace('chart-', '');
    window.RentabilidadeCharts.updateData(strategy, data);
  }
}

// Uso
hydrateGraph('chart-renda-fixa', {
  values: [/* dados */],
  highlights: [/* highlights */]
});
```

## ✅ Checklist de Aceitação (QA)

### Layout e Responsividade
- [ ] Cards renderizam em 3 colunas no desktop (≥1024px)
- [ ] Cards renderizam em 2 colunas no tablet (768px-1023px)
- [ ] Carousel funciona no mobile (<768px) com swipe touch
- [ ] Card central tem destaque visual (borda dourada, fundo claro)
- [ ] Espaçamento e padding consistentes em todos os breakpoints

### Gráficos
- [ ] 20 barras renderizadas corretamente em cada gráfico
- [ ] Alturas das barras são proporcionais aos valores
- [ ] Gradiente verde aplicado nas barras
- [ ] Overlay dourado visível no topo das barras
- [ ] Trendline pontilhada conecta os 3 pontos destacados
- [ ] Labels de valor posicionados corretamente (não colidem com bordas)

### Animações
- [ ] Barras animam de baixo para cima ao carregar (700-900ms)
- [ ] Trendline desenha após as barras
- [ ] Tooltips aparecem ao hover (desktop) e ao tocar (mobile)
- [ ] Tooltips fecham ao sair do hover ou tocar fora
- [ ] Cards elevam suavemente no hover

### Interatividade
- [ ] Tooltip mostra: ano, valor formatado (R$), percentual acumulado
- [ ] Carousel mobile navega com botões prev/next
- [ ] Carousel mobile navega com swipe touch
- [ ] Indicadores (dots) atualizam conforme navegação
- [ ] Scroll snap funciona corretamente no mobile

### Acessibilidade
- [ ] Contraste de texto OK (teste Lighthouse)
- [ ] ARIA labels presentes e corretos
- [ ] Tooltips têm `aria-hidden` apropriado
- [ ] Animações respeitam `prefers-reduced-motion`
- [ ] Navegação por teclado funciona (se aplicável)

### Performance
- [ ] SVG renderiza sem perda de qualidade
- [ ] Sem bibliotecas externas pesadas
- [ ] JavaScript < 500 linhas
- [ ] Lighthouse Performance Score > 90
- [ ] Imagens têm `loading="lazy"`

### Dados
- [ ] Valores exibidos correspondem aos dados fornecidos
- [ ] Formatação de moeda em R$ (pt-BR)
- [ ] Percentuais calculados corretamente
- [ ] Highlights posicionados nos anos corretos

### Fallbacks
- [ ] Gráfico estático exibido quando JS desabilitado
- [ ] Mensagem de erro amigável se dados não carregarem
- [ ] Layout não quebra sem JavaScript

## 🧪 Testes Recomendados

### Lighthouse
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Navegadores
- [ ] Chrome/Edge (últimas 2 versões)
- [ ] Firefox (últimas 2 versões)
- [ ] Safari (últimas 2 versões)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Dispositivos
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667, 414x896)

## 📝 Notas Finais

- Os SVGs são opcionais (bar-clip.svg, dot-marker.svg) - o JS renderiza tudo dinamicamente
- O arquivo trendline.svg é apenas referência - a linha é renderizada via JS
- Para produção, minifique o JavaScript
- Considere usar WebP para thumbnails de fallback
- Teste com dados reais antes de deploy

