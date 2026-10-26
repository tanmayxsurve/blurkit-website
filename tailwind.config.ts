import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-primary)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        // BlurKit Brand Colors
        primary: {
          DEFAULT: '#a3f73c',
          50: '#f5fde8',
          100: '#e8fcc0',
          200: '#d9f885',
          300: '#c4f34d',
          400: '#a3f73c',
          500: '#8ce82f',
          600: '#6bc922',
          700: '#54a01e',
          800: '#417720',
          900: '#34601f',
        },
        dark: {
          DEFAULT: '#111111',
          50: '#1a1a1a',
          100: '#262626',
          200: '#333333',
          300: '#404040',
          400: '#4d4d4d',
          500: '#595959',
          600: '#666666',
          700: '#737373',
          800: '#808080',
          900: '#8d8d8d',
        },
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
    },
  },
  plugins: [],
}
export default config
