// 登录注册
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
    // 登录
	mainCtrl.controller('homeController', ['$scope', '$homeService', 
		function($scope, $homeService){
			$homeService.getTableList({}, function(res){
				console.log(res);
			});
		}
	]);
})();