var http = require('http'),
	url = require('url'),
	querystring = require('querystring');
var connection = require('./sql.js'),
	log4js = require('./loger.js');

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
	var responseBody = JSON.stringify({
		status: status,
		result: body,
		description: description || ''
	})
	// log4js('info', responseBody);
	httpResponse.write(responseBody);
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
			var con = new connection(dbOption, this.tableName),
				currentPage = this.currentPage - 1 || 0,
				orderField = this.orderField,
				orderType = this.orderType;
			var responseData = {};
			con.queryFields(function(fieldsRes){
				responseData.fields = fieldsRes;
				if( orderField && orderType ){
					con.setOrder({
						orderField: orderField,
						orderType: orderType
					});
				}
				con.find(null, currentPage, function(res){
					responseData.data = res.rows;
					responseData.totalPages = res.totalPages;
					responseData.totalRows = res.totalRows;
					
					con.release();
					con = null;
					sendResponse(httpResponse, responseData, "Y");
				});
			});
		}
	}
}

http.createServer(function(req, res){
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
		var postDataString = JSON.stringify(postData);
		if( pathName != '/' && postDataString != '{}' ){
			res.writeHeader(200, {'content-type':'text/html;charset=utf-8', "Access-Control-Allow-Origin":"*"});
			log4js('info', 'pathName: ' + pathName);
			log4js('info', JSON.stringify(postData));
			queryFunctions[pathName] && queryFunctions[pathName].call(postData, res);
		}else{
			res.writeHeader(404, {'content-type':'text/html;charset=utf-8', "Access-Control-Allow-Origin":"*"});
			res.end();
		}
	});
}).listen(8080);
