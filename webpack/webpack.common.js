import { resolve } from 'path';
import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Dotenv from 'dotenv-webpack';
import CopyPlugin from 'copy-webpack-plugin';

const production = process.env.NODE_ENV === 'production';
console.log(production);

export const projectDir = resolve(new URL('.', import.meta.url).pathname, '..');

export default {
  entry: resolve(projectDir, './src/app/index.tsx'),
  output: {
    path: resolve(projectDir, './dist'),
    filename: production
      ? 'static/scripts/[name].[contenthash].js'
      : 'static/scripts/[name].js',
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          production
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]__[hash:base64:5]',
                auto: /\.module\.\w+$/i,
                namedExport: false,
              },
              importLoaders: 2,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                quietDeps: true,
                silenceDeprecations: [
                  'color-functions',
                  'global-builtin',
                  'import'
                ],
                includePaths: [resolve(projectDir, 'node_modules')],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
    alias: {
      '@': resolve(projectDir, 'src'), 
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve(projectDir, './public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/styles/[name].[contenthash].css',
    }),
    //new webpack.EnvironmentPlugin({ NODE_ENV: 'development', }),
    new Dotenv({
      systemvars: production, 
    }),
    new CopyPlugin({
        patterns: [
            { 
                from: resolve(projectDir, 'public/locales'), 
                to: resolve(projectDir, 'dist/locales'),
                noErrorOnMissing: true
            },
        ],
    }),
  ],
  optimization: {
concatenateModules: false,

  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
      },
    },
  },
},
}