(function () {
"use strict";

angular.module('SeniorApisModule')
.service('SeniorApisService', SeniorApisService);


SeniorApisService.$inject = ['$http', 'ApiPath','ApiAuthPath','CI360ApiPath','userUid','appUid','DataPath','HerokuBackEnd'];
function SeniorApisService($http, ApiPath,ApiAuthPath,CI360ApiPath,userUid,appUid,DataPath,HerokuBackEnd) {
  var service = this;



  service.____SelectContactById = function(pId,pContacts){
    console.log(">>>> service.SelectContactById()");
    console.log("---->>>> pId:",pId);
    console.log("---->>>> pContacts:",pContacts);

    var IndexPosition=pContacts.findIndex(x => x.Id === pId);

    console.log("  -->>>> Contact Index:",IndexPosition);
    console.log("<<<< service.SelectContactById()");
    return pContacts[IndexPosition];
  }


  service.SelectContactById = function(pId,pContacts){
    console.log(">>>> service.SelectContactById()");
    console.log("---->>>> pId:",pId);
    console.log(">>>> service.getContactsByJson()");
    var response = $http({
      method: "GET",
      headers: {
         'Content-Type': 'application/json'
       },
      url: (HerokuBackEnd +'customerinfobyphone/'+pId)
    });
    console.log("<<<< service.getContactsByJson()");
    return response;
  }

  service.SelectContactLastName = function(pLastName,pContacts){
    console.log(">>>> service.SelectContactLastName()");
    console.log("---->>>> LastName:",pLastName);
    console.log("---->>>> pContacts:",pContacts);

    var IndexPosition=pContacts.findIndex(x => x.LastName.toLocaleLowerCase().includes(pLastName.toLocaleLowerCase()));

    console.log("  -->>>> Contact Index:",IndexPosition);
    console.log("<<<< service.SelectContactLastName()");
    return pContacts[IndexPosition];
  }

  service.SelectContactName = function(pName,pContacts){
    console.log(">>>> service.SelectContactName()");
    console.log("---->>>> Name:",pName);
    console.log("---->>>> pContacts:",pContacts);

    var IndexPosition=pContacts.findIndex(x => x.Name.toLocaleLowerCase().includes(pName.toLocaleLowerCase()));

    console.log("  -->>>> Contact Index:",IndexPosition);
    console.log("<<<< service.SelectContactName()");
    return pContacts[IndexPosition];
  }

//GET CONTACTS FROM JSON FILE
  service.getContactsByJson = function () {
    console.log(">>>> service.getContactsByJson()");
    var response = $http({
      method: "GET",
      headers: {
         'Content-Type': 'application/json'
       },
      url: (DataPath+'contacts.json')
    });
    console.log("<<<< service.getContactsByJson()");
    return response;
  };

//GET AGENTS FROM JSON FILE
  service.getAgentsByJson = function () {
    console.log(">>>> service.getAgentsByJson()");
    var response = $http({
      method: "GET",
      headers: {
         'Content-Type': 'application/json'
       },
      url: (DataPath+'agents.json')
    });
    console.log("<<<< service.getAgentsByJson()");
    return response;
  };

//*****************************
//*****************************
//  -----TOKBOX APIS-----
//*****************************
//*****************************

//GET THE TOKEN KEY
//*****************************
  service.getToken = function () {
    console.log(">>> service.getToken()")
    var MyToken={};
    var response = $http({
      method: "GET",
      headers: {
       },
      url: (HerokuBackEnd + 'session')
    });
    console.log("<<< service.getToken()")
    return response;
  };

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

//STOP ARCHIVING
//*****************************
service.TokBoxStopArchiving = function (pArchiveId) {
  console.log(">>> service.TokBoxStopArchiving(",pArchiveId,")")
  var MyToken={};
  var response = $http({
    method: "POST",
    headers: {
      contentType: "application/json", // send as JSON
     },
    url: (HerokuBackEnd + 'archive/'+pArchiveId+'/stop')
  });
  console.log("<<< service.TokBoxStopArchiving()")
  return response;
};

//VIEW ARCHIVE
//*****************************
service.TokBoxViewArchiving = function (pArchiveId) {
  console.log(">>> service.TokBoxViewArchiving(",pArchiveId,")")
  var MyToken={};
  var response = $http({
    method: "GET",
    headers: {
      contentType: "application/json", // send as JSON
     },
    url: (HerokuBackEnd + 'archive/'+pArchiveId+'/view')
  });
  console.log("<<< service.TokBoxViewArchiving()")
  return response;
};
//FIN DE FUNCIONES DE SERVICIO
}//FIN SERVICIO

})();