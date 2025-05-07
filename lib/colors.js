function hexToHsl(hex) {

    hex = hex.replace('#', '');
  
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  
    // Convert to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  
  function hslToHex(hsl) {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  export function getContrastColor(hexColor) {
    if (!hexColor || hexColor.length < 7) return '#000000';
    
    try {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#ffffff';
    } catch {
      return '#000000';
    }
  }
  
  export function getContrastRatio(color1, color2) {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / 
                 (Math.min(luminance1, luminance2) + 0.05);
    return ratio.toFixed(1);
  }
  
  function getLuminance(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  
  export function generatePalette(baseColor) {
    const hsl = hexToHsl(baseColor);
    
    return {
      primary: baseColor,
      primaryLight: hslToHex({ ...hsl, l: Math.min(hsl.l + 20, 95) }),
      primaryDark: hslToHex({ ...hsl, l: Math.max(hsl.l - 20, 5) }),
      secondary: hslToHex({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }),
      accent: hslToHex({ h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l }),
      neutral: hslToHex({ h: hsl.h, s: Math.max(hsl.s - 70, 5), l: hsl.l }),
      neutralLight: hslToHex({ h: hsl.h, s: Math.max(hsl.s - 70, 5), l: Math.min(hsl.l + 30, 95) }),
      neutralDark: hslToHex({ h: hsl.h, s: Math.max(hsl.s - 70, 5), l: Math.max(hsl.l - 30, 5) })
    };
  }
  
  export function generateRandomTheme() {
    const baseHue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 35);
    const lightness = 40 + Math.floor(Math.random() * 30);
    
    const baseColor = hslToHex({
      h: baseHue,
      s: saturation,
      l: lightness
    });
    
    return generatePalette(baseColor);
  }
  
  export function generateThemeFromPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return generateRandomTheme();
    }
  
    const promptLower = prompt.toLowerCase();
    let baseHue;
    
    // Convert prompt
    const seed = Array.from(promptLower).reduce(
      (hash, char) => (hash << 5) - hash + char.charCodeAt(0),
      0
    );
    
    // Random number generator
    const random = (min, max) => {
      const x = Math.sin(seed) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };
  
    if (promptLower.includes('warm') || promptLower.includes('sunset') || promptLower.includes('fire')) {
      baseHue = 20 + random(0, 40);
    } else if (promptLower.includes('cool') || promptLower.includes('ocean') || promptLower.includes('water')) {
      baseHue = 180 + random(0, 60);
    } else if (promptLower.includes('earth') || promptLower.includes('nature') || promptLower.includes('green')) {
      baseHue = 90 + random(0, 40);
    } else if (promptLower.includes('vibrant') || promptLower.includes('rainbow') || promptLower.includes('colorful')) {
      baseHue = random(0, 360);
    } else {
      baseHue = random(0, 360);
    }
    
    const saturation = 70 + random(0, 25);
    const lightness = 45 + random(0, 20);
    
    const baseColor = hslToHex({
      h: baseHue,
      s: saturation,
      l: lightness
    });
    
    return generatePalette(baseColor);
  }
  
  export function generateTailwindConfig(palette) {
    return `/** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '${palette.primary}',
            light: '${palette.primaryLight}',
            dark: '${palette.primaryDark}',
          },
          secondary: '${palette.secondary}',
          accent: '${palette.accent}',
          neutral: {
            DEFAULT: '${palette.neutral}',
            light: '${palette.neutralLight}',
            dark: '${palette.neutralDark}',
          }
        }
      }
    },
    plugins: [],
  }`;
  }