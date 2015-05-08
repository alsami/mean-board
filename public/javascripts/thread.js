var threadModule = angular.module('thread', ['category', 'post']);

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
		})
		/*
		.state('view-thread',{
			url: '/view-thread?threadId',
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

			}
		})*/;
}]);

threadModule.factory('threadFactory', ['$http', function($http){
	var threadObject = {
		threadJSON : []
	}

	threadObject.returnNull = function(){
		return null;
	}

	threadObject.createThread = function(thread, callback){

		return $http.post('/api/thread', thread).success(function(data){
			callback(data);
		})
		.error(function(error){
			console.log(error);
		});
	}

	return threadObject;
}]);

threadModule.controller('threadCtrl', ['$scope', '$stateParams', 'threadFactory', 'postFactory', 'category', 'thread', function($scope, $stateParams, threadFactory, postFactory, category, thread){
	$scope.category = category.data;
	$scope.thread = thread;
	$scope.newThread = {};
	$scope.newPost = {};
	$scope.createThread = function(){
		$scope.newThread.parent = $scope.category;
		threadFactory.createThread($scope.newThread, function(data){
			$scope.newPost.parent = data;
			postFactory.createPost($scope.newPost);
		});
	}
}]);
