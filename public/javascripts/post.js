var postModule = angular.module('post', []);

postModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('post', {
			url: '/view-post?postId',
			views: {
				'navbar' : {
						templateUrl: './partials/navbar.html'
					},
				'body' : {
					templateUrl: './partials/board.html',
					controller: 'mainBoardCtrl'
				},
				'main@board' : {
					templateUrl: './partials/board.main.html'
				},
				'administrative@board': {
					templateUrl: './partials/board.administrative.html'
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
postModule.controller('postCtrl', ['$scope', '$stateParams', 'postFactory', 'post', function($scope, $stateParams, postFactory, post){
	$scope.post = post;
}]);
