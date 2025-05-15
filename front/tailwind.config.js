module.exports = {
    content: [
      "./**/*.{js,jsx,ts,tsx,css}",
      "./app/**/*.{js,jsx,ts,tsx,css}",
      "./components/**/*.{js,jsx,ts,tsx,css}",
      "./login/**/*.{js,jsx,ts,tsx,css}"
      
    ],
    theme: {
      extend: {
        zIndex: {
          '-10': '-10',
        },
      },
    },
    plugins: [],
  };