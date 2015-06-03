var messageModule = angular.module('message', []);

// state providing for defining routes of templates
messageModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('userSendMessage', {
			// define url
			url: '/user/{id}/sendMessage',
			views: {
				// define template and controller
				'body': {
					templateUrl: './partials/user.message.html',
					controller: 'userSendMessageCtrl'
				},
				'modal': {
					templateUrl: './partials/user.register.html'
				}
			},
			resolve: {
					// get important data for the template
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

// message factory: providing functions for get and set message data
messageModule.factory('messageFactory', ['$http', function($http){
  messageObject = {};

  messageObject.create = function(message, callback){
		// http post for sending data to the backend
    $http.post('/api/message', message)
      .success(function(data){
      	callback(data);
      })
  	.error(function(error){
  		alert(error);
  	});
  };

	messageObject.getMessages = function() {
		// http request for get data from the backend
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

	// return collection of functions
  return messageObject;
}]);

// user send message controller
messageModule.controller('userSendMessageCtrl', ['$scope', 'messageFactory', 'user', function ($scope, messageFactory, user) {
	// build message object and pre filling important data
	$scope.user = user.data;
  $scope.message = {};
  $scope.message.to = $scope.user._id;
  $scope.message.from = $scope.$parent.authUser._id;
  $scope.messageCreated = false;

	// function to submit the message to the backend using message factory
	$scope.submitMessage = function() {
    messageFactory.create($scope.message, function(data) {
      $scope.messageCreated = true;
    });
	}
}]);

// inbox controller
messageModule.controller('userInboxCtrl', ['$scope', 'messages', 'messageFactory', function ($scope, messages, messageFactory) {
	// add the message array to the scope for providing data to the frontend
	$scope.messages = messages.data;
	$scope.orderBy = "-createdAt";

	// function to delete message
	$scope.deleteMessage = function(message) {
		messageFactory.deleteMessage(message._id);
		$scope.messages.splice($scope.messages.indexOf(message), 1);
	}
}]);

// message controller
messageModule.controller('inboxMessageCtrl', ['$scope', 'message', 'messageFactory', function ($scope, message, messageFactory) {
	// add message data to the scope
	$scope.message = message.data[0];
	if (!$scope.message.isRead)
		messageFactory.markAsRead($scope.message);

	// build answer object
	$scope.answer = {};
  $scope.answer.to = $scope.message.from._id;
  $scope.answer.from = $scope.$parent.authUser._id;
	if ($scope.message.subject.substring(0, 4) != "AW: ")
		$scope.answer.subject = "AW: " + $scope.message.subject;
	else
		$scope.answer.subject = $scope.message.subject;
	$scope.messageCreated = false;

	// submit answer to the backend using message factory
	$scope.submitMessage = function() {
    messageFactory.create($scope.answer, function(data) {
      $scope.messageCreated = true;
    });
	}
}]);
