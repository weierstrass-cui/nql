(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	mainCtrl.factory('$homeService', ['$request', function(request){
		return {
			getTableList: function(json, callback){
				request.post('/getTableList', json, callback);
			}
		}
	}]);
})();