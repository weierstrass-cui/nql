var http = require('http'),
	url = require('url'),
	querystring = require('querystring');
var connection = require('./sql.js');

var dbOption = null;
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
		var con = new connection(dbOption);
		con.queryTable(function(res){
			var response = [];
			for(var i in res){
				response.push(res[i]['Tables_in_' + dbOption.database]);
			}
			con.release();
			con = null;
			sendResponse(httpResponse, response, "Y");
		});
	},
	'/getDataList': function(httpResponse){
		if( this.tableName ){
			var con = new connection(dbOption, this.tableName);
			var responseData = {};
			con.queryFields(function(fieldsRes){
				responseData.fields = fieldsRes;
				con.find(null, function(res){
					responseData.data = res;
					con.release();
					con = null;
					sendResponse(httpResponse, responseData, "Y");
				});
			});
		}
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
		dbOption = {
			host: postData.host,
			user: postData.user,
			password: postData.password,
			database: postData.database
		}
		queryFunctions[pathName] && queryFunctions[pathName].call(postData, res);
	});
}).listen(8080);
