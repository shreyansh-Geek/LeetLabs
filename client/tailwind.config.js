/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{jsx,js,ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          'arp-display': ['ARP Display', 'sans-serif'],
          'satoshi': ['Satoshi', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };