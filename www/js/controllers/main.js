app.controller("MainCtrl", function($scope, itemsService) {

  $scope.items = itemsService.get();

});