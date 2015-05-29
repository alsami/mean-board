var app = angular.module('meanBoard', ['ui.router', 'ui.bootstrap', 'board', 'auth', 'user']);

// Global config
// everything that is not defined in any module used above as dependency, leeds us back home
// home, sweet home :)
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	// You can uncomment this when testing page-routes
	// $urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			views: {
				'body': {
					templateUrl: './partials/home.html',
				},
				'modal': {
					templateUrl: './partials/user.register.html',
				}
			}
		})
}]);

app.filter('breakFilter', function(){
		return function(textInput){
			return textInput ? textInput.replace(/\n/g, '<br />') : '';
		}
});
