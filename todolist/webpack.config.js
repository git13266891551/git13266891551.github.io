const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = {
  target:"web",
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        NODE_ENV: isDev ? '"development"':'"production"' 
      }
    }),
    new HTMLPlugin(),
    new VueLoaderPlugin()
  ],
  module: {
    rules:[
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },    
      
      {
        test:/\.(gif|jpeg|png|gif)/,
        use:[
          {
            loader:'url-loader',
            options:{
              limit:1024,
              name:'[name].[ext]'
            }
          }
        ]
      }
    ]
  }
}

if(isDev){
  console.log('kaifa')
  config.module.rules.push({
    test:/\.styl/,
    use:[
      'style-loader',
      'css-loader',
      {
        loader:"postcss-loader",
        options:{
          sourceMap:true
        }
      },
      'stylus-loader'
    ]  
  })
  const devtool = "#cheap-module-eval-source-map"
  config.devServer={
    port:"8000",
    host:"0.0.0.0",
    overlay:{
      errors:true
    },
    hot:true,  
    // historyFallback:{

    // }
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}else{
  config.entry={
    app:path.join(__dirname,'src/index.js'),
    vendor:['vue']
  }
  console.log("zhenshi")
  config.output.filename='[name].[chunkhash:8].js'
  config.module.rules.push({    
    test:/\.styl/,
    use:ExtractPlugin.extract({
      fallback:'style-loader',
      use:[       
        'css-loader',
        {
          loader:"postcss-loader",
          options:{
            sourceMap:true
          }
        },
        'stylus-loader'
      ]
    })  
  })
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2, maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    runtimeChunk: true
  }
  config.plugins.push(
    new ExtractPlugin('styles.[chunkhash:8].css'),
  )
}

module.exports = config 