const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function prodPlugin(plugin, mode) {
  return mode === 'production' ? plugin : () => {};
}

module.exports = (env, { mode }) => {
  const inDev = mode === 'development';
  return {
    devtool: inDev ? 'source-map' : 'none',
    mode: inDev ? 'development' : 'production',
    entry: {
      zooom: './sources/script.js',
    },
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: './zooom.js',
      library: 'Zooom',
      libraryExport: 'default',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      prodPlugin(
        new CleanWebpackPlugin({
          verbose: true,
        }),
        mode
      ),
      prodPlugin(new CopyPlugin([{ from: 'images', to: 'images' }]), mode),
      new HtmlWebPackPlugin({
        template: './sources/index.html',
      }),
    ],
  };
};
