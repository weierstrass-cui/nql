// 登录注册
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	mainCtrl.controller('queryTableController', ['$scope', '$mainService', 
		function($scope, $mainService){
			$mainService.queryTable({}, function(res){
				$scope.tableList = res;
			});
		}
	]);
	mainCtrl.controller('queryDataController', ['$scope', '$mainService', 
		function($scope, $mainService){
			var param = $scope.commonFn.getParamsFromUrl();
			$mainService.queryData({
				tableName: param.tableName
			}, function(res){
				$scope.fieldsList = res.fields;
				$scope.dataList = res.data;
			});
		}
	]);
})();

