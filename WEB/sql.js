var mysql = require('mysql');

var getNowTime = function(){
	var date = new Date();
	var addZero = function(num){
		return num > 9 ? num : ('0' + num);
	}
	return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
}
var printLog = function(type, logBody){
	console.log(getNowTime() + ' - [SqlClass ' + type + '] - ' + logBody);
}

var SqlClass = function(options, tableName){
	if( !options || typeof options !== 'object' ){
		printLog('ERROR', 'NO DATABASE INFORMATION');
		return false;
	}
	this.connection = mysql.createConnection({
		host: options.host,
		user: options.user,
		password: options.password,
		database: options.database
	});
	printLog('LOG', 'CONNECTED CONNECTION');
	var TBN = tableName, WHERE = [];

	var getWhere = function(){
		var _there = ' where 1 = 1';
		if( WHERE.length ){
			_there += ' and ' + WHERE.join(' and ');
			WHERE = [];
		}
		return _there;
	}
	this.release = function(){
		this.connection.end();
		printLog('LOG', 'RELEASE CONNECTION');
		return this;
	}
	this.insert = function(){
		return this;
	}
	this.update = function(opts){
		if( !TBN || typeof TBN !== 'string' ){
			printLog('ERROR', 'NO TABLE');
		}else{
			var SET = [];
			for(var i in opts){
				SET.push(i + '= "' + opts[i] + '"');
			}
			SET = SET.join(', ');
			var nql = 'update ' + TBN + ' set ' + SET + getWhere();
			printLog('LOG', nql);
			this.connection.query(nql, function(err, rows, fields){
				if( err ){
					console.log(err);
				}
			});
		}
		return this;
	}
	this.find = function(colums, callBack){
		if( !TBN || typeof TBN !== 'string' ){
			console.log('[SqlClass ERROR] - NO TABLE');
		}else{
			var colums = colums && colums.length ? colums.join(', ') : '*';
			// var nql = 'select ' + colums + ' from ' + TBN + getWhere() + ' limit 20';
			var nql = 'select ' + colums + ' from ' + TBN + getWhere() + '';
			printLog('LOG', nql);
			this.connection.query(nql, function(err, rows, fields){
				if( err ){
					console.log(err);
				}
				if( rows && callBack ){
					callBack(rows);
				}
			});
		}
		return this;
	}
	this.where = function(opts){
		WHERE = [];
		for(var i in opts){
			WHERE.push(i + '= "' + opts[i] + '"');
		}
		return this;
	}
	this.queryTable = function(callBack){
		printLog('LOG', 'SHOW TABLES');
		this.connection.query('show tables', function(err, rows, fields){
			if( err ){
				console.log(err);
			}
			if( rows && callBack ){
				callBack(rows);
			}
		});
		return this;
	}
	this.queryFields = function(callBack){
		if( !TBN || typeof TBN !== 'string' ){
			printLog('ERROR', 'NO TABLE');
		}else{
			printLog('LOG', 'SHOW FIELDS FROM' + TBN);
			this.connection.query('show fields from ' + TBN, function(err, rows, fields){
				if( err ){
					console.log(err);
				}
				if( rows && callBack ){
					callBack(rows);
				}
			});
		}
		return this;
	}
}

module.exports = SqlClass;
