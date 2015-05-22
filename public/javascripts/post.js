var postModule = angular.module('post', ['category', 'thread']);

postModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('view-post', {
			url: '/board/category/thread/post?postId',
			views: {
				'body' : {
					templateUrl: './partials/post.html',
					controller: 'postCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
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
		return $http.put('/api/post/' + (post._id == undefined ? post[0]._id : post._id), post).success(function(data){
			callback(data);
		})
		.error(function(error){
			console.log(error);
		});
	}

	postObject.deletePost = function(postId, callback){
		return $http.delete('/api/post/' + postId).success(function(data){
			callback(data);
		});
	}

	postObject.isPostUpdated = function(updatedAt){
		return updatedAt != null ? true : false;
	}

	postObject.isPostDeleted = function(deletedAt){
		return deletedAt != null ? true : false;
	}

	return postObject;
}]);

// This controller will be used for cases, where a single post will be shown
postModule.controller('postCtrl', ['$scope', 'postFactory', 'post', function($scope, postFactory, post){
	$scope.post = post.data;
	$scope.isEditationEnabled = false;
	$scope.updatePost = function(post){
		postFactory.updatePost(post, function(data){
			$scope.post[0] = data;
			$scope.enableEditation(false);
		});
	}

	$scope.isPostUpdated = function(updatedAt){
		return postFactory.isPostUpdated(updatedAt);
	}

	$scope.isPostDeleted = function(deletedAt){
		return postFactory.isPostDeleted(deletedAt);
	}

	$scope.quotePost = function(post){
		console.log("Not implemented yet.");
	}

	$scope.enableEditation = function(boolEnable){
		$scope.isEditationEnabled = boolEnable;
	}
}]);
