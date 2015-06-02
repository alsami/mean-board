var authModule = angular.module('auth', []);

authModule.controller('authCtrl', ['$scope', '$window', 'userFactory', function($scope, $window, userFactory){
	$scope.newUser = {};
	$scope.existingUser = {};

	userFactory.getUser(function(data){
		$scope.authUser = data;
	});

	$scope.createUser = function(){
		userFactory.create($scope.newUser, function(data){
			$scope.authUser = data;
			$scope.newUser = {};
			$window.location.reload();
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

	$scope.isAuthUserNull = function(){
		return $scope.authUser == null ? true : false;
	}
}]);
