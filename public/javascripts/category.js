var categoryModule = angular.module('category', []);


categoryModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('categoryById', {
			url: '/board/category?categoryId',
			views: {
				'body': {
					templateUrl: './partials/board.html',
					controller: 'categoryCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				},
				'category@categoryById': {
					templateUrl: './partials/board.category.html'
				},
				'thread@categoryById': {
					templateUrl: './partials/board.thread.html'
				}
			},
			resolve: {
					category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory) {
						return categoryFactory.getCategory($stateParams.categoryId);
					}]
				}
		});
}]);


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

categoryModule.controller('categoryCtrl', ['$scope', '$location', 'category', function($scope, $location, category){
	$scope.category = category.data;
}]);
