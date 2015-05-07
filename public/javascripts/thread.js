var threadModule = angular.module('thread', ['category']);

threadModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('create-thread', {
			url: '/create-thread?categoryId',
			views: {
				'navbar' : {
						templateUrl: './partials/navbar.html'
					},
				'body' : {
					templateUrl: './partials/thread.html',
					controller: 'threadCtrl',
				}
			},
			resolve : {
				thread : ['threadFactory', function(threadFactory){
					return threadFactory.returnNull();
				}],
				category : ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory){
					return categoryFactory.getSingleCategory($stateParams.categoryId)
				}]
			}
		});
}]);

threadModule.factory('threadFactory', ['$http', function($http){
	var threadObject = {
		threadJSON : []
	}

	threadObject.returnNull = function(){
		return null;
	}

	threadObject.createThread = function(thread){
		return $http.post('/api/thread', thread);
	}

	return threadObject;
}]);

threadModule.controller('threadCtrl', ['$scope', '$stateParams', 'threadFactory', 'category', 'thread', function($scope, $stateParams, threadFactory, category, thread){
	$scope.category = category.data;
	$scope.thread = thread;
	$scope.newThread = {}
	$scope.createThread = function(){
		threadFactory.createThread($scope.thread);
	}
}]);
