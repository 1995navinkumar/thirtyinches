const path = require('path');

const babelConfig = {
  test: /\.(js|jsx)$/,
  include: path.resolve(__dirname, '.'),
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    options: {
      "presets": ["@babel/preset-env", "@babel/preset-react"],
      "plugins": ["@babel/plugin-transform-runtime"]
    }
  }]
}

const appConfig = {
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  module: {
    rules: [{
      ...babelConfig
    }, {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },]
  }
};

module.exports = [appConfig];
