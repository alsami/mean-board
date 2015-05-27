var messageModule = angular.module('message', []);

messageModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('userSendMessage', {
			url: '/user/{id}/sendMessage',
			views: {
				'body': {
					templateUrl: './partials/user.message.html',
					controller: 'userSendMessageCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
					user: ['$stateParams', 'userFactory', function($stateParams, userFactory) {
						return userFactory.getSingleUser($stateParams.id);
					}]
				}
		})
    .state('userInbox', {
			url: '/userInbox',
			views: {
				'body': {
					templateUrl: './partials/user.inbox.html',
					controller: 'userInboxCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
					messages: ['$stateParams', 'userFactory', function($stateParams, userFactory) {
						return userFactory.getMessages();
					}]
				}
		});
}]);

messageModule.factory('messageFactory', ['$http', function($http){
  messageObject = {};

  messageObject.create = function(message, callback){
    $http.post('/api/message', message)
      .success(function(data){
      	callback(data);
      })
  	.error(function(error){
  		alert(error);
  	});
  };

  return messageObject;
}]);

messageModule.controller('userSendMessageCtrl', ['$scope', 'messageFactory', 'user', function ($scope, messageFactory, user) {
	$scope.user = user.data;
  $scope.message = {};
  $scope.message.to = $scope.user._id;
  $scope.message.from = $scope.$parent.authUser._id;
  $scope.messageCreated = false;

	$scope.submitMessage = function() {
    messageFactory.create($scope.message, function(data) {
      $scope.messageCreated = true;
    });
	}
}]);

messageModule.controller('userInboxCtrl', ['$scope', 'messages', function ($scope, messages) {
	$scope.messages = messages.data;
  console.log($scope.messages)
}]);
