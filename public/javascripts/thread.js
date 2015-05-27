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

threadModule.controller('threadCtrl', ['$scope', '$stateParams', '$state', 'threadFactory', 'postFactory', 'category', function($scope, $stateParams, $state, threadFactory, postFactory, category){
	$scope.category = category.data;
	$scope.thread = null;
	$scope.newThread = {};
	$scope.newPost = {};
	$scope.editationEnabled = false;
	$scope.editItemId = null;

	$scope.$on('$stateChangeSuccess', function(){
		$scope.initializeValues();
	});


	$scope.initializeValues = function(){
		if($scope.isThreadSelected()){
			var	promise = threadFactory.getThread($stateParams.threadId)
			promise.then(function(result){
				$scope.thread = result.data;
				$scope.newPost.parent = $scope.thread;
			});
		}else{
			$scope.newThread.parent = $scope.category;
		}
	}

	$scope.createThread = function(){
		threadFactory.createThread($scope.newThread, function(thread){
			$scope.newPost.parent = thread;
			postFactory.createPost($scope.newPost, function(){
				$state.go('view-thread', {'categoryId' : $scope.category._id, 'threadId' : thread._id});
			});
		});
	}

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
		console.log(post.updateReason);
		postFactory.updatePost(post, function(data){
			$scope.thread.posts[$scope.thread.posts.indexOf(post)] = data;
			$scope.editPost = null;
		});
	}

	$scope.deletePost = function(post){
		postFactory.deletePost(post._id, function(data){
			$scope.thread.posts[$scope.thread.posts.indexOf(post)] = data;
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

	$scope.enableEditation = function(post){
		$scope.editPost = post;
	}

	$scope.enableDeletation = function(post){
		$scope.postToDelete = post;
	}

	$scope.isThreadSelected = function(){
		return $stateParams.threadId !== undefined ? true : false;
	}
}]);
