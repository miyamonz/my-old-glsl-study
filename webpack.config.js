const path = require("path")

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve( __dirname, "public/js" ),
  },

  module: {
    rules: [
      { test: [/\.(glsl|frag|vert)$/], use: ['raw-loader', 'glslify-loader'] },
    ]
  }
}
