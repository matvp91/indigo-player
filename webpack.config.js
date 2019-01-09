const path = require('path');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  let publicPath;
  if (isProduction) {
    publicPath = `https://unpkg.com/indigo-player@${process.env.VERSION}/lib/`;
  }

  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'indigo-player.js',
      chunkFilename: '[name].chunk.js',
      libraryTarget: 'umd',
      publicPath,
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'awesome-typescript-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsConfigPathsPlugin(),
      ],
    },
    devServer: {
      contentBase: './dev',
    },
  };
};
