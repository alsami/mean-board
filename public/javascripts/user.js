var userElements = angular.module('user', [])

userElements.factory('userFactory', ['$http', function($http){
  var userObject = {
    user : []
  }

  userObject.loginUser = function(user){
    $http.post('/api/user/login', user)
    .success(function(data){
        console.log("I am in");
        userObject.user.push(data);
    })
    .error(function(error){
      console.log(error)
    });
  }

  userObject.createUser = function(user){
    return $http.post('/api/user', user)
    .success(function(data){
        userToLogin = {userName : user.userName, password : user.password};
        console.log(data.password);
        userObject.loginUser(userToLogin);
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
