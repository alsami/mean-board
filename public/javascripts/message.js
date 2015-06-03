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
					messages: ['$stateParams', 'messageFactory', function($stateParams, messageFactory) {
						return messageFactory.getMessages();
					}]
				}
		})
		.state('inboxMessage', {
			url: '/message/{id}',
			views: {
				'body': {
					templateUrl: './partials/inbox.message.html',
					controller: 'inboxMessageCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
					message: ['$stateParams', 'messageFactory', function($stateParams, messageFactory) {
						return messageFactory.getMessage($stateParams.id);
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

	messageObject.getMessages = function() {
		return $http.get('/api/message/inbox').success(function(data) {
			return data;
		});
	};

	messageObject.getMessage = function(id) {
		return $http.get('/api/message/' + id).success(function(data) {
			return data;
		});
	};

	messageObject.markAsRead = function(message) {
		message.isRead = true;
		return $http.put('/api/message/' + message._id, message).success(function(data) {
			return data;
		});
	};

	messageObject.deleteMessage = function(id) {
		return $http.delete('/api/message/' + id).success(function(data) {
			return data;
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

messageModule.controller('userInboxCtrl', ['$scope', 'messages', 'messageFactory', function ($scope, messages, messageFactory) {
	$scope.messages = messages.data;
	$scope.orderBy = "-createdAt";

	$scope.deleteMessage = function(message) {
		messageFactory.deleteMessage(message._id);
		$scope.messages.splice($scope.messages.indexOf(message), 1);
	}
}]);

messageModule.controller('inboxMessageCtrl', ['$scope', 'message', 'messageFactory', function ($scope, message, messageFactory) {
	$scope.message = message.data[0];
	if (!$scope.message.isRead)
		messageFactory.markAsRead($scope.message);

	$scope.answer = {};
  $scope.answer.to = $scope.message.from._id;
  $scope.answer.from = $scope.$parent.authUser._id;
	if ($scope.message.subject.substring(0, 4) != "AW: ")
		$scope.answer.subject = "AW: " + $scope.message.subject;
	else
		$scope.answer.subject = $scope.message.subject;
	$scope.messageCreated = false;

	$scope.submitMessage = function() {
    messageFactory.create($scope.answer, function(data) {
      $scope.messageCreated = true;
    });
	}
}]);
