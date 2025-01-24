const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    zlib: require.resolve('browserify-zlib'),
    process: require.resolve('process/browser'),
  };
  
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ];

  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': 'process/browser.js'
  };

  return config;
} 