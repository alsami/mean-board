var boardModule = angular.module('board', ['category']);

boardModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('board', {
			url: '/board',
			views: {
				'navbar' : {
						templateUrl: './partials/navbar.html'
					},
				'body' : {
					templateUrl: './partials/board.html',
					controller: 'mBoardCtrl'
				},
				'main@board' : {
					templateUrl: './partials/board.main.html'
				},
				'administrative@board': {
					templateUrl: './partials/board.administrative.html'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			}
		});
}]);

boardModule.controller('mBoardCtrl', ['$scope', 'categoryFactory', function($scope, categoryFactory){
	$scope.category = {};
	$scope.newCategory = {};
	$scope.subParent = null;

	$scope.$on('$stateChangeSuccess', function () {
		$scope.setCategory();
	});

	$scope.setCategory = function(){
		var promise = categoryFactory.getAllCategories();
		promise.then(function(result){
			$scope.category = result.data;
		});
	}

	$scope.setSubParent = function(obj){
		$scope.subParent = obj.subParent;
		//$scope.newCategory.parent = $scope.subParent;
		console.log($scope.subParent);
	}

	$scope.createCategory = function(){
		if($scope.subParent != null){
			$scope.newCategory.parent = $scope.subParent;
			$scope.subParent = null;
		}
		categoryFactory.createCategory($scope.newCategory, function(callback){
			$scope.setCategory();
			$scope.newCategory = {};
		});
	}
}]);

boardModule.controller('categoryCtrlOld', ['$scope', '$location', '$stateParams', 'categoryFactory', 'category', function($scope, $location, $stateParams, categoryFactory, category){
	$scope.isSingleCategorySelected = ($stateParams.id == undefined ? false : true)
	$scope.category = category.data;
	console.log($scope.category);
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
}]);
