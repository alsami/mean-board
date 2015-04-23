var app = angular.module('meanBoard', ['ngRoute']);

app.config(['$routeProvider', 
	function($routeProvider){
	$routeProvider
		.when('/category', {
			templateUrl: './partials/category.html',
			controller: 'categoryCtrl',
			resolve:{
				postPromise: ['categoryFactory', function(categoryFactory){
					return categoryFactory.getAllCategories();
				}]
			}
			
		})
		.when('/home', {
			templateUrl: './partials/home.html'
		})
		.otherwise({
			redirectTo: '/home',
			templateUrl: './partials/home.html'
		});
	}
]);

app.factory('categoryFactory', ['$http', 
	function($http){
		var categoryObject = {
			categories : [/*{title: 'hallo'}*/]
		}
		
		categoryObject.getAllCategories = function(){
			return $http.get('/api/category').success(function(data){
					angular.copy(data, categoryObject.categories);
			});
		}
		
		categoryObject.createCategory = function(category){
			return $http.post('api/category', category).success(function(data){
				categoryObject.categories.push(data)
			});
		}
		
		console.log(categoryObject)
		return categoryObject;
	}
])

app.controller('RegisterCtrl', ['$scope', '$http', function($scope, $http){
	$scope.newUser = {};
	$scope.registerUser = function(){
		$http({
			method: 'POST',
			url: '/api/user',
			data: $scope.newUser
		}).success(function (data, status, headers, config) {
			$scope.newUser = {}
			console.log(data);
		}).error(function (data, status, headers, config) {
			alert(data);
		});
	}
}]);

app.controller('categoryCtrl', [
	'$scope', 
	'categoryFactory',
	function($scope, categoryFactory){
		console.log("Hallo")
		$scope.categories = categoryFactory.categories;
		$scope.title = ''
		$scope.createMainCategory = function(){
			categoryFactory.createCategory({title: $scope.title});
		}
	}
]);