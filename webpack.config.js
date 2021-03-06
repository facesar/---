const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
}

//const filenameJs = ext => isDev ? `js/[name].${ext}` : `js/[name].[contenthash].min.${ext}`;
const filenameJs = ext => isDev ? `js/[name].${ext}` : `js/[name].min.${ext}`;
const filenameCss = ext => isDev ? `styles/[name].${ext}` : `styles/[name].min.${ext}`;
//const filesImg = ext => isDev ? `images/[name].${ext}` : `images/[name].[contenthash].${ext}`;



const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: isDev,
        emit: true,
      },
    },
    'css-loader',
    'less-loader',
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders;
}

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: './pug/pages/index.pug',
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/logo.jpg'),
          to: path.resolve(__dirname, 'dist/assets'),
        },
        {
          from: path.resolve(__dirname, 'src/assets/marketing/1.png'),
          to: path.resolve(__dirname, 'dist/assets/marketing'),
        },
        {
          from: path.resolve(__dirname, 'src/assets/marketing/2.png'),
          to: path.resolve(__dirname, 'dist/assets/marketing'),
        },
        {
          from: path.resolve(__dirname, 'src/assets/marketing/3.png'),
          to: path.resolve(__dirname, 'dist/assets/marketing'),
        },
        {
          from: path.resolve(__dirname, 'src/assets/marketing/4.png'),
          to: path.resolve(__dirname, 'dist/assets/marketing'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filenameCss('css'),
    }),
  ]

  if (isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.js'],
    slickCustom: './scripts/slickCustom.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filenameJs('js'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.jpg', '.less', '.gif', '.icon', '.pug'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(),
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: cssLoaders('less-loader'),
      },
      /*{
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader',
          },
        ],
      },*/
      {
        test: /\.(?:jpg|jpeg|gif|png|ico|svg)$/i,
        type: 'asset/resource',
        /*use: [
          {
            loader: 'file-loader',
            options: {
              name: filesImg('jpg'),
            },
          },
        ],*/
      },
      {
        test: /\.(?:ttf|woff2|eot|otf)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }, 
        },
      },
      {
        test: /\.pug$/,
        exclude: /(node_modules|bower_component)/,
        use: {
          loader: 'pug-loader',
          options: {
            pretty: isDev
          },
        },
      },
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: {
              exposes: ["$", "jquery"],
            },
          },
        ]
      },
    ],
  },
};