var app = angular.module('meanBoard', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	//$urlRouterProvider.otherwise('/home');
	
	$stateProvider
		.state('board', {
			url: '/board',
			templateUrl: './partials/board.html',
			controller: 'boardCtrl',
			resolve:{
				postPromise: ['categoryFactory', function(categoryFactory){
					return categoryFactory.getAllCategories();
				}]
			}
		})
		.state('category',{
			url: '/category/{id}',
			templateUrl: './partials/category.html',
			controller: 'categoryCtrl',
			resolve: {
				category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory) {
					return categoryFactory.getCategory($stateParams.id);
				}]
			}
		})
		.state('home', {
			url: '/home',
			templateUrl: './partials/home.html'
		});
}]);

app.factory('categoryFactory', ['$http', function($http){
	var categoryObject = {
		categoryJSON : [/*{title: 'hallo'}*/]
	}
	
	categoryObject.createCategory = function(category){
		return $http.post('/api/category', category).success(function(data){
			if(category.parent == null){
				categoryObject.categoryJSON.push(data)
			}else{
				categoryObject.categoryJSON[0].categories.push(data)
			}
		});
	}
	
	categoryObject.updateCategory = function(category){
		return $http.put('/api/category/' + category._id, category).success(function(data){
			categoryObject.getAllCategories();
		});
	}
	
	categoryObject.deleteCategory = function(category){
		return $http.delete('/api/category/' + category._id, category).success(function(data){
			return true;
		})
		.error(function(){
			return false;
		});
	}
	
	categoryObject.getCategory = function(categoryId){
		return $http.get('/api/category/' + categoryId).success(function(res){
			return res.data;
		});
	}
	
	categoryObject.getAllCategories = function(){
		return $http.get('/api/category').success(function(data){
			angular.copy(data, categoryObject.categoryJSON);
		});
	}

	return categoryObject;
}]);



app.factory('userFactory', ['$http', function($http){
	var userObject = {
		users : []
	}
	
	userObject.createUser = function(user){
		return $http.post('/api/user', user).error(function(data){
			alert(data)
		});
	}
	
	userObject.updateUser = function(user){
		return $http.put('/api/user/' + user._id, user).success(function(data){
			userObject.getAllUsers();
		});
	}
	
	userObject.getAllUsers = function(){
		return $http.get('/api/user').success(function(data){
			angular.copy(data, userObject.users);
		});
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

app.controller('boardCtrl', ['$scope', 'categoryFactory', function($scope, categoryFactory){
	$scope.categoryJSON = categoryFactory.categoryJSON;
	$scope.newCategory = {};
	$scope.createCategory = function(){
		categoryFactory.createCategory($scope.newCategory);
		$scope.newCategory = {};
	}
	$scope.updateCategory = function(category){
		categoryFactory.updateCategory(category);
	}
	$scope.deleteCategory = function(category){
		if(categoryFactory.deleteCategory(category)){
			$scope.categoryJSON.splice($scope.categoryJSON.indexOf(category), 1);
		}
	}
}]);

app.controller('categoryCtrl', ['$scope', 'categoryFactory', 'category', function($scope, categoryFactory, category){
	$scope.category = category;
}]);