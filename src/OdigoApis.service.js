(function () {
"use strict";

angular.module('OdigoApisModule')
.service('OdigoApisService', OdigoApisService);


OdigoApisService.$inject = ['$http', 'ApiPath','ApiAuthPath','CI360ApiPath','userUid','appUid','DataPath'];
function OdigoApisService($http, ApiPath,ApiAuthPath,CI360ApiPath,userUid,appUid,DataPath) {
  var service = this;



  service.SelectContactById = function(pId,pContacts){
    console.log(">>>> service.SelectContactById()");
    console.log("---->>>> pId:",pId);
    console.log("---->>>> pContacts:",pContacts);  
    
    var IndexPosition=pContacts.findIndex(x => x.Id === pId);

    console.log("  -->>>> Contact Index:",IndexPosition);  
    console.log("<<<< service.SelectContactById()");  
    return pContacts[IndexPosition];
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
//  -----ODIGO APIS-----
//*****************************
//*****************************

//GET THE TOKEN KEY
//*****************************
  service.getToken = function () {
    var MyToken={};
    var response = $http({
      method: "POST",
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Basic Y29uc29sZV9kZTAxQHByb3NvZGllLmNvbTpBWkVSVFk='
       },
       data: {"userUid": userUid,"appUid": appUid},
      url: (ApiAuthPath)
    });

    return response;
  };  

//REASONS OF CONVERSATIONS
//*****************************
  service.ReasonsOfConversation = function (Token,Agent,Service,CallId,ReasonsOfConversation) {
    console.log('--> ReasonsOfConversation()',Service,ReasonsOfConversation);
    var response = $http({
      method: "POST",
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Basic Y29uc29sZV9kZTAxQHByb3NvZGllLmNvbTpBWkVSVFk=',
         'X-API-TOKEN' : Token,
         'X-WS-INSTANCE' : 'DE01'
       },       
      url: (CI360ApiPath + '/ci360/v3/'+Service+'/voice-interactions/'+CallId+'/reasonsOfConversation'),
      data: ReasonsOfConversation
    });
    console.log('<-- ReasonsOfConversation()');
    return response;
  };  

//HANG UP
//*****************************
  service.OdigoHangUp = function (Token,Agent) {
    console.log('--> OdigoHangUp()');
    var response = $http({
      method: "POST",
      headers: {
         'Content-Type': 'application/json',
         'X-API-TOKEN' : Token,
         'X-WS-INSTANCE' : 'de01'
       },       
      url: (ApiPath + Agent.replace('@', '%40') + '/commands/hangUpCall')
    });
    console.log('<-- OdigoHangUp()');
    return response;
  };
//END WRAPUP
//*****************************
  service.OdigoEndWrapUp = function (Token,Agent,CallReasonCreate) {
    console.log('--> OdigoEndWrapUp()');
    var response = $http({
      method: "POST",
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Basic Y29uc29sZV9kZTAxQHByb3NvZGllLmNvbTpBWkVSVFk=',
         'X-API-TOKEN' : Token,
         'X-WS-INSTANCE' : 'de01'
       },       
      url: (ApiPath + Agent.replace('@', '%40') + '/commands/callFreeReason'),
      data: CallReasonCreate
    });
    console.log('<-- OdigoEndWrapUp()');
    return response;
  };

//END WRAPUP
//*****************************
  service.OdigoGetInteractionsByCustId = function (Token,Service,CustomerId) {
    console.log('--> OdigoGetInteractionsByCustId()');
    var response = $http({
      method: "GET",
      headers: {
         'Content-Type': 'application/json',         
         'X-API-TOKEN' : Token,
         'X-WS-INSTANCE' : 'DE01'
       },       
      url: (CI360ApiPath + '/ci360/v3/'+Service+'/profiles/'+CustomerId)
    });
    console.log('<-- OdigoGetInteractionsByCustId()');
    return response;
  };

//FIN DE FUNCIONES DE SERVICIO  
}//FIN SERVICIO

})();