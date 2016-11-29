var scrollFn = {};
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	scrollFn = {
		onScroller: function(titleId, obj){
			var titleBox = document.getElementById(titleId);
			titleBox.scrollLeft = obj.scrollLeft;
		}
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
			$scope.filter = {
				tableFilter: function(item){
					return !$scope.filterWord || item.indexOf($scope.filterWord) >= 0;
				}
			}
			$mainService.queryTable({}, function(res){
				$scope.tableList = res;
			});
		}
	]);
	mainCtrl.controller('queryDataController', ['$scope', '$mainService', 
		function($scope, $mainService){
			var param = $scope.commonFn.getParamsFromUrl(), currentPage = 1;
			$scope.fieldsList = [];
			var getData = function(){
				$mainService.queryData({
					tableName: param.tableName,
					currentPage: currentPage
				}, function(res){
					var dataList = [], data = res.data;
					$scope.showType = 'isStructure';
					if( data.length ){
						for(var i in data){
							var newJson = [];
							for(var j in res.fields){
								newJson.push(data[i][res.fields[j].Field] || '');
							}
							dataList.push({
								highLight: false,
								list: newJson
							});
						}
						$scope.loadMore = res.totalPages > 1 && res.totalPages != currentPage;
						currentPage == 1 ? $scope.dataList = dataList : 
						$scope.dataList.push.apply($scope.dataList, dataList);
						$scope.showType = 'isData';
					}
					$scope.ulWidth = res.fields.length * 150;
					$scope.fieldsList = res.fields;
				});
			}
			$scope.fn = {
				highLight: function(item){
					item.highLight = !item.highLight;
				},
				loadMore: function(){
					currentPage += 1;
					getData();
				}
			}
			$scope.filter = {
				filterHighLight: function(item){
					return item !== 'highLight';
				}
			}
			getData();
		}
	]);
})();

