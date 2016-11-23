(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	mainCtrl.factory('$mainService', ['$request', function(request){
		return {
			queryTable: function(json, callback){
				request.post('/getTableList', json, callback);
			},
			queryData: function(json, callback){
				request.post('/getDataList', json, callback);
			}
		}
	}]);
})();