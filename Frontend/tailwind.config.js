/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#FF8C00',
                theme: '#FFFFFF',
                background: '#FFFFFF',
                text: '#1A1A1A',
                textSecondary: '#757575',
                border: '#E0E0E0',
                error: '#D32F2F',
                success: '#388E3C',
                info: '#1976D2',
                warning: '#FBC02D',
                inputBackground: '#F5F5F5',
                placeholder: '#9E9E9E',
                overlay: 'rgba(0,0,0,0.5)',
            },
            fontFamily: {
                regular: ['Outfit-Regular'],
                medium: ['Outfit-Medium'],
                semibold: ['Outfit-SemiBold'],
                bold: ['Outfit-Bold'],
            },
        },
    },
    plugins: [],
}
