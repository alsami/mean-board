var authElements = angular.module("auth", []);

authElements.controller('authCtrl', ['$scope', 'userFactory', function($scope, userFactory){
		$scope.user = userFactory.user;
		$scope.newUser = {};
		$scope.existingUser = {};

		$scope.createUser = function(){
				userFactory.createUser($scope.newUser);
				$scope.newUser = {};
		};

		$scope.loginUser = function(){
				userFactory.loginUser($scope.existingUser);
				$scope.existingUser = {};
				$scope.user = userFactory.user;
				console.log($scope.user);
		};

		$scope.logout = function(){
			userFactory.logoutUser($scope.user);
		}
}]);
