var userModule = angular.module('user', [])


// State provider for registring routes of templates
userModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('userControlPanel', {
			// define url
			url: '/user/{id}',
			views: {
				// define templates and controller
				'body': {
					templateUrl: './partials/user.panel.html',
					controller: 'userPanelCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
				// get important data for the template
					user: ['$stateParams', 'userFactory', function($stateParams, userFactory) {
						return userFactory.getSingleUser($stateParams.id);
					}]
				}
		})
		.state('userList', {
			url: '/users',
			views: {
				'body': {
					templateUrl: './partials/user.list.html',
					controller: 'userListCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
					userList: ['$stateParams', 'userFactory', function($stateParams, userFactory) {
						return userFactory.getAllUsers();
					}]
				}
		});
}]);

// user factory for providing functions to get or set user data
userModule.factory('userFactory', ['$http', function($http){
  userObject = {
  	user: {}
  }

  // please use this function to get the user
  // otherwise you will lose your user when
  // you are reloading your page
  userObject.getUser = function(callback){
		// http request to a server route to get data of the user, which is currently logged in
  	$http.get('/api/user/login')
  	.success(function(data){
			// a callback, which is called when the data is received
  		userObject.user = data;
  		callback(userObject.user);
  	})
	.error(function(error){
		// a callback, which is called when a error is occured
		userObject.user = null;
		callback(null);
	});
  };

  userObject.login = function(user, callback){
    $http.post('/api/user/login', user)
    .success(function(data){
        userObject.user = data;
        callback(data);
    })
    .error(function(error){
		alert(error);
    });
  };

  userObject.logout = function(){
	$http.get('/api/user/logout')
	.success(function(data){
		userObject.user = null;
		alert(data);
	});
  }

  userObject.create = function(user, callback){
    $http.post('/api/user', user)
    .success(function(data){
    	userObject.user = data;
    	callback(data);
    })
	.error(function(error){
		alert(error);
	});
  };

  userObject.update = function(user, callback){
    return $http.put('/api/user/byID/' + user._id, user)
    .success(function(data){
        userObject.user = data;
        callback(userObject.user);
    })
	.error(function(error){
		alert(error);
		callback(null);
    });
  };

	userObject.getSingleUser = function(userId){
		return $http.get('/api/user/byID/' + userId).success(function(data){
			return data;
		});
	};

	userObject.getAllUsers = function() {
		return $http.get('/api/user').success(function(data) {
			return data;
		});
	};

	// return the collection of functions and data
  return userObject;
}]);

/*
 * Controller for user panel
 * Providing functions and data for the user panel
*/
userModule.controller('userPanelCtrl', ['$scope', 'userFactory', 'user', function ($scope, userFactory, user) {
	$scope.user = user.data;
	if ($scope.user.birthday != null)
		$scope.user.birthday = new Date($scope.user.birthday);
	$scope.userCopy = angular.copy($scope.user);
	$scope.editMode = false;
	$scope.validationErrors = [];
	$scope.successMessages = [];

	// for activating and deactivating the edit mode
	$scope.toggleEditMode = function () {
		if ($scope.editMode) {
			$scope.editMode = false;
			$scope.user = angular.copy($scope.userCopy);
		}
		else
			$scope.editMode = true;
	};

	// frontend check is user authorized to use the edit mode and he clicked the edit mode button
	$scope.isEditMode = function (authUser) {
		if (!authUser)
			return false;

		if (authUser._id == $scope.user._id && $scope.user.email == null)
			$scope.user.email = angular.copy(authUser.email);

		if ($scope.editMode && (authUser._id == $scope.user._id || authUser.role == 'admin' || (authUser.role == 'moderator' && $scope.user.role == 'user')))
			return true;
		else
			return false;
	};

  // validate the form data and submitting the data to the backend using the user factory
	$scope.submitEditProfile = function (authUser) {
		$scope.validationErrors = [];
		$scope.successMessages = [];

		if (angular.isDate($scope.user.birthday))
			$scope.user.birthday = new Date($scope.user.birthday);
		else
			$scope.validationErrors.push({title: 'Please check your validation:', error: 'Your entered birthday is not valid!'});

		if ($scope.validationErrors.length > 0)
			window.scrollTo(0, 0);
		else {
			userFactory.update($scope.user, function(data) {
				if (data != null) {
					$scope.successMessages.push({title: 'Finished:', message: 'Your data is saved now!'});
					$scope.userCopy = angular.copy($scope.user);
					$scope.toggleEditMode();
					if ($scope.user.email != null && authUser._id == $scope.user._id)
						authUser.email = $scope.user.email;
				}
				else
					$scope.validationErrors.push({title: 'Error:', error: 'There was an unknown error! Please try again!'});
				window.scrollTo(0, 0);
			})
		}
	};
}]);

// controler for the user list
userModule.controller('userListCtrl', ['$scope', 'userList', function ($scope, userList) {
	$scope.userList = userList.data;
	// scope variable for the order of the user list, which can be change over the frontend
	$scope.usersOrderBy = 'userName';
}]);
