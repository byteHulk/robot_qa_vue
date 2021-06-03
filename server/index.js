
const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
// const proxy = require('http-proxy-middleware');
// http-proxy-middleware版本1.0.5的时候默认导出的不是proxy的函数了，需要用以下注释的方式调用
// const { createProxyMiddleware: proxy } = require('http-proxy-middleware');
const path = require('path');
const { port=8000, proxy:proxyConfig={} } = require('./serverConfig');
 
const app = express();
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","http://localhost:8080");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    res.header("Access-Control-Allow-Headers","django-language");
    res.header("Access-Control-Allow-Headers","xtbz");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
      res.send(200);  //让options尝试请求快速结束
    else
      next();
  });
app.use('/', express.static(path.join(__dirname, 'static')))
 
 
app.listen(3300, ()=>{
    console.log(`server is running on port ${3300}`)
})
