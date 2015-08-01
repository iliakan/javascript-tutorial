// Required:
// npm i -g webpack
// npm i babel-loader

module.exports = {
  entry: './main',

  output: {
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: "babel" }
    ]
  }
};

