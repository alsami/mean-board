var postModule = angular.module('post', ['category', 'thread']);

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
postModule.controller('postCtrl', ['$scope', 'postFactory', 'dataArray', function($scope, postFactory, dataArray){
	$scope.post = dataArray.data[0];
	$scope.thread = $scope.post.parent;
	$scope.category = $scope.thread.parent;
	console.log($scope.category);


	$scope.isPostUpdated = function(updatedAt){
		return postFactory.isPostUpdated(updatedAt);
	}

	$scope.isPostDeleted = function(deletedAt){
		return postFactory.isPostDeleted(deletedAt);
	}
}]);
