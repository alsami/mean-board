var categoryModule = angular.module("category", []);

categoryModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('board', {
			url: '/board',
			views: {
				'navbar' : {
						templateUrl: './partials/navbar.html'
					},
				'body' : {
					templateUrl: './partials/category.html',
					controller: 'categoryCtrl',
					resolve:{
						category: ['categoryFactory', function(categoryFactory){
							return categoryFactory.getAllCategories();
						}]
					}
				},
				'modal' : {
					templateUrl: './partials/modal_register.html'
				}
			}
		})
		.state('categoryById', {
			url: '/board/{id}',
			views : {
				'navbar' : {
					templateUrl: './partials/navbar.html'
				},
				'body' : {
					templateUrl: './partials/category.html',
					controller: 'categoryCtrl',
					resolve: {
						category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory) {
							return categoryFactory.getSingleCategory($stateParams.id);
						}]
					}
				},
				'modal' : {
					templateUrl: './partials/modal_register.html',
				}
			}
		});
}]);

categoryModule.factory('categoryFactory', ['$http', function($http){
	var categoryObject = {
		categoryJSON : []
	}

	categoryObject.createCategory = function(category, callback){
		return $http.post('/api/category', category).success(function(data){
			if(category.parent == null || category.parent.categories == undefined){
				//console.log("board.js - factory - createCategory() data is:");
				console.log(category);
				categoryObject.categoryJSON.push(data)
			// we have a single parent category
			}else if(category.parent != null && category.parent.parent == null){
				categoryObject.categoryJSON[categoryObject.categoryJSON.indexOf(category.parent)].categories.push(data);
			// we have two parent categories
			}else{
				// with the first loop we will find all subparent of our root parent category
				var parentFound = false;
				for(var i = 0; i < categoryObject.categoryJSON.length; i++){
					if(categoryObject.categoryJSON[i]._id == category.parent.parent){
						// we found the root category
						// "parentFound" is set true. it will break the outerloop when we have finished pushing the new data
						parentFound = true;
						// this inner loop will iterate through all Subparent category
						for(var j = 0; j < categoryObject.categoryJSON[i].categories.length; j++){
							// we have now found the actual parent ob our new data
							if(categoryObject.categoryJSON[i].categories[j]._id == category.parent._id){
								// push it and break this loop too
								categoryObject.categoryJSON[i].categories[j].categories.push(data);
								break;
							}
						}
						if(parentFound)
							break;
					}
				}
			}
			callback(categoryObject.categoryJSON);
		});
	}

	categoryObject.updateCategory = function(category){
		return $http.put('/api/category/' + category._id, category).success(function(data){
			categoryObject.getAllCategories();
		});
	}

	categoryObject.deleteCategory = function(category){
		return $http.delete('/api/category/' + category._id, category).success(function(data){
			categoryObject.categoryJSON.splice(categoryObject.categoryJSON.indexOf(category), 1);
		});
	}

	categoryObject.getSingleCategory = function(categoryId){
		return $http.get('/api/category/' + categoryId).success(function(data){
			return data;
		});
	}

	categoryObject.getAllCategories = function(){
		return $http.get('/api/category').success(function(data){
			angular.copy(data, categoryObject.categoryJSON);
		});
	}

	return categoryObject;
}]);

categoryModule.controller('categoryCtrl', ['$scope', '$location', '$stateParams', 'categoryFactory', 'category', function($scope, $location, $stateParams, categoryFactory, category){
	$scope.isSingleCategorySelected = ($stateParams.id == undefined ? false : true)
	$scope.category = category.data;
	$scope.subParent = null;
	$scope.newCategory = {};
	$scope.createCategory = function(){
		if($scope.subParent != null){
			$scope.newCategory.parent = $scope.subParent;
			$scope.subParent = null;
		}
		categoryFactory.createCategory($scope.newCategory, function(data){
			$scope.category = data;
			$scope.newCategory = {};
		});
	}

	$scope.redirectTo = function(url, categoryId){
		$location.search('categoryId', categoryId).path(url);
	}

	$scope.updateCategory = function(category){
		categoryFactory.updateCategory(category);
	}
	$scope.deleteCategory = function(category){
		categoryFactory.deleteCategory(category);
	}
}]);
