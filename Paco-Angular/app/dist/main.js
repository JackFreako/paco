var demoApp = angular.module('demoApp', [
  'ngRoute',
  'ngMaterial'
  ]);

demoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/demo/:experimentIdx', {
      templateUrl: 'partials/demo.html',
      controller: 'DemoCtrl',
    }).
    when('/demo/', {
      redirectTo: '/demo/1'
    }).
    otherwise({
      redirectTo: '/demo/1'
    });
  }]);


demoApp.controller('DemoCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog) {
  $scope.alert = '';
  $scope.showAlert = function(ev) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('This is an alert title')
        .content('You can specify some description text in here.')
        .ariaLabel('Password notification')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
}]);