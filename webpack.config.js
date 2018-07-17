

const webpack = require('webpack');
// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {

  const IS_DEVELOPMENT = argv.mode === 'development';

  return {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/js')
  },
  //開発、リリースによって変更する
  devtool: IS_DEVELOPMENT ? 'source-map' : 'none',

  optimization: {
      // developmentモードではminimizer: [] となるため、consoleが出力される
      // puroductionモードでではminimizer: [ new UglifyJSPlugin({... となるため、consoleは削除
      minimizer: IS_DEVELOPMENT
        ? []
        : [
            new UglifyJSPlugin({
              uglifyOptions: {
                compress: {
                  drop_console: true
                }
              }
            })
          ]
    },
  module: {
    rules: [
    {
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        use: [
        {
            loader: 'babel-loader',
            options: {
              presets: [['env', { modules: false }]]
            }
          }
          ]
        },
        {
        // enforce: 'pre'がついていないローダーより早く処理が実行される
        // babel-loaderで変換する前にコードを検証したいため、指定が必要
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new webpack.LoaderOptionsPlugin({ options: {} }),
    ]
  };
};