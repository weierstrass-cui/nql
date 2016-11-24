angular.module('starter', ['starter.controller', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ngFileUpload'])
.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider
		.when('/config', {
			templateUrl: 'template/config.html',
			controller: 'configController'
		})
		.when('/queryTable', {
			templateUrl: 'template/queryTable.html',
			controller: 'queryTableController'
		})
		.when('/queryData', {
			templateUrl: 'template/queryData.html',
			controller: 'queryDataController'
		});
		//当找不到链接页面后跳转首页
		$routeProvider.otherwise('/config');
	}
]);