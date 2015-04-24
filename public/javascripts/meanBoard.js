var app = angular.module('meanBoard', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/category', {
			templateUrl: './partials/category.html',
			controller: 'categoryCtrl',
			resolve:{
				postPromise: ['categoryFactory', function(categoryFactory){
					return categoryFactory.getAllCategories();
				}]
			}
			
		})
		.when('/home', {
			templateUrl: './partials/home.html'
		})
		.otherwise({
			redirectTo: '/home',
			templateUrl: './partials/home.html'
		});
}]);

app.factory('categoryFactory', ['$http', function($http){
	var categoryObject = {
		categories : [/*{title: 'hallo'}*/]
	}
	
	categoryObject.getAllCategories = function(){
		return $http.get('/api/category').success(function(data){
			angular.copy(data, categoryObject.categories);
		});
	}
	
	categoryObject.createCategory = function(category){
		return $http.post('/api/category', category).success(function(data){
			categoryObject.categories.push(data);
		});
	}
	
	categoryObject.updateCategory = function(category){
		return $http.put('/api/category/' + category._id, category).success(function(data){
			categoryObject.getAllCategories();
		});
	}
	
	categoryObject.deleteCategory = function(category){
		return $http.delete('/api/category/' + category._id, category).success(function(data){
			categoryObject.getAllCategories();
		});
	}

	return categoryObject;
}]);


app.factory('userFactory', ['$http', function($http){
	var userObject = {
		users : []
	}
	
	userObject.getAllUsers = function(){
		return $http.get('/api/user').success(function(data){
			angular.copy(data, userObject.users);
		});
	}
	
	userObject.createUser = function(user){
		return $http.post('/api/user', user).error(function(data){
			alert(data)
		});
	}
	
	userObject.updateUser = function(user){
	
	}
	
	return userObject;
}]);

app.controller('RegisterCtrl', ['$scope', 'userFactory', function($scope, userFactory){
		$scope.users = userFactory.users;
		$scope.user = {};
		
		$scope.createUser = function(){
			userFactory.createUser($scope.user);
			$scope.user = {};
		}
}]);

app.controller('categoryCtrl', ['$scope', 'categoryFactory',function($scope, categoryFactory){
	$scope.categories = categoryFactory.categories;
	$scope.title = ''
	$scope.createMainCategory = function(){
		categoryFactory.createCategory({title: $scope.title});
	}
	$scope.updateCategory = function(category){
		categoryFactory.updateCategory(category);
	}
	$scope.deleteCategory = function(category){
		categoryFactory.deleteCategory(category);
	}
}]);