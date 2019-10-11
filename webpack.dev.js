const webpack = require('webpack');
const XMLPlugin = require('xml-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InjectPlugin = require('webpack-inject-plugin').default;

const paths = require('./paths');
const {
  version,
  description,
  organization: companyName,
  scope,
  widgetName,
  widgetFriendlyName,
} = require('./package.json');
const { mxAppHost, mxAppPort, devServerPort } = require('./readConfig')();

/*
 * 'xml-webpack-plugin' causing some webpack deprecations warnigns.
 * These warnings are safe to be ignored as we're in webpack 4, consider to periodically check if these
 * dependencies can be updated especially before going to webpack 5.
 * Uncomment the line below to be able to trace webpack deprecations.
 * Set 'process.noDeprecation' to 'false' to get deprecations trace printed to your cmd/terminal.
 */
process.traceDeprecation = true;
process.noDeprecation = true;

const organization = companyName
  .replace(/[&/\\#,+()$~%.'":*?<>{}_\s]/g, '')
  .toLowerCase();

const scopeWithSuffix = suffix => (scope ? `${scope}${suffix}` : '');

const widgetDir = `${widgetName}/widget`;
const widgetUIDir = `${widgetDir}/ui`;

const sharedConfigs = {
  NAME: widgetName,
  VERSION: version,
  ORGANIZATION: organization,
  SCOPE: scope,
};

const widgetXMLFiles = [
  {
    template: paths.widgetPackageXML,
    filename: `package.xml`,
    data: {
      ...sharedConfigs,
      SCOPE: scopeWithSuffix('/'),
    },
  },
  {
    template: paths.widgetConfigXML,
    filename: `${widgetName}.xml`,
    data: {
      ...sharedConfigs,
      SCOPE: scopeWithSuffix('.'),
      FRIENDLY_NAME: widgetFriendlyName,
      WIDGET_DESC: description,
    },
  },
];

const devServerConfigs = {
  port: devServerPort,
  open: true,
  watchContentBase: true,
  publicPath: '/widgets/',
  proxy: [
    {
      context: ['**', `!/widgets/${widgetDir}/[name].js`],
      target: `http://${mxAppHost}:${mxAppPort}/`,
    },
  ],
  overlay: {
    errors: true,
  },
  stats: 'errors-only',
};

/**
 * It is not really necessary to make a functional call here.
 * We're doing this just to be consistent with `webpack.prod.js`
 */

const getWebpackConfig = () => {
  const libraryTarget = 'umd';
  const entry = { [widgetName]: paths.srcEntry };
  /**
   * We cannot use a external babel.config.js
   * because `@babel/preset-env > modules` is dynamic
   * So we have to put this inside of this getWebpackConfig function
   */
  const babelConfig = {
    presets: [
      ['@babel/preset-env', { modules: libraryTarget }],
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
  return {
    mode: 'development',
    devtool: 'eval-source-map',
    entry,
    output: {
      path: paths.buildDir,
      filename: `${widgetDir}/[name].js`,
      libraryTarget,
      publicPath: '/widgets/',
    },
    devServer: devServerConfigs,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: { config: { path: paths.confDir } },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `[name].[ext]`,
                outputPath: `${widgetUIDir}/images`,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.css', '.scss'],
      modules: ['node_modules'],
    },
    externals: [
      {
        react: 'react',
      },
      {
        'react-dom': 'react-dom',
      },
      {
        MxWidgetBase: 'mxui/widget/_WidgetBase',
      },
      {
        dojoBaseDeclare: 'dojo/_base/declare',
      },
    ],
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: `${widgetUIDir}/[name].css` }),
      new XMLPlugin({ files: widgetXMLFiles }),
      new webpack.EnvironmentPlugin(['MODE']),
      new InjectPlugin(
        () => `mxui.dom.addCss('widgets/${widgetUIDir}/${widgetName}.css');`
      ),
    ],
  };
};

module.exports = getWebpackConfig();
