var http = require('http'),
	url = require('url'),
	util = require('util'), 
	querystring = require('querystring');
var connection = require('./SQL.js');

var ck = new connection('ck');
// ck.where({
// 	'id': 1
// }).update({
// 	name: '崔小瓢'
// });

// ck.where({
// 	'id': 1
// }).find(null, function(res){
// 	console.log(res);
// });
var sendResponse = function(httpResponse, body, status, description){
	httpResponse.write(JSON.stringify({
		status: status,
		result: body,
		description: description || ''
	}).replace(/'/gi,'"'));
	httpResponse.end();
}

var queryFunctions = {
	'/getTableList': function(httpResponse){
		ck.showTableList(function(res){
			var response = [];
			for(var i in res){
				response.push(res[i].Tables_in_ck);
			}
			sendResponse(httpResponse, response, "Y");
		});
	}
}


http.createServer(function(req, res){
	res.writeHeader(200, {'content-type':'text/html;charset=utf-8', "Access-Control-Allow-Origin":"*"});
	var post = '', pathName = '';
	req.on('data', function(chunk){
		post += chunk;
	});
	req.on('end', function(){
		postData = querystring.parse(post);
		pathName = url.parse(req.url, true).pathname;
		queryFunctions[pathName] && queryFunctions[pathName].call(postData, res);
	});
}).listen(80);
