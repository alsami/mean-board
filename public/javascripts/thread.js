var threadModule = angular.module('thread', ['category', 'post']);

threadModule.factory('threadFactory', ['$http', function($http){
	var threadObject = {
		threadJSON : []
	}

	threadObject.createThread = function(thread, callback){
		return $http.post('/api/thread', thread).success(function(data){
			callback(data);
		})
		.error(function(error){
			console.log(error);
		});
	}

	threadObject.getThread = function(threadId){
		return $http.get('/api/thread/' + threadId).success(function(data){
			return data;
		});
	}

	return threadObject;
}]);

threadModule.controller('createThreadCtrl', ['$scope', '$state', 'threadFactory', 'postFactory', 'category', function($scope, $state, threadFactory, postFactory, category){
	$scope.category = category.data;
	$scope.newThread = { parent : $scope.category};
	$scope.newPost = {};
	$scope.createThread = function(){
		threadFactory.createThread($scope.newThread, function(thread){
			$scope.newPost.parent = thread;
			postFactory.createPost($scope.newPost, function(){
				$state.go('view-thread', {'categoryId' : $scope.category._id, 'threadId' : thread._id});
			});
		});
	}
}]);

threadModule.controller('basicThreadCtrl', ['$scope', '$state', 'threadFactory', 'postFactory', 'category', 'thread', function($scope, $state, threadFactory, postFactory, category, thread){
	$scope.thread = thread.data;
	console.log($scope.thread.posts);
	$scope.category = category.data;
	$scope.newPost = { parent : $scope.thread };
	$scope.editationEnabled = false;
	$scope.editItemId = null;

	$scope.createPost = function(){
		postFactory.createPost($scope.newPost, function(data){
			$scope.thread.posts.push(data);
			$scope.newPost = {};
		});
	}

	$scope.isPostUpdated = function(updatedAt){
		return postFactory.isPostUpdated(updatedAt);
	}

	$scope.isPostDeleted = function(deletedAt){
		return postFactory.isPostDeleted(deletedAt);
	}

	$scope.updatePost = function(post){
		postFactory.updatePost(post, function(data){
			$scope.thread.posts[$scope.thread.posts.indexOf(post)] = data;
			$scope.enableEditation(false, null);
		});
	}

	$scope.openPostState = function(postId){
		$state.go('view-post', {'postId' : postId})
	}

	$scope.deletePost = function(post){
		postFactory.deletePost(post._id, function(data){
			$scope.thread.posts[$scope.thread.posts.indexOf(post)] = data;
		});
	}

	$scope.quotePost = function(post){
		console.log("Not implemented yet.");
	}

	$scope.enableEditation = function(boolEnable, editItemId){
		$scope.editationEnabled = boolEnable;
		$scope.editItemId = editItemId;
	}
}]);
