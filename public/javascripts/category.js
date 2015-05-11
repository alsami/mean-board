var categoryModule = angular.module('category', []);

categoryModule.factory('categoryFactory', ['$http', function($http){
	var categoryFactory = {};

	categoryFactory.createCategory = function(category, callback){
		console.log(category);
    return $http.post('/api/category', category).success(function(){
      callback();
		})
    .error(function(error){
      console.log(error);
    });
	}

	categoryFactory.updateCategory = function(category){
		return $http.put('/api/category/' + category._id, category).success(function(data){
			categoryFactory.getAllCategories();
		});
	}

	categoryFactory.deleteCategory = function(category){
		return $http.delete('/api/category/' + category._id, category).success(function(data){
			//categoryFactory.categoryJSON.splice(categoryFactory.categoryJSON.indexOf(category), 1);
		});
	}

	categoryFactory.getSingleCategory = function(categoryId){
		return $http.get('/api/category/' + categoryId).success(function(data){
			//console.log(data);
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
