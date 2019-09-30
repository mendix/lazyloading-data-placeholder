const autoprefixer = require('autoprefixer');
const postcssClean = require('postcss-clean');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer,
    postcssClean,
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
