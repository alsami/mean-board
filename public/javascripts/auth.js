// This module is used for handling the authenthification user
// it's controller is bind to the body of the index.ejs
// So we can check up the users permissions and information everywhere in the frontend
var authModule = angular.module('auth', []);

// Controller for the authenticated user
// Holds basic functions for creating a user, login a user and logout a user
authModule.controller('authCtrl', ['$scope', '$window', 'userFactory', function($scope, $window, userFactory){
	// initialize variables
	$scope.newUser = {};
	$scope.existingUser = {};

	// this function is used to get a user that has been logged on
	// it is triggered on every page load and works as long as there is a valid session cookie
	userFactory.getUser(function(data){
		$scope.authUser = data;
	});

	// When displaying the modal dialog for registering and hitting the register button
	// This function will create the user and reload the page, where ever he might be
	// The user will then be registered and logged on
	$scope.createUser = function(){
		userFactory.create($scope.newUser, function(data){
			$scope.authUser = data;
			$scope.newUser = {};
			$window.location.reload();
		});
	};

	// This function is used to log on a user with the given credentials
	// The backend handels invalid data
	$scope.loginUser = function(){
		userFactory.login($scope.existingUser, function(data){
			$scope.authUser = data;
			$scope.existingUser = {};
		});
	};

	// simply log-out the user and set the used scope object null
	$scope.logout = function(){
		userFactory.logout();
		$scope.authUser = null;
	};

	// helper function used to check whether a user is available or not (permission checks etc.)
	$scope.isAuthUserNull = function(){
		return $scope.authUser == null ? true : false;
	}
}]);
