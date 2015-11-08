var app = angular.module("app", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'www/partials/index.html',
      controller: 'IndexCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.run(function() {

});