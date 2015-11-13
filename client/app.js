var angular = require('angular');
var ngCookies = require('angular-cookies');
var ui = require('angular-ui-router');

window.app = angular.module('myApp', [
  'ngCookies',
  'ui.router',
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })

    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })

    .state('landing', {
      url: '/landing',
      templateUrl: 'views/landing.html',
      controller: 'LandingCtrl'
    })

    .state('projects', {
      url: '/projects',
      templateUrl: 'views/projects.html',
      controller: ''
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'views/signupForm.html',
      controller: ''
    })

    .state('signin', {
      url: '/signin',
      templateUrl: 'views/signinForm.html',
      controller: ''
    })

    .state('test', {
      url: '/test',
      templateUrl: 'views/testView.html',
      controller: 'ProjectEntryCtrl'
    })
});

require('./factories');
require('./controllers');
require('./directives');
