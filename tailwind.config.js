/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#ff9d00",
                red: "#ff0000",
                green: "#008000",
                orange: "#ffa500",
                backdrop: "#0000006b",
                "backdrop-dark": "#3030306b",
                "primary-transparent": "#ff9d003a",
                "primary-transparent-2": "#ff9d001a",
                "pink-2": "#0000006b",
                darkgray: "#141414",
            },
        },
        screens: {
            mobile: { max: "767px" },
        },
    },
    plugins: [],
};
