const webpack = require('webpack');
const withTypescript = require('@zeit/next-typescript')

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env'
});

module.exports = withTypescript({
  webpack: config => {
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});
    config.node = {...config.node, fs: "empty" }
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});
