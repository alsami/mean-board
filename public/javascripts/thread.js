var threadModule = angular.module("thread", []);

threadModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('create-thread', {
			url: '/create-thread/test',
			views: {
				'navbar' : {
						templateUrl: './partials/navbar.html'
					},
				'body' : {
					templateUrl: './partials/thread.html',
					controller: 'threadCtrl',
				}
			}
		});
}]);

threadModule.controller('threadCtrl', ['$scope', '$stateParams', function($scope, $stateParams){

}]);
