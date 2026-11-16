/** Tailwind 3 matches the CDN example in the laboratory guide. */
module.exports = {
  content: ['./index.html', './js/app.js', './widget.html', './assets/js/validation.js'],
  theme: { extend: {
    colors: {
      background: '#090809', surface: '#18171B', elevated: '#222026',
      ink: '#F5F5F7', muted: '#A7A4B0', primary: '#2ECC71',
      'primary-hover': '#43D883', 'primary-active': '#27AE60',
      secondary: '#9477A8', focus: '#B39DFF', boundary: '#716C7A',
      line: '#39353F', warning: '#F5C27A', error: '#F1A68E'
    },
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    boxShadow: { card: '0 12px 32px rgb(0 0 0 / 0.16)' }
  } }, plugins: []
};
