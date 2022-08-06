module.exports = function override (config, env) {
    console.log('override')
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
        "crypto": require.resolve("crypto-browserify")
    }
    
    return config
}