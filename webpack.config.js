const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = [{
  entry: './src/index.ts',
  devtool: 'eval-source-map',
  output: {
    filename: 'ion-sdk.min.js',
    library: 'IonSDK',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
},{
  entry: './src/connector/index.ts',
  devtool: 'source-map',
  output: {
    filename: 'ion-connector.min.js',
    library: 'Ion',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      exclude: /node_modules/,
      loader: "ts-loader"
     }],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: false
    })]
  },
}];
