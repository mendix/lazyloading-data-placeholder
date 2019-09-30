/**
 * This functions are for reading `dev.config.js` and `dev.config.local.js`.
 * DO NOT change this file.
 */

const fs = require('fs-extra');
const path = require('path');

// file extension is mandatory
const defaultConfigPath = path.join(process.cwd(), 'dev.config.js');
const localConfigPath = defaultConfigPath.replace('.js', '.local.js');

const defaultConfig = require(defaultConfigPath); // eslint-disable-line import/no-dynamic-require

const localConfig = fs.existsSync(localConfigPath)
  ? require(localConfigPath) // eslint-disable-line import/no-dynamic-require
  : {};

function readConfig() {
  return { ...defaultConfig, ...localConfig };
}

module.exports = readConfig;
