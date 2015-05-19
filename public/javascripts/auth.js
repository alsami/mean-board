var authModule = angular.module('auth', []);

authModule.controller('authCtrl', ['$scope', 'userFactory', function($scope, userFactory){
	$scope.newUser = {};
	$scope.existingUser = {};

	userFactory.getUser(function(data){
		$scope.authUser = data;
	});

	$scope.createUser = function(){
		userFactory.create($scope.newUser, function(data){
			$scope.authUser = data;
			$scope.newUser = {};
		});
	};

	$scope.loginUser = function(){
		userFactory.login($scope.existingUser, function(data){
			$scope.authUser = data;
			$scope.existingUser = {};
		});
	};

	$scope.logout = function(){
		userFactory.logout();
		$scope.authUser = null;
	};
}]);
