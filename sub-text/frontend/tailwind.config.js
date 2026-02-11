/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                paper: "#FFFFFF",
                ink: "#000000",
                gray: {
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    900: "#111827",
                }
            },
            fontFamily: {
                sans: ['Space Grotesk', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'brutal': '4px 4px 0px 0px #000000',
                'brutal-lg': '8px 8px 0px 0px #000000',
                'brutal-sm': '2px 2px 0px 0px #000000',
            },
            borderWidth: {
                '3': '3px',
            },
            animation: {
                "marquee": "marquee 25s linear infinite",
                "shimmer": "shimmer 2.5s infinite linear",
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
                shimmer: {
                    "0%": { transform: "translateX(-150%)" },
                    "100%": { transform: "translateX(150%)" },
                },
            },
        },
    },
    plugins: [],
}
