var boardElements = angular.module("board", []);

boardElements.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('board', {
			url: '/board',
			views: {
				'navbar' : {
						templateUrl: './partials/navbar.html'
					},
				'body' : {
					templateUrl: './partials/board.html',
					controller: 'boardCtrl',
					resolve:{
						postPromise: ['categoryFactory', function(categoryFactory){
							return categoryFactory.getAllCategories();
						}]
					}
				},
				'modal-register' : {
					templateUrl: './partials/modal_register.html'
				}
			}
		});
}]);

boardElements.factory('categoryFactory', ['$http', function($http){
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
				// TODO find out how to push a sub-sub item to it's parent
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
		return $http.get('/api/category/' + categoryId).success(function(data){
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

boardElements.controller('boardCtrl', ['$scope', 'categoryFactory', function($scope, categoryFactory){
	$scope.category = categoryFactory.category;
	$scope.subParent = null;
	$scope.newCategory = {};
	$scope.createCategory = function(){
		if($scope.subParent != null){
			$scope.newCategory.parent = $scope.subParent;
			$scope.subParent = null;
		}
		categoryFactory.createCategory($scope.newCategory);
		console.log("I am here");
		$scope.newCategory = {};
	}
	$scope.updateCategory = function(category){
		categoryFactory.updateCategory(category);
	}
	$scope.deleteCategory = function(category){
		categoryFactory.deleteCategory(category);
	}
}]);
