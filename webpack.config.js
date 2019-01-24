const webpack = require('webpack');
const path = require('path');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');

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
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: ['file-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsConfigPathsPlugin(),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(pkg.version),
      }),
      new webpack.BannerPlugin(`indigo-player v${pkg.version} - [name] - ${+new Date()}`),
    ],
    optimization: {
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          vendors: false,
        },
      },
    },
  };

  if (isProduction) {
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: /indigo-player/i,
          },
        },
      }),
    ];
  }

  // Build specific
  switch (build) {
    default:
      throw new Error('Specify a build...');

    case 'player':
      config.entry = 'src/index.ts';
      config.output = {
        path: path.resolve(__dirname, 'lib'),
        filename: `${pkg.name}.js`,
        chunkFilename: '[name].[chunkhash].js',
        libraryExport: 'default',
        library: 'IndigoPlayer',
        libraryTarget: 'umd',
      };

      if (isProduction) {
        const publicPath = `https://cdn.jsdelivr.net/npm/indigo-player@${process.env.VERSION}/lib/`;
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
        contentBase: './dev',
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
