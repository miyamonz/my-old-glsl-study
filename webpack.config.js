const path = require("path")

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join( __dirname, "public/js" ),
  },

  module: {
    loaders: [
      { test: [/\.frag$/, /\.vert$/], loaders: 'raw-loader' },

    ]
  }
}
