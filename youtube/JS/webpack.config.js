var path = require('path');
var webpack = require('webpack')

module.exports = {
    entry: './source/drive.js',
    output: {
        path: __dirname,
        filename: './driver.js'
    },
    watch:true,
    //delay for build after save
    watchOptions: {
        aggregateTimeout: 200
    },
    //for debugging
    devtool: "source-map",

    module: {
        loaders: [{
            test: /.js?$/,
            loader: 'babel!eslint-loader'
        }]
    }
    
}
