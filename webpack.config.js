const path = require('path');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function createWebpackConfig(build, argv) {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  // General config
  const config = {
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
    plugins: [],
  };

  // Build specific
  switch (build) {
    default:
      throw new Error('Specify a build...');

    case 'player':
      config.entry = 'src/index.ts';
      config.output = {
        path: path.resolve(__dirname, 'lib'),
        filename: 'indigo-player.js',
        chunkFilename: '[name].chunk.js',
        libraryTarget: 'umd',
      };

      if (isProduction) {
        const publicPath = `https://unpkg.com/indigo-player@${process.env.VERSION}/lib/`;
        config.output.publicPath = publicPath;
      }
      break;

    case 'dev':
      config.entry = 'dev/index.tsx';
      config.devtool = 'inline-source-map';
      config.output = {
        path: path.resolve(__dirname, 'lib'),
      };
      config.plugins.push(new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'dev/template.html'),
      }));
      config.devServer = {
        contentBase: './lib',
      };
      break;
  }

  return config;
}

module.exports = (env, argv) => {
  let builds = ['player']; // Default builds
  if (argv.builds) {
    builds = argv.builds.split(',');
  }

  return builds.map(build => createWebpackConfig(build, argv));
};
