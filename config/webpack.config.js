'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    app: PATHS.src + '/apps/tab/app.js',
    background: PATHS.src + '/apps/background/background.js',
    popup: PATHS.src + '/apps/popup/popup.js',
    contentScript: PATHS.src + '/apps/popup/contentScript.js',
  },
});

module.exports = config;
