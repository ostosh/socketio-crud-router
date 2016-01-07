module.exports = {
  entry: './public/src/client.js',
  output: {
    filename: 'public/dist/bundle.js'
  },
  module:{
    loaders: [
      {
        exclude: /(node_modules|app-server.js)/,
        loader: 'babel',
        query:{
          presets:['react']
        }
      }
    ]
  }
}