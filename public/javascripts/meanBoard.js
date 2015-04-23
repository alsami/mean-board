var app = angular.module('meanBoard', ['ngRoute']);

app.config(['$routeProvider', 
	function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: './partials/category.html',
			controller: 'categoryCtrl'
			/*,
			resolve: {
				postPromise: ['categoryFactory'],
					function(categoryFactory){
						return categoryFactory.getAllCategories();
					}
			}
			*/
		})
		.otherwise({redirectTo: '/'});
	}
]);

app.factory('categoryFactory', ['$http', 
	function($http){
		var categoryObject = {
			categories: [
				{				
					title: 'Category 1',
					parent: null,
					categories: {},
					threads: {},
					lastPost: {},
					deletedAt: null
				},
				{				
					title: 'Category 2',
					parent: null,
					categories: {},
					threads: {},
					lastPost: {},
					deletedAt: null
				},
				{				
					title: 'Category 3',
					parent: null,
					categories: {},
					threads: {},
					lastPost: {},
					deletedAt: null
				},
				{				
					title: 'Category 4',
					parent: null,
					categories: {},
					threads: {},
					lastPost: {},
					deletedAt: null
				},
				{				
					title: 'Category 5',
					parent: null,
					categories: {},
					threads: {},
					lastPost: {},
					deletedAt: null
				}
			]
		}
		
		categoryObject.getCategoryById = function(categoryId){
			return $http.get('/api/category' + categoryId).then(
				function(res){
					return res.data;
				}
			)
		}
		
		categoryObject.getAllCategories = function(){
			return $http.get('/api/category').success(
				function(data){
					angular.copy(data, categoryObject.categories);
				}
			)
		}
		
		categoryObject.updateCategoryById = function(category){
			$http.put('/api/' + category._id, category);
		}
		
		categoryObject.deleteCategoryById = function(categoryId){
			return $http.delete('/api/' + categoryId);
		}
		
		return categoryObject;
	}
])

app.controller('categoryCtrl', [
	'$scope', 
	'$http', 
	'categoryFactory',
	function($scope, $http, categoryFactory){
		$scope.categories = categoryFactory.categories;
	}
]);