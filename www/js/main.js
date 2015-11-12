var app = angular.module("app", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'www/partials/main.html',
      controller: 'MainCtrl'
    })    
    .when('/equity', {
      templateUrl: 'www/partials/equity.html',
      controller: 'EquityCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.run(function() {

});

app.filter('safe', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
});