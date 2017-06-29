var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  context: __dirname + "/client/js",
  entry: './booking.js',
  output: { path: __dirname +'/client/js', filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
   plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};