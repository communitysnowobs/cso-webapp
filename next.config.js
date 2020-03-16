const withCSS = require('@zeit/next-css')
const webpack = require('webpack');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env'
});



module.exports = withCSS({
  webpack: config => {
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});
    config.node = {...config.node, fs: "empty" }
    config.plugins.push(new webpack.DefinePlugin(env));
    config.externals = config.externals || {};
    config.externals['styletron-server'] = 'styletron-server';
    return config;
  }
});