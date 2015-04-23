var app = angular.module('meanBoard', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	/*
	$routeProvider
		.when('/', {
			templateUrl: './partials/start.html',
			controller: 'RegisterCtrl'
		})
		.when('/login', {
			templateUrl: './partials/login.html',
			controller: 'RegisterCtrl'
		})
		.when('/register', {
			templateUrl: './partials/register.html',
			controller: 'RegisterCtrl'
		})
		.otherwise({redirectTo: '/'});
	*/
}]);

app.controller('RegisterCtrl', ['$scope', '$http', function($scope, $http){
	$scope.newUser = {};
	$scope.registerUser = function(){
		$http({
			method: 'POST',
			url: '/api/user',
			data: $scope.newUser
		}).success(function (data, status, headers, config) {
			$scope.newUser = {}
			console.log(data);
		}).error(function (data, status, headers, config) {
			alert(data);
		});
	}
}]);