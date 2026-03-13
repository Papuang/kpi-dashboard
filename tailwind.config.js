/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'h2, h3, h4': {
              marginTop: theme('spacing.8'), // 2rem
              marginBottom: theme('spacing.4'), // 1rem
            },
            p: {
              marginTop: '0',
              marginBottom: theme('spacing.4'), // 1rem
            },
            ul: {
              marginTop: '0',
              marginBottom: theme('spacing.4'), // 1rem
            },
            ol: {
              marginTop: '0',
              marginBottom: theme('spacing.4'), // 1rem
            },
            li: {
              marginTop: theme('spacing.2'), // 0.5rem
              marginBottom: theme('spacing.2'), // 0.5rem
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}