var app = angular.module('meanBoard', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('/category', {
			url: '/category',
			templateUrl: './partials/category.html',
			controller: 'categoryCtrl',
			resolve:{
				postPromise: ['categoryFactory', function(categoryFactory){
					return categoryFactory.getAllCategories();
				}]
			}
			
		})
		.state('/home', {
			url: '/home',
			templateUrl: './partials/home.html'
		})
		/*
		.state("otherwise", { 
			url : '/home',
			templateUrl: './partials/home.html'
		})
		*/
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
		$scope.newUser = {};
		
		$scope.createUser = function(){
			userFactory.createUser($scope.newUser);
			$scope.newUser = {};
		}
}]);

app.controller('categoryCtrl', ['$scope', 'categoryFactory',function($scope, categoryFactory){
	$scope.categories = categoryFactory.categories;
	$scope.newCategory = {};
	$scope.createMainCategory = function(){
		categoryFactory.createCategory($scope.newCategory);
		$scope.newCategory = {};
	}
	$scope.updateCategory = function(category){
		categoryFactory.updateCategory(category);
	}
	$scope.deleteCategory = function(category){
		categoryFactory.deleteCategory(category);
	}
}]);