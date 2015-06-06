// this module serves to handle post
var postModule = angular.module('post', []);

// the singleton factory for basic post-functions
postModule.factory('postFactory', ['$http', function($http){
	var postObject = {};

	// creating a post and returning the data on success
	// the controller will then change the scope-object to display the new post right away
	postObject.createPost = function(post, callback){
		return $http.post('/api/post', post).success(function(data){
			callback(data);
		});
	}

	// get a single post by id
	postObject.getPost = function(postId){
		return $http.get('/api/post/' + postId).success(function(data){
			return data;
		});
	}

	// update a post by id and return the updated data
	postObject.updatePost = function(post, callback){
		return $http.put('/api/post/' + post._id, post).success(function(data){
			callback(data);
		})
		.error(function(error){
			console.log(error);
		});
	}

	// delete a given post by id
	postObject.deletePost = function(postId, callback){
		return $http.delete('/api/post/' + postId).success(function(data){
			callback(data);
		});
	}

	// helper function to check whether the post has been updated already or not
	postObject.isPostUpdated = function(updatedAt){
		return updatedAt != null ? true : false;
	}

	// helper function to check whether the post has been deleted already or not
	postObject.isPostDeleted = function(deletedAt){
		return deletedAt != null ? true : false;
	}

	// helper function to display the user-type of a post
	postObject.getUserRoleOutput = function(userRole){
		switch(userRole){
			case 'admin':
				return 'Board-Admin'
				break;
			case 'moderator':
				return 'Board-Moderator'
				break;
			case 'user':
				return 'Board-User'
				break;
			default:
				return null;
				break;
		}
	}

	// return the factory object
	return postObject;
}]);

// This controller will be used for cases, where a single post will be shown
postModule.controller('postCtrl', ['$scope', 'postFactory', 'dataArray', function($scope, postFactory, dataArray){
	// initialize objects
	$scope.post = dataArray.data[0];
	// set the posts-parent-thread
	$scope.thread = $scope.post.parent;
	// set the thread-parent-category
	$scope.category = $scope.thread.parent;

	// controller function that passes the updatedAt value to the factory
	// then return true or false
	$scope.isPostUpdated = function(updatedAt){
		return postFactory.isPostUpdated(updatedAt);
	}

	// controller function that passes the deletedAt value to the factory
	// then returns true or false
	$scope.isPostDeleted = function(deletedAt){
		return postFactory.isPostDeleted(deletedAt);
	}

	// controller function that passes the users role to the factory
	// then returns a string that is being displayed on the frontend
	$scope.getUserRoleOutput = function(userRole){
		return postFactory.getUserRoleOutput(userRole);
	}
}]);
