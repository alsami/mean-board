var app = angular.module('meanBoard', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');
	
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
					return categoryFactory.getSingleCategory($stateParams.id);
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
		category : []
	}
	
	categoryObject.createCategory = function(category){
		return $http.post('/api/category', category).success(function(data){
			if(category.parent == null){
				categoryObject.category.push(data)
			}else if(category.parent != null && category.parent.parent == null){
				categoryObject.category[categoryObject.category.indexOf(category.parent)].categories.push(category);
			}else{
				//console.log(category.parent)
				//console.log(categoryObject.category[categoryObject.category.indexOf(category.parent)]);
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
			categoryObject.category.splice(categoryObject.category.indexOf(category), 1);
		});
	}
	
	categoryObject.getSingleCategory = function(categoryId){
		return $http.get('/api/category/' + categoryId).success(function(data, status, headers, config){
			return data;
		});
	}
	
	categoryObject.getAllCategories = function(){
		return $http.get('/api/category').success(function(data){
			angular.copy(data, categoryObject.category);
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
	$scope.category = categoryFactory.category;
	$scope.subParent = null;
	$scope.newCategory = {};
	$scope.createCategory = function(){
		if($scope.subParent != null){
			$scope.newCategory.parent = $scope.subParent;
			$scope.subParent = null;
		}
		categoryFactory.createCategory($scope.newCategory);
		$scope.newCategory = {};
		/*
		if(categoryFactory.createCategory($scope.newCategory)){
			if($scope.newCategory.parent == null){
				$scope.category.push($scope.newCategory);
			}else{
				//console.log($scope.category.indexOf($scope.newCategory.parent));
				$scope.category[$scope.category.indexOf($scope.newCategory.parent)].categories.push($scope.newCategory);
			}
		}
		*/
	}
	$scope.updateCategory = function(category){
		categoryFactory.updateCategory(category);
	}
	$scope.deleteCategory = function(category){
		categoryFactory.deleteCategory(category);
		/*
		if(categoryFactory.deleteCategory(category)){
			$scope.category.splice($scope.category.indexOf(category), 1);
		}
		*/
	}
}]);

app.controller('categoryCtrl', ['$scope', 'categoryFactory', 'category', function($scope, categoryFactory, category){
	$scope.category = category.data;
	console.log($scope.category)
}]);