// 登录注册
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	
	mainCtrl.controller('configController', ['$scope', '$mainService', '$storage', 
		function($scope, $mainService, $storage){
			var configList = $scope.configList = JSON.parse($storage.getLocalStorage('NQL_ConfigList')) || [];

			$scope.config = {
				cName: 'acs_sit',
				host: 'rm-bp1p1i96n28756oq5o.mysql.rds.aliyuncs.com',
				user: 'acs',
				password: 'Aaaaaaa1!',
				database: 'acs_test'
			};
			var checkIsExist = function(cName){
				var flag = null;
				for(var i in configList){
					if( cName === configList[i].cName ){
						flag = i;
						break;
					}
				}
				return flag;
			}

			$scope.fn = {
				setConfig: function(item){
					if( item ){
						$scope.config = item;
					}
					if( !$scope.config.cName || !$scope.config.host || !$scope.config.user || !$scope.config.password || !$scope.config.database ){
						$scope.commonFn.alertMsg(null, '连接信息不全');
						return false;
					}
					if( !item && checkIsExist !== null){
						configList.push($scope.config);
						$storage.setLocalStorage('NQL_ConfigList', JSON.stringify(configList));
					}
					$storage.setLocalStorage('NQL_Config', JSON.stringify( $scope.config ));
					$scope.commonFn.goView('queryTable');
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

