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
		});
}]);

userModule.factory('userFactory', ['$http', function($http){
  userObject = {
  	user: {}
  }

  // please use this function to get the user
  // otherwise you will lose your user when
  // you are reloading your page
  userObject.getUser = function(callback){
  	$http.get('/api/user/login')
  	.success(function(data){
  		userObject.user = data;
  		callback(userObject.user);
  	})
	.error(function(error){
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
    return $http.put('/api/user/' + user._id, user)
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
	}

  return userObject;
}]);

userModule.controller('userPanelCtrl', ['$scope', 'userFactory', 'user', function ($scope, userFactory, user) {
	$scope.user = user.data;
	$scope.userCopy = angular.copy($scope.user);
	$scope.editMode = false;

	$scope.toggleEditMode = function () {
		if ($scope.editMode) {
			$scope.editMode = false;
			$scope.user = angular.copy($scope.userCopy);
		}
		else
			$scope.editMode = true;
	};

	$scope.isEditMode = function (authUser) {
		if ($scope.editMode && (authUser._id == $scope.user._id || authUser.role == 'admin' || (authUser.role == 'moderator' && $scope.user.role == 'user')))
			return true;
		else
			return false;
	};
}]);
