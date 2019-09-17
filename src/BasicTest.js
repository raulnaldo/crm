//Version 1.1
(function () {
'use strict';

angular.module('LunchApp', [])
.controller('LunchCheckController', LunchCheckController);
LunchCheckController.$inject = ['$scope', '$filter'];

function LunchCheckController ($scope, $filter) {
//  $scope.myMessage = function () {
//    return $scope.menu_items;
//  };
  $scope.myMessage="";
  $scope.menu_items="";
  $scope.separeMenuItems = function () {
      $scope.myMessage="";
      var totalItems=CountItemsFromString($scope.menu_items);      
      if (totalItems == 0){
        $scope.myMessage="Please enter data first";
        $scope.menu_items="";
      }
      else{
        if (totalItems < 4){
          $scope.myMessage="Enjoy!";          
        }       
        else{
            $scope.myMessage="Too much!";         
        }
      }
  };

  //function for counting items without spaces.
  var CountItemsFromString = function(pString){
    var myTotalItems=0;
    var arrayOfStrings = pString.split(',');    
    for (var i = 0; i < arrayOfStrings.length; i++) {
      if (arrayOfStrings[i] != ""){
        myTotalItems=myTotalItems+1;
      }
    }
    return myTotalItems;
  };
}

})();

//Minifyed
// !function(){"use strict";function e(e,n){e.myMessage="",e.menu_items="",e.separeMenuItems=function(){e.myMessage="";var n=s(e.menu_items);0==n?(e.myMessage="Please enter data first",e.menu_items=""):4>n?e.myMessage="Enjoy!":e.myMessage="Too much!"};var s=function(e){for(var n=0,s=e.split(","),t=0;t<s.length;t++)""!=s[t]&&(n+=1);return n}}angular.module("LunchApp",[]).controller("LunchCheckController",e),e.$inject=["$scope","$filter"]}();