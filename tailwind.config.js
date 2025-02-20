/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                main: ["Roboto", "sans-serif"],
            },
        },
    },
    plugins: [],
};
