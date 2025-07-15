# Design Brief: Metallic IPLC Colour Refresh

This document serves as the official design specification for the Metallic IPLC colour refresh project, outlining the color palette, gradient implementations, and UI style recommendations.

## 1. Color Palette

The following color palette has been extracted from the IPLC logos:

| Role | Swatch | Hex | Suggested Token |
|------|--------|-----|-----------------|
| Primary blue | ![#27599F](https://via.placeholder.com/15/27599F/000000?text=+) | `#27599F` | `--color-primary` |
| Deep navy | ![#153F81](https://via.placeholder.com/15/153F81/000000?text=+) | `#153F81` | `--color-primary-dark` |
| Sky blue accent | ![#219FD9](https://via.placeholder.com/15/219FD9/000000?text=+) | `#219FD9` | `--color-accent-sky` |
| Sun-gold accent | ![#F9C04D](https://via.placeholder.com/15/F9C04D/000000?text=+) | `#F9C04D` | `--color-accent-gold` |
| Fresh green | ![#80C97B](https://via.placeholder.com/15/80C97B/000000?text=+) | `#80C97B` | `--color-accent-green` |
| Cool gray 70 | ![#92969C](https://via.placeholder.com/15/92969C/000000?text=+) | `#92969C` | `--color-neutral-700` |
| Cool gray 20 | ![#C9D4D5](https://via.placeholder.com/15/C9D4D5/000000?text=+) | `#C9D4D5` | `--color-neutral-200` |
| Pure white | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) | `#FFFFFF` | `--color-background` |

## 2. Gradient Specifications

### 2.1 Metallic Gradients

Metallic gradients create a sophisticated, premium feel with subtle shine effects:

```css
/* Primary Blue Metallic */
.gradient-metallic-primary {
  background: linear-gradient(135deg, #27599F 0%, #153F81 45%, #219FD9 100%);
  /* Steel blue sheen effect */
}

/* Gold Metallic */
.gradient-metallic-gold {
  background: linear-gradient(90deg, #F9C04D 0%, #FFF5D1 60%, #F9C04D 100%);
  /* Warm anodized gold effect */
}

/* Green Metallic */
.gradient-metallic-green {
  background: radial-gradient(circle at 30% 30%, #80C97B 0%, #A5D6A1 50%, #5FAE59 100%);
  /* Jade metallic finish */
}

/* Navy Metallic */
.gradient-metallic-navy {
  background: linear-gradient(180deg, #153F81 0%, #0A2754 50%, #1E4B8F 100%);
  /* Deep ocean metallic */
}
```

### 2.2 Pastel Gradients

Pastel gradients provide soft, approachable aesthetics:

```css
/* Sky Blue Pastel */
.gradient-pastel-sky {
  background: linear-gradient(135deg, rgba(33, 159, 217, 0.3) 0%, rgba(39, 89, 159, 0.2) 100%);
  /* Soft sky wash */
}

/* Gold Pastel */
.gradient-pastel-gold {
  background: radial-gradient(circle, rgba(249, 192, 77, 0.25) 0%, rgba(255, 245, 209, 0.15) 70%);
  /* Warm sunset glow */
}

/* Green Pastel */
.gradient-pastel-green {
  background: linear-gradient(to bottom right, rgba(128, 201, 123, 0.3) 0%, rgba(201, 212, 213, 0.2) 70%);
  /* Spring meadow overlay */
}

/* Neutral Pastel */
.gradient-pastel-neutral {
  background: linear-gradient(120deg, rgba(201, 212, 213, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
  /* Soft mist effect */
}
```

### 2.3 Implementation Tips

- Keep gradient overlays at 6-8% opacity for background use to maintain WCAG AA contrast
- Use metallic gradients for CTAs and interactive elements
- Apply pastel gradients as subtle background treatments
- Test all gradients against contrast requirements

## 3. UI Style Comparison: Neumorphism vs. Elevated Material Design

### 3.1 Neumorphism

**Definition**: A design style that blends minimalism with skeuomorphism, creating soft, extruded effects that appear to emerge from the background.

**Key Characteristics:**
- **Shadows**: Dual shadows (one light, one dark) create depth
- **Background**: Elements share the same color as their background
- **Edges**: Predominantly rounded corners
- **Effect**: Soft, "pressed" appearance

**CSS Implementation Example:**
```css
.neumorphic-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    20px 20px 60px #d9d9d9,
    -20px -20px 60px #ffffff;
}

.neumorphic-button {
  background: linear-gradient(145deg, #f0f0f0, #cacaca);
  box-shadow: 
    5px 5px 10px #b3b3b3,
    -5px -5px 10px #ffffff;
}

.neumorphic-pressed {
  box-shadow: 
    inset 5px 5px 10px #b3b3b3,
    inset -5px -5px 10px #ffffff;
}
```

### 3.2 Elevated Material Design

**Definition**: Google's design system emphasizing layered surfaces with consistent elevation levels and shadows.

**Key Characteristics:**
- **Shadows**: Single directional shadow indicating elevation
- **Background**: Elements can have distinct colors
- **Edges**: Can be rounded or sharp
- **Effect**: Clear depth hierarchy

**CSS Implementation Example:**
```css
/* Material Design Elevation Levels */
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.elevation-2 {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.elevation-3 {
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

.elevation-4 {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
```

### 3.3 Comparison Table

| Aspect | Neumorphism | Elevated Material Design |
|--------|-------------|-------------------------|
| **Visual Impact** | Soft, subtle | Clear, defined |
| **Accessibility** | Lower contrast, potential issues | Better contrast, clearer hierarchy |
| **Use Cases** | Minimalist interfaces, luxury brands | General purpose, scalable systems |
| **Implementation** | More complex shadows | Simpler, standardized |
| **Color Flexibility** | Limited (monochromatic) | Full color range |
| **User Recognition** | May be unclear | Immediately recognizable |
| **Performance** | Multiple shadows = more rendering | Single shadow = optimized |

### 3.4 Recommendations for IPLC

For the IPLC forms application with a white background, we recommend a **hybrid approach**:

1. **Primary Strategy**: Use Material Design elevation for main components
2. **Accent Strategy**: Apply subtle neumorphic effects for special interactions
3. **Metallic Integration**: Combine metallic gradients with Material shadows

**Recommended Implementation:**
```css
/* IPLC Hybrid Card Style */
.iplc-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(21, 63, 129, 0.1), 0 1px 3px rgba(21, 63, 129, 0.08);
  border: 1px solid rgba(201, 212, 213, 0.3);
  overflow: hidden;
}

.iplc-card-metallic {
  position: relative;
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%);
}

.iplc-card-metallic::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #27599F 0%, #219FD9 50%, #27599F 100%);
}

/* Interactive Elements */
.iplc-button {
  background: linear-gradient(135deg, #27599F 0%, #153F81 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  box-shadow: 0 2px 4px rgba(21, 63, 129, 0.2);
  transition: all 0.3s ease;
}

.iplc-button:hover {
  box-shadow: 0 4px 8px rgba(21, 63, 129, 0.3);
  transform: translateY(-1px);
}

.iplc-button:active {
  box-shadow: inset 0 2px 4px rgba(21, 63, 129, 0.3);
  transform: translateY(0);
}
```

## 4. Implementation Guidelines

### 4.1 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#27599F',
        'primary-dark': '#153F81',
        sky: '#219FD9',
        gold: '#F9C04D',
        green: '#80C97B',
        gray: {
          700: '#92969C',
          200: '#C9D4D5',
        }
      },
      boxShadow: {
        'iplc-sm': '0 1px 3px rgba(21, 63, 129, 0.12), 0 1px 2px rgba(21, 63, 129, 0.24)',
        'iplc-md': '0 4px 6px rgba(21, 63, 129, 0.1), 0 1px 3px rgba(21, 63, 129, 0.08)',
        'iplc-lg': '0 10px 15px rgba(21, 63, 129, 0.15), 0 4px 6px rgba(21, 63, 129, 0.1)',
        'iplc-xl': '0 20px 25px rgba(21, 63, 129, 0.15), 0 10px 10px rgba(21, 63, 129, 0.04)',
      }
    }
  }
}
```

### 4.2 Accessibility Checklist

- [ ] Ensure all text maintains WCAG AA contrast ratios (4.5:1 for body, 3:1 for large text)
- [ ] Add focus indicators with sufficient contrast
- [ ] Test gradient overlays at various opacity levels
- [ ] Provide clear visual feedback for interactive states
- [ ] Run automated accessibility audits (axe-core, Lighthouse)

### 4.3 Performance Considerations

1. Use CSS transforms for hover effects (GPU accelerated)
2. Limit gradient complexity on frequently rendered elements
3. Consider `will-change` property for animated elements
4. Optimize shadow rendering with fewer blur values where possible

## 5. References and Sources

1. **CSS-Tricks - "Neumorphism and CSS"** (2020)
   - Source: https://css-tricks.com/neumorphism-and-css/
   - Comprehensive technical guide on implementing neumorphic effects with CSS

2. **UX Collective - "Neumorphism in user interfaces"** by Michal Malewicz (2019)
   - Source: https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6
   - Original article that coined the term and defined the trend

3. **Design Shack - "Design Trend: Neumorphism"** by Carrie Cousins (2020)
   - Source: https://designshack.net/articles/trends/neumorphism/
   - Analysis of the trend with practical examples and challenges

4. **Material Design 3 - Elevation Guidelines**
   - Source: https://m3.material.io/styles/elevation/overview
   - Official Material Design documentation on elevation and shadow systems

5. **Interaction Design Foundation - Material Design Principles**
   - Source: https://www.interaction-design.org/literature/article/material-design
   - Academic perspective on Material Design implementation

## 6. Next Steps

1. Create component library with hybrid styles
2. Develop interactive prototypes for user testing
3. Conduct accessibility audit on proposed designs
4. Implement A/B testing for neumorphic vs. material variants
5. Document component usage guidelines for development team

---

*Document Version: 1.0*  
*Last Updated: January 15, 2025*  
*Author: IPLC Design Team*