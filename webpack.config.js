const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/app/main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'chrome'),
    filename: 'filterdin.js',
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: 'ts-loader',
      },
    ],
  },
};
