var userElements = angular.module('user', [])

userElements.factory('userFactory', ['$http', function($http){
  var userObject = {
    user : []
  }

  userObject.loginUser = function(user){
    $http.post('/api/user/login', user)
    .success(function(data){
        userObject.user.push(data);
    });
  }

  userObject.createUser = function(user){
    return $http.post('/api/user', user)
    .success(function(data){
        userObject.loginUser(user);
    });
  }

  userObject.updateUser = function(user){
    return $http.put('/api/user/' + user._id, user)
    .success(function(data){
        return true;
    });
  }

  return userObject;
}]);
