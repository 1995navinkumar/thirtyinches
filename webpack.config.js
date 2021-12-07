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
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  module: {
    rules: [{
      ...babelConfig
    }]
  }
};

const serviceWorkerConfig = {
  entry: './src/firebase-messaging-sw.js',
  output: {
    filename: 'firebase-messaging-sw.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [{
      test: /\.m?js/,
      resolve: {
        fullySpecified: false
      }
    }, {
      ...babelConfig
    }]
  }
};

module.exports = [appConfig, serviceWorkerConfig];
