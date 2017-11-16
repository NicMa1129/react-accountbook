/*eslint no-console:0 */
'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev.config');
const open = require('open');

// 启动webpack-dev-server并监听配置端口
new WebpackDevServer(webpack(config), config.devServer)
.listen(8888, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + 8888);
  console.log('Opening your system browser...');
  open('http://localhost:' + 8888);
});
