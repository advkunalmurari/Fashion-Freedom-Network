module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                ffn: {
                    black: '#0A0A0A',
                    white: '#FFFFFF',
                    primary: '#6366F1',
                    secondary: '#F59E0B',
                    bg: '#FAFAFA',
                    gray: {
                        50: '#F8FAFC',
                        100: '#F1F5F9',
                        200: '#E2E8F0',
                        800: '#1E293B',
                        900: '#0F172A'
                    },
                    accent: '#F43F5E',
                    ig: {
                        purple: '#833ab4',
                        red: '#fd1d1d',
                        orange: '#fcb045',
                        pink: '#e1306c',
                        blue: '#405de6'
                    },
                    pride: {
                        red: '#E40303',
                        orange: '#FF8C00',
                        yellow: '#FFED00',
                        green: '#008026',
                        blue: '#24408E',
                        violet: '#732982'
                    }
                }
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
                'gradient-y': 'gradient-y 15s ease infinite',
                'gradient-xy': 'gradient-xy 15s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'rainbow': 'rainbow 5s linear infinite',
                'shimmer': 'shimmer 1.5s infinite linear',
            },
            keyframes: {
                'gradient-y': {
                    '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'center top' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'center bottom' },
                },
                'gradient-x': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                'gradient-xy': {
                    '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'rainbow': {
                    '0%': { color: '#E40303' },
                    '17%': { color: '#FF8C00' },
                    '33%': { color: '#FFED00' },
                    '50%': { color: '#008026' },
                    '67%': { color: '#24408E' },
                    '83%': { color: '#732982' },
                    '100%': { color: '#E40303' },
                },
                'shimmer': {
                    '0%': { 'background-position': '200% 0' },
                    '100%': { 'background-position': '-200% 0' }
                }
            }
        }
    },
    plugins: [],
}
