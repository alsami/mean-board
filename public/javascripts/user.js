var userElements = angular.module('user', [])

userElements.factory('userFactory', ['$http', function($http){
  var userObject = {
    user : null
  }

  userObject.login = function(user, scopeUser){
    $http.post('/api/user/login', user)
    .success(function(data){
        userObject.user = data;
        scopeUser = data;
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

  userObject.create = function(user, scopeUser){
    $http.post('/api/user', user)
    .success(function(data){
    	userObject.user = data;
    	scopeUser = data;
    })
	.error(function(error){
		alert(error);
	});
  };

  userObject.update = function(user, scopeUser){
    return $http.put('/api/user/' + user._id, user)
    .success(function(data){
        userObject.user = data;
        scopeUser = data;
    })
    .error(function(error){
    	alert(error);
    });
  };

  return userObject;
}]);
