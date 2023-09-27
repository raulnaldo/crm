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

  service.getRoom = function () {
    console.log(">>> service.getRoom()")
    var MyToken={};
    var response = $http({
      method: "GET",
      headers: {
       },
      url: ('https://senior-video-test-b6547c3126ce.herokuapp.com/session')
    });
    console.log("<<< service.getRoom()")
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


//GET ALL ARCHIVES
//*****************************
service.TokBoxGetAllArchiving = function () {
  console.log(">>> service.TokBoxGetAllArchiving()")
  var MyToken={};
  var response = $http({
    method: "GET",
    headers: {
      contentType: "application/json", // send as JSON
     },
    url: (HerokuBackEnd + 'archive')
  });
  console.log("<<< service.TokBoxGetAllArchiving()")
  return response;
};


//ALTITUDE SCRIPT METHODS
//*****************************
service.PhoneAnswer = function (pEndPoint) {
  console.log(">>> service.PhoneAnswer()");
  console.log("---->>> pEndPoint:",pEndPoint);
  var MyCommand={
      "Name" : "EventPhoneCommands",
      "Data" : "action:phone_answer"
      };
  var response = $http({
    method: "POST",
    headers: {
      contentType: "application/json", // send as JSON
     },
    url: (pEndPoint),
    data:MyCommand
  });
  console.log("<<< service.PhoneAnswer()")
  return response;
};

service.PhoneHangUp = function (pEndPoint) {
  console.log(">>> service.PhoneHangUp()");
  console.log("---->>> pEndPoint:",pEndPoint);
  var MyCommand={
      "Name" : "EventPhoneCommands",
      "Data" : "action:phone_hangup"
      };
  var response = $http({
    method: "POST",
    headers: {
      contentType: "application/json", // send as JSON
     },
    url: (pEndPoint),
    data:MyCommand
  });
  console.log("<<< service.PhoneHangUp()")
  return response;
};

service.EndSession = function (pEndPoint,pDataOutComes) {
  console.log(">>> service.EndSession()");
  console.log("---->>> pEndPoint:",pEndPoint);
  var MyCommand={
      "Name" : "EventEndSessionWithData",
      "Data" : pDataOutComes
      };
  var response = $http({
    method: "POST",
    headers: {
      contentType: "application/json", // send as JSON
     },
    url: (pEndPoint),
    data:MyCommand
  });
  console.log("<<< service.EndSession()")
  return response;
};








//FIN DE FUNCIONES DE SERVICIO
}//FIN SERVICIO

})();