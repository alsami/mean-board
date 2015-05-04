var authModule = angular.module("auth", []);

authModule.controller('authCtrl', ['$scope', 'userFactory', function($scope, userFactory){
	userFactory.getUser(function(data){
		console.log(data);
		$scope.authUser = data;
	});

	$scope.newUser = {};
	$scope.existingUser = {};

	$scope.createUser = function(){
		userFactory.create($scope.newUser, function(data){
			$scope.authUser = data;
		});
		$scope.newUser = {};
	};

	$scope.loginUser = function(){
		userFactory.login($scope.existingUser, function(data){
			$scope.authUser = data;
		});
		$scope.existingUser = {};
	};

	$scope.logout = function(){
		userFactory.logout();
		$scope.authUser = null;
	};
}]);
