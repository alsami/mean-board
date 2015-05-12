var postModule = angular.module('post', []);

// TODO: Add config state for single post-view

postModule.factory('postFactory', ['$http', function($http){
	var postObject = {};

	postObject.createPost = function(post, callback){
		return $http.post('/api/post', post).success(function(){
			callback();
		});
	}

	postObject.updatePost = function(post, callback){
		return $http.put('/api/post/' + post._id, post).success(function(data){
			console.log(data);
		})
		.error(function(error){
			alert(error);
		});
	}

	return postObject;
}]);

// This controller will be used for cases, where a single post will be shown
// To make this possible we'll need to papulate threads parent categories!
postModule.controller('postCtrl', ['$scope', '$stateParams', 'postFactory', function($scope, $stateParams, postFactory){

}]);
