const fs = require('fs');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: { import: './src/extensions/chrome/main.ts', filename: 'filterdin.js' },
    popup: { import: './src/extensions/chrome/popup.ts', filename: 'popup.js' },
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'chrome'),
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
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterCompile.tap('MyCutePlugin_compile', (params) => {
          const outputPath = params.compiler.outputPath;
          fs.cpSync(path.resolve(__dirname, 'src', 'static'), outputPath, { force: true, recursive: true });
          fs.cpSync(path.resolve(__dirname, 'src', 'extensions', 'chrome', 'static'), outputPath, { force: true, recursive: true });
        });
      },
    }
  ]
};
