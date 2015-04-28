var app = angular.module('meanBoard', ['ui.router', 'auth', 'user', 'board', 'category']);

// Global config
// everything that is not defined in any module used above as dependency, leeds us back home
// home, sweet home :)
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			views : {
				'navbar' : {
					templateUrl: './partials/navbar.html'
				},
				'body' : {
					templateUrl: './partials/home.html',
				},
				'modal-register' : {
					templateUrl: './partials/modal_register.html',
				}
			}
		});
}]);
