(function () {
"use strict";

angular.module('SeniorApisModule')
.service('SeniorApisDynamicsService', SeniorApisDynamicsService);


SeniorApisDynamicsService.$inject = ['$http', 'DynamicsEndPoint'];
function SeniorApisDynamicsService($http, DynamicsEndPoint) {
  var service = this;

  service.GetContactByMobilePhone = function(pMobile){
    console.log(">>>> Dynamics.GetContactByMobilePhone()");
    console.log("---->>>> pMobile:",pMobile);    
    var response = $http({
      method: "GET",
      headers: {
         'Content-Type': 'application/json'         
       },
      url: (DynamicsEndPoint +'contacts?$select=firstname,lastname&$filter=mobilephone eq \''+ pMobile +'\'')
    });
    console.log("<<<< Dynamics.GetContactByMobilePhone()");
    return response;
  }

//START ARCHIVING
//*****************************
service.TokboxStartArchiving = function (pSessionId) {
  console.log(">>> service.TokboxStartArchiving(",pSessionId,")")
  var MyToken={};
  var response = $http({
    method: "POST",
    headers: {
      contentType: "application/json", // send as JSON
     },
    url: (HerokuBackEnd + 'archive/start'),
    data: JSON.stringify({"sessionId": pSessionId})
  });
  console.log("<<< service.TokboxStartArchiving()")
  return response;
};


//FIN DE FUNCIONES DE SERVICIO
}//FIN SERVICIO

})();