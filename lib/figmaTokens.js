export function generateFigmaTokens(palette) {
    return JSON.stringify({
      "color": {
        "primary": {
          "value": palette.primary,
          "type": "color"
        },
        "primary-light": {
          "value": palette.primaryLight,
          "type": "color"
        },
        "primary-dark": {
          "value": palette.primaryDark,
          "type": "color"
        }
      }
    }, null, 2);
  }