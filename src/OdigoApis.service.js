(function () {
"use strict";

angular.module('OdigoApisModule')
.service('OdigoApisService', OdigoApisService);


OdigoApisService.$inject = ['$http', 'ApiPath','ApiAuthPath','CI360ApiPath','userUid','appUid','DataPath','HerokuBackEnd'];
function OdigoApisService($http, ApiPath,ApiAuthPath,CI360ApiPath,userUid,appUid,DataPath,HerokuBackEnd) {
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


//FIN DE FUNCIONES DE SERVICIO  
}//FIN SERVICIO

})();