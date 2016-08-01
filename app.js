'use strict';
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Admin', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'Admin',
    'ngRoute',
    'ngCookies',
    'angularFileUpload',
    'ui.bootstrap',
    'LocalStorageModule'
])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })  
        .when('/editImage', {
            controller: 'ImageController',
            templateUrl: 'modules/home/views/imagePage.html'
        })
        .otherwise({ redirectTo: '/login' });
}])
    .run(['$rootScope', '$location', '$cookieStore', '$http','$upload',
        function ($rootScope, $location, $cookieStore, $http) {
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        $rootScope.$on('$locationChangeStart', function (event, next, current) {            
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser && $location.path() != '/features') {
                $location.path('/login');
            }
        });
    }]);
