'use client';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ClipboardDocumentIcon, ArrowDownTrayIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { generatePalette, generateTailwindConfig, getContrastColor, getContrastRatio } from '@/lib/colors';

export default function DesignTokenGenerator() {
  const [color, setColor] = useState('#3b82f6');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [shareUrl, setShareUrl] = useState('');
  
  const palette = generatePalette(color);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}?color=${color.replace('#', '')}`);
    }
  }, [color]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadFile = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateCSSVariables = () => {
    return `:root {
  --primary: ${palette.primary};
  --primary-light: ${palette.primaryLight};
  --primary-dark: ${palette.primaryDark};
  --secondary: ${palette.secondary};
  --accent: ${palette.accent};
  --neutral: ${palette.neutral};
  --neutral-light: ${palette.neutralLight};
  --neutral-dark: ${palette.neutralDark};
}`;
  };

  const generateFigmaTokens = () => {
    return JSON.stringify({
      "color": {
        "primary": { "value": palette.primary, "type": "color" },
        "primary-light": { "value": palette.primaryLight, "type": "color" },
        "primary-dark": { "value": palette.primaryDark, "type": "color" },
        "secondary": { "value": palette.secondary, "type": "color" },
        "accent": { "value": palette.accent, "type": "color" },
        "neutral": { "value": palette.neutral, "type": "color" },
        "neutral-light": { "value": palette.neutralLight, "type": "color" },
        "neutral-dark": { "value": palette.neutralDark, "type": "color" }
      }
    }, null, 2);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Gradient Header */}
      <header className={`bg-gradient-to-r from-blue-500 to-purple-600 py-6 shadow-lg ${isDarkMode ? 'shadow-gray-800' : 'shadow-gray-200'}`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white text-center">Design Token Generator</h1>
          <p className="text-blue-100 text-center mt-2">Create beautiful design systems from a single color</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Picker Section */}
          <div className={`rounded-xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Color Selection
              </h2>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>

            <HexColorPicker 
              color={color} 
              onChange={setColor}
              className="w-full h-64 rounded-lg mb-4"
            />

            <div className="flex items-center gap-4">
            <div className="flex-1">
                <label htmlFor="color-input" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Hex Color
                </label>
                <input
                id="color-input"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
                />
            </div>
            <div 
                className="w-12 h-12 rounded-lg border mt-6"
                style={{ backgroundColor: color }}
            />
            </div>

            {/* Color Palette Grid */}
            <div className="mt-8">
              <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Generated Palette
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(palette).map(([name, value]) => (
                  <div key={name} className="flex flex-col items-center">
                    <div
                      className="w-full h-16 rounded-lg border-2 shadow-sm"
                      style={{ 
                        backgroundColor: value,
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                      }}
                    />
                    <span className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Output Section */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className={`rounded-xl p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex space-x-1">
                {['preview', 'CSS', 'tailwind', 'figma', 'share'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg flex-1 transition-colors ${
                      activeTab === tab
                        ? isDarkMode
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900 shadow'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className={`rounded-xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {activeTab === 'preview' && (
                <div className="space-y-6">
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    UI Components Preview
                    </h3>
                    
                    {/* Buttons Section */}
                    <div className="flex flex-wrap gap-4">
                    {/* Primary Button */}
                    <div className="relative">
                        <button
                        className="px-6 py-3 rounded-lg font-medium shadow-md transition-transform hover:scale-105"
                        style={{ 
                            backgroundColor: palette.primary, 
                            color: getContrastColor(palette.primary) 
                        }}
                        >
                        Primary Button
                        </button>
                        <div className="absolute -bottom-5 left-0 text-xs">
                        <span 
                            className="px-2 py-1 rounded-full font-medium shadow"
                            style={{
                            backgroundColor: palette.primaryDark,
                            color: getContrastColor(palette.primaryDark)
                            }}
                        >
                            {getContrastRatio(palette.primary, getContrastColor(palette.primary))}:1
                        </span>
                        </div>
                    </div>

                    {/* Secondary Button - Now with contrast badge */}
                    <div className="relative">
                        <button
                        className="px-6 py-3 rounded-lg font-medium border shadow-sm transition-transform hover:scale-105"
                        style={{ 
                            backgroundColor: isDarkMode ? palette.neutralDark : palette.neutralLight,
                            borderColor: palette.neutral,
                            color: getContrastColor(isDarkMode ? palette.neutralDark : palette.neutralLight)
                        }}
                        >
                        Secondary Button
                        </button>
                        <div className="absolute -bottom-5 left-0 text-xs">
                        <span 
                            className="px-2 py-1 rounded-full font-medium shadow"
                            style={{
                            backgroundColor: palette.neutral,
                            color: getContrastColor(palette.neutral)
                            }}
                        >
                            {getContrastRatio(
                            isDarkMode ? palette.neutralDark : palette.neutralLight,
                            getContrastColor(isDarkMode ? palette.neutralDark : palette.neutralLight)
                            )}:1
                        </span>
                        </div>
                    </div>
                    </div>

                    {/* Card Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Card */}
                    <div className="relative">
                        <div
                        className="p-6 rounded-xl shadow-md transition-transform hover:scale-[1.01] h-full"
                        style={{ 
                            backgroundColor: isDarkMode ? palette.primaryDark : palette.primaryLight,
                            border: `1px solid ${palette.primary}`
                        }}
                        >
                        <h3 style={{ color: palette.primary }} className="text-xl font-bold mb-3">Primary Card</h3>
                        <p style={{ color: getContrastColor(isDarkMode ? palette.primaryDark : palette.primaryLight) }} className="text-sm">
                            This card uses the primary color palette variants.
                        </p>
                        </div>
                    </div>

                    {/* Secondary Card */}
                    <div className="relative">
                        <div
                        className="p-6 rounded-xl shadow-md transition-transform hover:scale-[1.01] h-full"
                        style={{ 
                            backgroundColor: isDarkMode ? palette.neutralDark : palette.neutralLight,
                            border: `1px solid ${palette.neutral}`
                        }}
                        >
                        <h3 style={{ color: palette.secondary }} className="text-xl font-bold mb-3">Secondary Card</h3>
                        <p style={{ color: getContrastColor(isDarkMode ? palette.neutralDark : palette.neutralLight) }} className="text-sm">
                            This card uses the neutral color palette variants.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                )}

              {activeTab === 'CSS' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>CSS Variables</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadFile(generateCSSVariables(), 'design-tokens.css')}
                        className={`p-2 rounded-lg flex items-center gap-1 ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="Download CSS"
                      >
                        <ArrowDownTrayIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(generateCSSVariables(), 'css')}
                        className={`p-2 rounded-lg flex items-center gap-1 ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="Copy CSS"
                      >
                        <ClipboardDocumentIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />
                      </button>
                    </div>
                  </div>
                  <pre className={`p-4 rounded-lg text-sm overflow-x-auto font-mono ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
                    {generateCSSVariables()}
                  </pre>
                  {copied === 'css' && (
                    <div className={`text-xs mt-2 text-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Copied to clipboard!
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tailwind' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tailwind Config</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadFile(generateTailwindConfig(palette), 'tailwind.config.js')}
                        className={`p-2 rounded-lg flex items-center gap-1 ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="Download Tailwind Config"
                      >
                        <ArrowDownTrayIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(generateTailwindConfig(palette), 'tailwind')}
                        className={`p-2 rounded-lg flex items-center gap-1 ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="Copy Tailwind Config"
                      >
                        <ClipboardDocumentIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />
                      </button>
                    </div>
                  </div>
                  <pre className={`p-4 rounded-lg text-sm overflow-x-auto font-mono ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
                    {generateTailwindConfig(palette)}
                  </pre>
                  {copied === 'tailwind' && (
                    <div className={`text-xs mt-2 text-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Copied to clipboard!
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'figma' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Figma Tokens</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadFile(generateFigmaTokens(), 'figma-tokens.json')}
                        className={`p-2 rounded-lg flex items-center gap-1 ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="Download Figma Tokens"
                      >
                        <ArrowDownTrayIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(generateFigmaTokens(), 'figma')}
                        className={`p-2 rounded-lg flex items-center gap-1 ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="Copy Figma Tokens"
                      >
                        <ClipboardDocumentIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />
                      </button>
                    </div>
                  </div>
                  <pre className={`p-4 rounded-lg text-sm overflow-x-auto font-mono ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
                    {generateFigmaTokens()}
                  </pre>
                  {copied === 'figma' && (
                    <div className={`text-xs mt-2 text-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Copied to clipboard!
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'share' && (
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Share Your Palette
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Copy this link to share your color palette with others:
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className={`flex-1 p-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-black'
                      }`}
                    />
                    <button
                      onClick={() => copyToClipboard(shareUrl, 'link')}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        isDarkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <ClipboardDocumentIcon className="h-5 w-5" />
                      Copy
                    </button>
                  </div>
                  
                  {copied === 'link' && (
                    <div className={`text-sm text-center p-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Link copied to clipboard!
                    </div>
                  )}
                  
                  <div className={`mt-4 p-3 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <p className="text-sm">
                      When someone opens your shared link, they'll see this exact color palette.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 text-center ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <p>Design Token Generator • Built with Next.js and Tailwind CSS</p>
      </footer>
    </div>
  );
}