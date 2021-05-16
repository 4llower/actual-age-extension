'use strict'

const { merge } = require('webpack-merge')

const common = require('./webpack.common.js')
const PATHS = require('./paths')

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    tab: PATHS.src + '/apps/tab/tab.js',
    background: PATHS.src + '/apps/background/background.js',
    popup: PATHS.src + '/apps/popup/popup.js',
  },
})

module.exports = config
