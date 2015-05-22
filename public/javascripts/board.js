var boardModule = angular.module('board', ['category']);

boardModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('board', {
			url: '/board',
			views: {
				'body' : {
					templateUrl: './partials/board.html',
					controller: 'mainBoardCtrl'
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

boardModule.controller('mainBoardCtrl', ['$scope', 'categoryFactory', function($scope, categoryFactory){
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
