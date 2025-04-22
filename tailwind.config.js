    export default {
        content: [
            "./index.html",
            "./src/**/*.{vue,js,ts,jsx,tsx}"
        ],
        theme: {
            extend: {
                fontFamily: {
                    mona: ['"Mona Sans"', 'sans-serif'],
                },
            },
        },
        safelist: [
            {
                pattern: /(bg|border|text)-(green|red|purple|yellow)-(50|100|200|500|700)/,
            }
        ],
        plugins: [],
    };