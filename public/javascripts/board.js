// This module only serves as stateProvider
// It injects all other modules that belong to the actual board-part of this software
var boardModule = angular.module('board', ['category', 'thread', 'post']);

boardModule.config(['$stateProvider', function($stateProvider){
	$stateProvider
	<!-- Main Board-Page -->
	.state('board', {
		url: '/board',
		// bind the views
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
	<!-- Viewing a single category -->
	.state('categoryById', {
		url: '/board/category?categoryId',
		// bind the views
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
	<!-- Creating thread -->
	.state('create-thread', {
		url: '/board/category/create-thread?categoryId',
		// bind the views
		views: {
			'body': {
				templateUrl: './partials/thread.html',
				controller: 'threadCtrl',
			},
			'thread-create-view@create-thread': {
				templateUrl: './partials/thread.create.html',
			},
			'modal': {
				templateUrl: './partials/user.register.html'
			}
		},
		// Resolve the parent-category of the thread that is going to be created (if so)
		resolve: {
			category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory){
				return categoryFactory.getCategory($stateParams.categoryId);
			}]
		}
	})
	<!-- Viewing thread -->
	.state('view-thread', {
		url: '/board/category/view-thread?categoryId&threadId',
		// bind the views
		views: {
			'body': {
				templateUrl: './partials/thread.html',
				controller: 'threadCtrl',
			},
			'thread-view@view-thread': {
				templateUrl: './partials/thread.view.html',
			},
			'administrative@view-thread': {
				templateUrl: './partials/thread.administrative.html',
			},
			'modal': {
				templateUrl: './partials/user.register.html'
			}
		},
		// When viewing a thread, we resolve the threads parent category
		// Actually only necessary to display the title of the category in the given breadcrumb
		resolve: {
			category: ['$stateParams', 'categoryFactory', function($stateParams, categoryFactory){
				return categoryFactory.getCategory($stateParams.categoryId);
			}],
		// Resolve the thread that is being viewed
			thread: ['$stateParams', 'threadFactory', function($stateParams, threadFactory){
				return threadFactory.getThread($stateParams.threadId);
			}]
		}
	})
	<!-- Viewing a single post -->
	// This state is used to link to a special post in a thread
	// It might be the solution, it might be an improper post that is being discussed by the board team (admins, mods)
	.state('view-post', {
		url: '/board/category/thread/view-post?postId',
		// bind the views
		views: {
			'body' : {
				templateUrl: './partials/post.html',
				controller: 'postCtrl'
			},
			'modal': {
				templateUrl: './partials/user.register.html'
			}
		},
		// This dataArray resolves a special set of data defined in the mongoose model "Post.js"
		// It is an array that holds the post, the posts parent thread and the threads parent category
		resolve: {
			dataArray: ['$stateParams', 'postFactory', function($stateParams, postFactory){
				return postFactory.getPost($stateParams.postId);
			}]
		}
	});
}]);
