(function() {
"use strict";

angular.module('SeniorApisModule')
.component('loading', {
  template: '<img src="../images/spinner.svg" ng-if="$ctrl.show">',
  controller: LoadingController
});


LoadingController.$inject = ['$rootScope'];
function LoadingController ($rootScope) {
  var $ctrl = this;
  var listener;

  $ctrl.$onInit = function() {
    console.log("--> LoadingController.onInit");
    $ctrl.show = false;
    listener = $rootScope.$on('spinner:activate', onSpinnerActivate);
    console.log("<-- LoadingController.onInit");
  };

  $ctrl.$onDestroy = function() {    
    console.log("--> LoadingController.onDestroy");
    listener();
    console.log("<-- LoadingController.onDestroy");
  };

  function onSpinnerActivate(event, data) {    
    console.log("--> LoadingController.onSpinnerActivate");
    $ctrl.show = data.on;
    console.log("<-- LoadingController.onSpinnerActivate");
  }
}

})();
