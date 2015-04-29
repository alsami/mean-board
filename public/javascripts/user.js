var userElements = angular.module('user', [])

userElements.factory('userFactory', ['$http', function($http){
  var userObject = {
    user : null
  }

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
        callback(data);
    })
    .error(function(error){
    	alert(error);
    });
  };

  return userObject;
}]);
