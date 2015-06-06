// this module serves to handle threads in a category
var threadModule = angular.module('thread', ['post']);

// the singleton factory for communication with the backend
threadModule.factory('threadFactory', ['$http', function($http){
	var threadObject = {
		threadJSON : []
	}

	// create a thread
	threadObject.createThread = function(thread, callback){
		return $http.post('/api/thread', thread).success(function(data){
			// when successfully created, call back the data so that we can open the thread right away
			callback(data);
		})
		.error(function(error){
			console.log(error);
		});
	}

	// get a thread by id
	threadObject.getThread = function(threadId){
		return $http.get('/api/thread/' + threadId).success(function(data){
			return data;
		});
	}

	return threadObject;
}]);

// Thread Controller
threadModule.controller('threadCtrl', ['$scope', '$stateParams', '$state', 'threadFactory', 'postFactory', 'category', function($scope, $stateParams, $state, threadFactory, postFactory, category){
	// initialize objects
	$scope.category = category.data;
	$scope.thread = null;
	$scope.newThread = {};
	$scope.newPost = {};
	$scope.editationEnabled = false;
	$scope.editItemId = null;

	// same procedure as used for categories
	$scope.$on('$stateChangeSuccess', function(){
		$scope.initializeValues();
	});


	// check whether there is a thread id
	// when there is one, selected it and attach it's data to the scope object
	// if not then set the parent for the thread that might be created
	$scope.initializeValues = function(){
		if($scope.isThreadSelected()){
			var promise = threadFactory.getThread($stateParams.threadId);
			promise.then(function(result){
				$scope.thread = result.data;
				$scope.newPost.parent = $scope.thread;
			});
		}else{
			$scope.newThread.parent = $scope.category;
		}
	}

	// pass the data to the factory and created the new thread
	$scope.createThread = function(){
		threadFactory.createThread($scope.newThread, function(thread){
			// when the thread is created, create the opening post and redirect to it
			$scope.newPost.parent = thread;
			postFactory.createPost($scope.newPost, function(){
				$state.go('view-thread', {'categoryId' : $scope.category._id, 'threadId' : thread._id});
			});
		});
	}

	// creating a new post in a give thread
	$scope.createPost = function(){
		postFactory.createPost($scope.newPost, function(data){
			// push it to the array so that the view changes, when the post has been created
			$scope.thread.posts.push(data);
			$scope.newPost = {};
		});
	}

	// update a single post
	$scope.updatePost = function(post){
		postFactory.updatePost(post, function(data){
			// replace the old post data with the new one
			$scope.thread.posts[$scope.thread.posts.indexOf(post)] = data;
			$scope.editPost = null;
		});
	}

	// delete a post
	$scope.deletePost = function(post){
		postFactory.deletePost(post._id, function(data){
			// replace the old post data with the new one
			$scope.thread.posts[$scope.thread.posts.indexOf(post)] = data;
		});
	}

	// opens the state to view a single post when clicking the give ui-element
	$scope.viewPost = function(postId){
		$state.go('view-post', {'postId' : postId});
	}

	// helper function to check if the post has been updated
	// pass it to the factory function and return true or false
	$scope.isPostUpdated = function(updatedAt){
		return postFactory.isPostUpdated(updatedAt);
	}

	// helper function to check if the post has been updated
	// pass it to the factory function and return true or false
	$scope.isPostDeleted = function(deletedAt){
		return postFactory.isPostDeleted(deletedAt);
	}

	// delete a post
	$scope.deletePost = function(post){
		postFactory.deletePost(post._id, function(data){
			$scope.thread.posts[$scope.thread.posts.indexOf(post)] = data;
		});
	}

	// not implemented yet but would be used to quote a post in a thread
	$scope.quotePost = function(post){
		console.log("Not implemented yet.");
	}

	// enable editation of a post
	$scope.enableEditation = function(post){
		$scope.editPost = post;
	}

	// enable deletation of a post > a modal dialog is being displayed
	$scope.enableDeletation = function(post){
		$scope.postToDelete = post;
	}

	// helper function to check whether a thread is being selected or created.
	$scope.isThreadSelected = function(){
		return $stateParams.threadId !== undefined ? true : false;
	}

	// helper function  - the users role is being passed to the factory and the factory then returns a proper string
	$scope.getUserRoleOutput = function(userRole){
		return postFactory.getUserRoleOutput(userRole);
	}
}]);
