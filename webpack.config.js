const fs = require('fs');
const path = require('path');
const semver = require('semver');

module.exports = (env, arg) => {
  if (!semver.gte(process.versions.node, '16.7.0')) {
    throw new Error('Node version must be 16.7.0 or higher');
  }
  
  const browser = env.browser;
  if (!browser) {
    throw new Error('Must specify browser: either chrome or firefox');
  }

  return {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
      main: { import: `./src/extensions/${browser}/main.ts`, filename: 'filterdin.js' },
      popup: { import: `./src/extensions/${browser}/popup.ts`, filename: 'popup.js' },
    },
    output: {
      path: path.resolve(__dirname, 'dist', browser),
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
            fs.cpSync(path.resolve(__dirname, 'src', 'extensions', browser, 'static'), outputPath, { force: true, recursive: true });
          });
        },
      }
    ]
  };
}
