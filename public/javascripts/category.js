// This module serves to handle categories
var categoryModule = angular.module('category', []);

// the factory (signleton! yes it is one) used for communication with the backend
// injecting the http service
categoryModule.factory('categoryFactory', ['$http', function($http){
	var categoryFactory = {};

	// this function creates a category
	categoryFactory.createCategory = function(category, callback){
    return $http.post('/api/category', category).success(function(){
      // callback when successfully created the new category
			callback();
		})
		// log the error if there is one
    .error(function(error){
      alert(error);
    });
	}


	// updating categories
	categoryFactory.updateCategory = function(category){
		return $http.put('/api/category/' + category._id, category).success(function(data){
			categoryFactory.getAllCategories();
		});
	}

	// deleting categories
	categoryFactory.deleteCategory = function(category){
		return $http.delete('/api/category/' + category._id, category);
	}

	// selecting a single category
	// this is needed when a user wants to view a specific category
	// for example /board/category?categoryId=ID_XY
	categoryFactory.getCategory = function(categoryId){
		return $http.get('/api/category/' + categoryId).success(function(data){
			return data;
		});
	}

	// this function loads every available category
	categoryFactory.getAllCategories = function(){
		return $http.get('/api/category').success(function(data){
			// return the data
			return data;
		});
	}

	// return the object
	return categoryFactory;
}]);

// Controller used to handle categories
categoryModule.controller('categoryCtrl', ['$scope', '$stateParams', 'categoryFactory', function($scope, $stateParams, categoryFactory){
	// initialize objects and variables
	$scope.category = {};
	$scope.newCategory = {};
	$scope.subParent = null;

	// this function is being triggerd when the controller, views etc are fully loaded (pageload finished)
	$scope.$on('$stateChangeSuccess', function(){
		// set category value
		$scope.initializeValues();
	});

	// when the page is successfully loaded this function is being triggerd
	// We check whether we have to load all categories or a single one
	// the view then changes
	$scope.initializeValues = function(){
		var promise = null;
		if(!$scope.isSingleCategorySelected()){
			//console.log("/board - all categories displayed");
			promise = categoryFactory.getAllCategories();
			promise.then(function(result){
				$scope.category = result.data;
			});
		}else{
			//console.log("/board/category?categoryIdXY - a single category displayed");
			promise = categoryFactory.getCategory($stateParams.categoryId);
			promise.then(function(result){
				$scope.category = result.data;
			});
		}
	}

	// Creating a category
	$scope.createCategory = function(){
		// check if we have a subparent, and set it if so
		if($scope.subParent != null){
			$scope.newCategory.parent = $scope.subParent;
			$scope.subParent = null;
		}
		// created the category and force the category object to refresh
		categoryFactory.createCategory($scope.newCategory, function(callback){
			$scope.initializeValues();
			$scope.newCategory = {};
		});
	}

	// helper function used by the frontend
	$scope.setSubParent = function(obj){
		$scope.subParent = obj.subParent;
	}

	// helper function used by the frontend
	// when we have a parameter for a category-id a single category was selected
	// and the opposite.
	$scope.isSingleCategorySelected = function(){
		return $stateParams.categoryId !== undefined ? true : false;
	}

	// not being used yet
	$scope.isDeepestCategory = function(){
		//return $scope.category.parent.parent != null ? true : false;
		console.log($scope.category.parent.parent);
	}
}]);
