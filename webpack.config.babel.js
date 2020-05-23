import 'webpack'
import path from 'path'
import nodeExternals from 'webpack-node-externals'
import NodemonWebpackPlugin from 'nodemon-webpack-plugin'

module.exports = {
  entry: {
    server: './main.ts'
  },
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: 'cheap-module-eval-source-map',
  target: 'node',
  mode: 'development',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new NodemonWebpackPlugin({
      nodeArgs: ['-r', 'source-map-support/register']
    })
  ]
}
