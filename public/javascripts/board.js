var boardModule = angular.module('board', ['category', 'thread', 'post']);

boardModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
	.state('board', {
		url: '/board',
		views: {
			'body' : {
				templateUrl: './partials/board.html',
				controller: 'categoryCtrl'
			},
			'category@board' : {
				templateUrl: './partials/board.category.html'
			},
			'administrative@board': {
				templateUrl: './partials/board.administrative.html'
			},
			'modal': {
				templateUrl: './partials/user.register.html'
			}
		}
	})
	.state('categoryById', {
		url: '/board/category?categoryId',
		views: {
			'body': {
				templateUrl: './partials/board.html',
				controller: 'categoryCtrl'
			},
			'modal': {
				templateUrl: './partials/user.register.html'
			},
			'category@categoryById': {
				templateUrl: './partials/board.category.html'
			},
			'thread@categoryById': {
				templateUrl: './partials/board.thread.html'
			}
		}
	})
	.state('create-thread', {
		url: '/board/category/create-thread?categoryId',
		views: {
			'body': {
				templateUrl: './partials/thread.html',
				controller: 'createThreadCtrl',
			},
			'thread-create-view@create-thread': {
				templateUrl: './partials/thread.create.html',
			},
			'modal': {
				templateUrl: './partials/user.register.html'
			}
		},
		resolve: {
			category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory){
				return categoryFactory.getCategory($stateParams.categoryId);
			}]
		}
	})
	.state('view-thread', {
		url: '/board/category/thread?categoryId&threadId',
		views: {
			'body': {
				templateUrl: './partials/thread.html',
				controller: 'basicThreadCtrl',
			},
			'thread-view@view-thread': {
				templateUrl: './partials/thread.view.html',
			},
			'modal': {
				templateUrl: './partials/user.register.html'
			}
		},
		resolve: {
			category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory){
				return categoryFactory.getCategory($stateParams.categoryId);
			}],
			thread: ['$stateParams', 'threadFactory', function($stateParams, threadFactory){
				return threadFactory.getThread($stateParams.threadId);
			}]
		}
	})
	.state('view-post', {
		url: '/board/category/thread/post?postId',
		views: {
			'body' : {
				templateUrl: './partials/post.html',
				controller: 'postCtrl'
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
