/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

const dynamicClasses = [];

const processColor = (color, tone = null) => {
  dynamicClasses.push(`tw-bg-${color}${tone ? `-${tone}` : ''}`);
  dynamicClasses.push(`tw-text-${color}${tone ? `-${tone}` : ''}`);
  dynamicClasses.push(`tw-border-${color}${tone ? `-${tone}` : ''}`);
};

Object.keys(colors).forEach((colorKey) => {
  if (typeof colors[colorKey] === 'object') {
    Object.keys(colors[colorKey]).forEach((tone) => {
      processColor(colorKey, tone);
    });
  } else {
    processColor(colorKey);
  }
});

module.exports = {
  prefix: 'tw-',
  content: ["./src/**/*.{html,js,ts,vue}"],
  safelist: [...dynamicClasses],
  theme: {
    extend: {
      colors: {}
    },
  },
  plugins: [],
};
