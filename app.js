const http = require('http');
const url = require('url');
// 引入express框架
const express = require('express');
// 创建web服务器
const app = express();

const myhost = "api.bilibili.com";

class Url {
    /**
     * 传入对象返回url参数
     * @param {Object} data {a:1}
     * @returns {string}
     */
    getParam(data){
        let url = '';
        for(var k in data){
            let value = data[k] !==undefined ? data[k] : '';
            url += `&${k}=${encodeURIComponent(value)}`
        }
        return url ? url.substring(1) : ''
    }
 
    /**
     * 将url和参数拼接成完整地址
     * @param {string} url url地址
     * @param {Json} data json对象
     * @returns {string}
     */
    getUrl(url, data){
        //看原始url地址中开头是否带?，然后拼接处理好的参数
        return url += (url.indexOf('?') < 0 ? '?' : '') + this.getParam(data)
    }
}
function nodePostGetRequest(HOST, PORT, method, bodydata, callBackFunction, path, cookie,ressss) {
  //把将要发送的body转换为json格式 
 var body = bodydata;
 var bodyString = JSON.stringify(body);
  //http 头部
 var headers = {
'Content-Type': 'application/json',
'Content-Length': bodyString.length,
'Cookie': cookie
 };

//用与发送的参数类型
var options = {
host: HOST,  //ip
port: PORT,   //port
path: path,   //get方式使用的地址
method: method, //get方式或post方式
headers: headers
  };
  var req = http.request(options, function(res) {
res.setEncoding('utf-8');

var responseString = '';

res.on('data', function(data) {
  responseString += data;
});

res.on('end', function() {
  //这里接收的参数是字符串形式,需要格式化成json格式使用
  let resultObject = JSON.parse(responseString);
  // console.log('-----resBody-----', resultObject);
  getsuccess(resultObject,ressss);
});

req.on('error', function(e) {
  // TODO: handle error.
  console.log('-----error-------', e);
});
 });
 req.write(bodyString);
req.end();
}
function getsuccess(data,res){
	// console.log(data);
	res.send(data);
}
app.get('/list', (req, res) => {
	const type = req.query.type || "1";
	const pn = req.query.pn || "1";
	const ps = req.query.ps || "10";			//每个json含有的番剧数量
	const vmid = req.query.vmid || "123";		//uid	
	const num = 28;			//总文件数（total/ps+1）
	//设置cookies
	const mycookie = req.query.cookies || "你的cookies";
	//console.log(mycookie);
	let URL = new Url();
	let mypath = URL.getUrl("/x/space/bangumi/follow/list",{type:type,pn:pn,ps:ps,vmid:vmid});
	console.log(mypath);
	nodePostGetRequest(myhost, 80, 'GET', null, getsuccess, mypath, mycookie,res);
})

// 监听端口
app.listen(7777,function () {
    console.log('网站服务器启动成功');
});
//app.listen(3000);
//console.log('网站服务器启动成功');
