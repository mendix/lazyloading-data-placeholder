/**
 * this babel.config.js is for Jest
 * `webpack.dev.js` and `webpack.prod.js` have their own babel settings
 */

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-transform-runtime', { regenerator: true }],
  ],
};
