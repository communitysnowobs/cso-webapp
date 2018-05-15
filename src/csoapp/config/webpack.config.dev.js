const publicPath = 'http://localhost:3000/';
const publicUrl = 'http://localhost:3000/';
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    entry: [
    // ... KEEP OTHER VALUES
    // this will be found near line 30 of the file
    require.resolve('webpack-dev-server/client') + '?http://localhost:3000',
    require.resolve('webpack/hot/dev-server'),
    // require.resolve('react-dev-utils/webpackHotDevClient'),
    ],
    plugins: [
    // this will be found near line 215-220 of the file.
    // ... other plugins
    new BundleTracker({path: paths.statsRoot, filename: 'webpack-stats.dev.json'}),
    ],
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
};
