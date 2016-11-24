// 登录注册
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	
	mainCtrl.controller('configController', ['$scope', '$mainService', '$storage', 
		function($scope, $mainService, $storage){
			$scope.config = {
				host: 'rm-bp1p1i96n28756oq5o.mysql.rds.aliyuncs.com',
				user: 'acs',
				password: 'Aaaaaaa1!',
				database: 'acs_test'
			};
			$scope.fn = {
				setConfig: function(){
					$storage.setLocalStorage('NQL_Config', JSON.stringify($scope.config));
					$scope.commonFn.goView('queryTable', true);
				}
			}
		}
	]);
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

