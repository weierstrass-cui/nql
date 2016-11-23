angular.module('starter', ['starter.controller', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ngFileUpload'])
.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider
		.when('/home', {
			templateUrl: 'template/home.html',
			controller: 'homeController'
		});
		//当找不到链接页面后跳转首页
		$routeProvider.otherwise('/home');
	}
]);