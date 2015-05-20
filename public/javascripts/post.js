var postModule = angular.module('post', ['category', 'thread']);

postModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('post', {
			url: '/board/category/thread/view-post?categoryId&threadId&postId',
			views: {
				'navbar' : {
						templateUrl: './partials/navbar.html'
					},
				'body' : {
					templateUrl: './partials/board.thread.html',
					controller: 'postCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
				category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory){
						return categoryFactory.getCategory($stateParams.categoryId);
				}],
				thread: ['$stateParams', 'threadFactory', function($stateParams, threadFactory){
						return threadFactory.getThread($stateParams.threadId);
				}],
				post: ['$stateParams', 'postFactory', function($stateParams, postFactory){
					return postFactory.getPost($stateParams.postId);
				}]
			}
		});
}]);

postModule.factory('postFactory', ['$http', function($http){
	var postObject = {};

	postObject.createPost = function(post, callback){
		return $http.post('/api/post', post).success(function(data){
			callback(data);
		});
	}

	postObject.getPost = function(postId){
		return $http.get('/api/post/' + postId).success(function(data){
			return data;
		});
	}

	postObject.updatePost = function(post, callback){
		return $http.put('/api/post/' + post._id, post).success(function(data){
			callback(data);
		})
		.error(function(error){
			alert(error);
		});
	}

	postObject.deletePost = function(postId, callback){
		return $http.delete('/api/post/' + postId).success(function(data){
			callback(data);
		})
	}

	return postObject;
}]);

// This controller will be used for cases, where a single post will be shown
// To make this possible we'll need to populate parent thread and parent categories!
postModule.controller('postCtrl', ['$scope', 'postFactory', 'category', 'thread', 'post', function($scope, postFactory, category, thread, post){
	$scope.post = post.data;
	$scope.thread = thread.data;
	$scope.category = category.data;
	console.log($scope.post);
}]);
