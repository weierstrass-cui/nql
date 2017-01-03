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
	// 配置页
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
					if( !$scope.config.cName || !$scope.config.host || !$scope.config.user || !$scope.config.database ){
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
	// 表列表页
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
	// 数据展示页
	mainCtrl.controller('queryDataController', ['$scope', '$mainService', 
		function($scope, $mainService){
			var param = $scope.commonFn.getParamsFromUrl(), currentPage = 1,
				orderField = null, orderType = null,
				tapTime = 0, tapHashKey = null,
				rawData = null;
			$scope.fieldsList = [];
			var getData = function(){
				var submitData = {
					tableName: param.tableName,
					currentPage: currentPage,
					orderField: orderField,
					orderType: orderType
				};

				$mainService.queryData(submitData, function(res){
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
					$scope.fieldsList = res.fields;
					$scope.ulWidth = res.fields.length * 150;

					if( orderField ){
						for(var i in $scope.fieldsList ){
							if( $scope.fieldsList[i].Field == orderField ){
								$scope.fieldsList[i].orderType = orderType;
								break;
							}
						}
					}
					
				});
			}
			$scope.fn = {
				highLight: function(item){
					var time = new Date().getTime(),
						hashKey = item.$$hashKey;
					if( tapHashKey && hashKey === tapHashKey && (time - tapTime) < 300 ){
						$scope.dataDetail = angular.extend([], item.list);
						rawData = item.list;
						tapHashKey = null;
						tapTime = 0;
						item.highLight = true;
					}else{
						rawData = null;
						tapHashKey = hashKey;
						tapTime = time;
						item.highLight = !item.highLight;
					}
				},
				updateData: function(){
					var whereList = {}, updateList = {};
					for(var i in $scope.fieldsList){
						if( $scope.dataDetail[i] == rawData[i] ){
							whereList[$scope.fieldsList[i].Field] = rawData[i];
						}else{
							if( $scope.fieldsList[i].Null == 'NO' && (!$scope.dataDetail[i] || $scope.dataDetail[i] == '') ){
								$scope.commonFn.alertMsg(null, $scope.fieldsList[i].Field + '字段不能为空');
								break;
							}
							updateList[$scope.fieldsList[i].Field] = $scope.dataDetail[i];
						}
					}
					if( JSON.stringify(updateList) !== '{}' ){
						$mainService.updateData({
							tableName: param.tableName,
							whereList: whereList,
							updateList: updateList
						}, function(res){
							for(var i in $scope.fieldsList){
								rawData[i] = res.data[$scope.fieldsList[i].Field] || ''
							}
						});
					}
					$scope.dataDetail = null;
				},
				loadMore: function(){
					currentPage += 1;
					getData();
				},
				setOrder: function(item){
					orderField == item.Field ?
					( orderType = orderType = 'asc' ? 'desc' : 'asc' ) : 
					( orderType = 'asc', orderField = item.Field );
					currentPage = 1;
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

