/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                // Brand colors (Pink & Luminous Green palette)
                brand: {
                    pink: {
                        50: '#FDF2F8',
                        100: '#FCE7F3',
                        200: '#FBCFE8',
                        300: '#F9A8D4',
                        400: '#F472B6',
                        500: '#EC4899',
                        600: '#DB2777',
                        700: '#BE185D',
                        800: '#9D174D',
                        900: '#831843',
                    },
                    green: {
                        50: '#F0FDF4',
                        100: '#DCFCE7',
                        200: '#BBF7D0',
                        300: '#86EFAC',
                        400: '#4ADE80',
                        500: '#39FF14',
                        600: '#16A34A',
                        700: '#15803D',
                        800: '#166534',
                        900: '#14532D',
                    },
                    orange: {
                        50: '#FDF2F8',
                        100: '#FCE7F3',
                        200: '#FBCFE8',
                        300: '#F9A8D4',
                        400: '#F472B6',
                        500: '#EC4899',
                        600: '#DB2777',
                        700: '#BE185D',
                        800: '#9D174D',
                        900: '#831843',
                    },
                    yellow: {
                        50: '#F0FDF4',
                        100: '#DCFCE7',
                        200: '#BBF7D0',
                        300: '#86EFAC',
                        400: '#4ADE80',
                        500: '#39FF14',
                        600: '#16A34A',
                        700: '#15803D',
                        800: '#166534',
                        900: '#14532D',
                    },
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                float: "float 3s ease-in-out infinite",
                shimmer: "shimmer 2s linear infinite",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
