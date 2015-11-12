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

app.run(function($timeout, $window) {

  var adjustAlignment = function() {
    if( $("article").height() < $($window).height()) {
      $("body").addClass("aligned");
    } else {
      $("body").removeClass("aligned");
    }
  };

  $timeout(adjustAlignment, 200);

  $($window).on("resize", adjustAlignment);

});

app.filter('safe', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
});