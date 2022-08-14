const webpack = require("webpack")
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override (config, env) {
    console.log('override')
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

    config.resolve.fallback = {
        ...config.resolve.fallback,
        "buffer": require.resolve("buffer"),
        "stream": require.resolve("stream-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "constants": require.resolve("constants-browserify") 
    }

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    
    return config
}