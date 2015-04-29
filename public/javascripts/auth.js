var authElements = angular.module("auth", []);

authElements.controller('authCtrl', ['$scope', 'userFactory', function($scope, userFactory){
	$scope.user = userFactory.user;
	$scope.newUser = {};
	$scope.existingUser = {};

	$scope.createUser = function(){
		userFactory.create($scope.newUser, function(data){
			$scope.user = data;
		});
		$scope.newUser = {};
	};

	$scope.loginUser = function(){
		userFactory.login($scope.existingUser, function(data){
			$scope.user = data;
		});
		$scope.existingUser = {};
	};

	$scope.logout = function(){
		userFactory.logout();
		$scope.user = null;
	};
}]);
