var postModule = angular.module('post', []);

postModule.factory('postFactory', ['$http', function($http){
	var postObject = {
		postJSON : []
	}

	postObject.createPost = function(post){
		return $http.post('/api/post', post).success(function(data){
			alert("Success! Post created.");
		});
	}

	return postObject;
}]);

postModule.controller('postCtrl', ['$scope', '$stateParams', 'postFactory', function($scope, $stateParams, postFactory){

}]);
