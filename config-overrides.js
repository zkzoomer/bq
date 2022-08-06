const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override (config, env) {
    console.log('override')
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        "http": false,
        "https": false,
        "zlib": false,
        "path": false,
        "stream": false,
        "util": false,
        "os": require.resolve("os-browserify/browser"),
        "crypto": false, /* require.resolve("crypto-browserify") */
    }
    
    return config
}