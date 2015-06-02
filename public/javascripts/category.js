var categoryModule = angular.module('category', []);

categoryModule.factory('categoryFactory', ['$http', function($http){
	var categoryFactory = {};

	categoryFactory.createCategory = function(category, callback){
		console.log(category);
    return $http.post('/api/category', category).success(function(){
      callback();
		})
    .error(function(error){
      alert(error);
    });
	}

	categoryFactory.updateCategory = function(category){
		return $http.put('/api/category/' + category._id, category).success(function(data){
			categoryFactory.getAllCategories();
		});
	}

	categoryFactory.deleteCategory = function(category){
		return $http.delete('/api/category/' + category._id, category).success(function(data){
			return data;
		});
	}

	categoryFactory.getCategory = function(categoryId){
		return $http.get('/api/category/' + categoryId).success(function(data){
			return data;
		});
	}

	categoryFactory.getAllCategories = function(){
		return $http.get('/api/category').success(function(data){
			return data;
		});
	}

	return categoryFactory;
}]);

categoryModule.controller('categoryCtrl', ['$scope', '$stateParams', 'categoryFactory', function($scope, $stateParams, categoryFactory){
	$scope.category = {};
	$scope.newCategory = {};
	$scope.subParent = null;

	$scope.$on('$stateChangeSuccess', function(){
		$scope.initializeValues();
	});

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

	$scope.createCategory = function(){
		if($scope.subParent != null){
			$scope.newCategory.parent = $scope.subParent;
			$scope.subParent = null;
		}
		categoryFactory.createCategory($scope.newCategory, function(callback){
			$scope.initializeValues();
			$scope.newCategory = {};
		});
	}

	$scope.setSubParent = function(obj){
		$scope.subParent = obj.subParent;
	}

	$scope.isSingleCategorySelected = function(){
		return $stateParams.categoryId !== undefined ? true : false;
	}

	$scope.isDeepestCategory = function(){
		//return $scope.category.parent.parent != null ? true : false;
		console.log($scope.category.parent.parent);
	}
}]);
