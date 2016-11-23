var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	pass: '',
	database: 'CK'
});

var SqlClass = function(tableName){
	if( !tableName || typeof tableName !== 'string' ){
		console.log('[SqlClass ERROR] - NO TABLE');
		return false;
	}
	var WHERE = [];

	var getWhere = function(){
		var _there = ' where 1 = 1';
		if( WHERE.length ){
			_there += ' and ' + WHERE.join(' and ');
			WHERE = [];
		}
		return _there;
	}
	this.insert = function(){
		return this;
	}
	this.update = function(opts){
		var SET = [];
		for(var i in opts){
			SET.push(i + '= "' + opts[i] + '"');
		}
		SET = SET.join(', ');
		var nql = 'update ' + tableName + ' set ' + SET + getWhere();
		connection.query(nql, function(err, rows, fields){
			if( err ){
				console.log(err);
			}
		});
		return this;
	}
	this.find = function(colums, callBack){
		var colums = colums && colums.length ? colums.join(', ') : '*';
		var nql = 'select ' + colums + ' from ' + tableName + getWhere();
		console.log('[query NQL] - ' + nql);
		connection.query(nql, function(err, rows, fields){
			if( err ){
				console.log(err);
			}
			if( rows && callBack ){
				callBack(rows);
			}
		});
		return this;
	}
	this.where = function(opts){
		WHERE = [];
		for(var i in opts){
			WHERE.push(i + '= "' + opts[i] + '"');
		}
		return this;
	}
	this.showTableList = function(callBack){
		connection.query('show tables', function(err, rows, fields){
			if( err ){
				console.log(err);
			}
			if( rows && callBack ){
				callBack(rows);
			}
		});
		return this;
	}
}

module.exports = SqlClass;
// connection.connect(function(err){
// 	if(err){
// 		console.log('[connection connect] error:' + err);
// 		return;
// 	}
// 	console.log('[connection connect] succeed!');
// });
/*{
	select: function(options, callBack){
		if( typeof options !== 'object' || !options.table ){
			console.log('[SELECT ERROR] - NO TABLE');
			return false;
		}
		var colums = '*';
		if( options.colums && options.colums.length ){
			colums = options.colums.join(', ');
		}
		var sql = 'select ' + colums + ' from ' + options.table + ' where 1 = 1';
		connection.query(sql, function(err, rows, fields){
			if( err ){
				console.log(err);
			}
			if( rows && callBack ){
				callBack(rows);
			}
		});
		// connection.end();
	}
}*/
