var authElements = angular.module("auth", []);

authElements.controller('authCtrl', ['$scope', 'userFactory', function($scope, userFactory){
		$scope.user = userFactory.user;
		$scope.newUser = {};
		$scope.existingUser = {};
		//console.log(userFactory.user);

		$scope.createUser = function(){
				userFactory.createUser($scope.newUser);
				$scope.newUser = {};
		};

		$scope.loginUser = function(){
				userFactory.loginUser($scope.existingUser);
				$scope.existingUser = {};
		};

		/*
		$scope.logout = function(){
			$http.get('/api/user/logout')
				.success(function(data){
					userFactory.setUser(null);
					alert(data);
				});
		}
		*/
}]);
