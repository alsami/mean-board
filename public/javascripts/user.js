var userModule = angular.module('user', [])

userModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('userControlPanel', {
			url: '/user/{id}',
			views: {
				'navbar': {
						templateUrl: './partials/navbar.html'
					},
				'body': {
					templateUrl: './partials/user.controlPanel.html',
					controller: 'userPanelCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
					user: ['$stateParams', 'userFactory', function($stateParams, userFactory) {
						return userFactory.getSingleUser($stateParams.id);
					}]
				}
		})
		.state('userList', {
			url: '/users',
			views: {
				'navbar': {
						templateUrl: './partials/navbar.html'
					},
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

userModule.factory('userFactory', ['$http', function($http){
  userObject = {
  	user: {}
  }

  // please use this function to get the user
  // otherwise you will lose your user when
  // you are reloading your page
	console.log("A");
  userObject.getUser = function(callback){
  	$http.get('/api/user/login')
  	.success(function(data){
			console.log("C");
  		userObject.user = data;
  		callback(userObject.user);
  	})
	.error(function(error){
		console.log("B");
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
	}

  return userObject;
}]);

userModule.controller('userPanelCtrl', ['$scope', 'userFactory', 'user', function ($scope, userFactory, user) {
	$scope.user = user.data;
	if ($scope.user.birthday != null)
		$scope.user.birthday = new Date($scope.user.birthday);
	$scope.userCopy = angular.copy($scope.user);
	$scope.editMode = false;
	$scope.validationErrors = [];
	$scope.successMessages = [];

	$scope.toggleEditMode = function () {
		if ($scope.editMode) {
			$scope.editMode = false;
			$scope.user = angular.copy($scope.userCopy);
		}
		else
			$scope.editMode = true;
	};

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

userModule.controller('userListCtrl', ['$scope', 'userList', function ($scope, userList) {
	$scope.userList = userList.data;
	$scope.usersOrderBy = 'userName';
}]);
