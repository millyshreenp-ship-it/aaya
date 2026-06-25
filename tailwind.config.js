/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink:    '#070708',
        inklt:  '#0f0f11',
        red:    '#D42B2B',
        redlt:  '#e03535',
        gold:   '#C4A35A',
        chalk:  '#F2EFE8',
        muted:  'rgba(242,239,232,0.42)',
        faint:  'rgba(242,239,232,0.12)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
};
