const webpack = require('webpack');
const path = require('path');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const pkg = require('./package.json');

function createWebpackConfig(build, argv) {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  let config;

  switch (build) {
    case 'player':
      config = {
        entry: './src/index.ts',
        output: {
          path: path.resolve(__dirname, 'lib'),
          filename: `${pkg.name}.js`,
          chunkFilename: '[name].[chunkhash].js',
          libraryExport: 'default',
          library: 'IndigoPlayer',
          libraryTarget: 'umd',
        },
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
            {
              test: /\.(png|jp(e*)g)$/,
              use: {
                loader: 'url-loader',
                options: {
                  limit: 8000,
                },
              },
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
          minimizer: [],
        },
      };

      if (isProduction) {
        config.optimization.minimizer.push(new TerserPlugin({
          terserOptions: {
            output: {
              comments: /indigo-player/i,
            },
          },
        }));
      }

      return config;

    case 'theme':
      config = {
        entry: {
          theme: './src/ui/theme/index.scss',
        },
        output: {
          path: path.resolve(__dirname, 'lib'),
        },
        module: {
          rules: [
            {
              test: /\.scss$/,
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
          new MiniCssExtractPlugin({
            filename: 'indigo-theme.css',
          }),
        ],
      };

      if (isProduction) {
        config.plugins.push(new WebpackShellPlugin({
          onBuildEnd: [
            'rm ./lib/theme.js',
            'perfectionist ./lib/indigo-theme.css ./lib/indigo-theme.css --indentSize=2',
          ],
        }));
      }

      return config;

    case 'dev':
      return {
        entry: {
          dev: './dev/index.tsx',
        },
        devtool: 'inline-source-map',
        output: {
          path: path.resolve(__dirname, 'lib'),
        },
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
          ],
        },
        plugins: [
          new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'dev/template.html'),
          }),
        ],
        devServer: {
          contentBase: './dev',
        },
      };

    default:
      throw new Error('Specify a build...');
  }

  return config;
}

module.exports = (env, argv) => {
  let builds = ['player', 'theme']; // Default builds
  if (argv.builds) {
    builds = argv.builds.split(',');
  }

  return builds.map(build => createWebpackConfig(build, argv));
};
