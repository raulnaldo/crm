//http://localhost:3000/Apis.html#?agentId=agente176ddi@demo.com&gate=InfoGate&callref=98769dsfjsdfj9079087
(function () {
"use strict";

angular.module('OdigoApisModule')
.controller('OdigoApisController', OdigoApisController);

OdigoApisController.$inject = ['$location','OdigoApisService','userUid','appUid','$scope','$sce','$window','$state'];
function OdigoApisController($location,OdigoApisService,userUid,appUid,$scope, $sce,$window,$state) {  

  var OdigoApisCtrl = this;

  var TokBoxCredentials = {};

//###########################################################
//#################       UTILS            ##################
//###########################################################

  OdigoApisCtrl.OdigoFormatDate = function formatDate(pDate){
    var date = new Date(pDate);
    var monthNames = [
      "Enero", "Febrero", "Marzo",
      "Abril", "Mayo", "Junio", "Julio",
      "Augosto", "Septiembre", "Octubre",
      "Noviembre", "Diciembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  OdigoApisCtrl.OdigoFormatDateHour = function OdigoFormatDateHour(pDate){
    var date = new Date(pDate);
        
    var currentHours = date.getHours();
    currentHours = ("0" + currentHours).slice(-2);

    var currentMins = date.getMinutes();
    currentMins = ("0" + currentMins).slice(-2);

    var currentSecs = date.getSeconds();
    currentSecs = ("0" + currentSecs).slice(-2);

    return currentHours + ':' + currentMins + ':' + currentSecs;
  }

  OdigoApisCtrl.IsValidObject = function IsValidObject(pObject){
    if(typeof pObject !== "undefined") {
      return true;
    }
    else{
      return false; 
    }    
  }
//###########################################################
//#################       INIT            ##################
//###########################################################

  //Obtenemos la informacion proporcionada en la URL queryString
  OdigoApisCtrl.OdigoCallInfo=$location.search();  
  console.log('--> OdigoApisController Init()'); 
  console.log('  --> Location SearchData();',$location.search());
  console.log('      OdigoApisCtrl.OdigoCallInfo();',OdigoApisCtrl.OdigoCallInfo);
  console.log('  <-- Location SearchData()');

  //Para pruebas, asignamos por defecto un Id y un nombre de agente.
  if (!OdigoApisCtrl.IsValidObject(OdigoApisCtrl.OdigoCallInfo.CustomerCode)){
    //OdigoApisCtrl.OdigoCallInfo.CustomerCode="1262";
    $state.go('notfound'); 
  }
  if (OdigoApisCtrl.OdigoCallInfo.UserLogin==undefined){
    OdigoApisCtrl.OdigoCallInfo.UserLogin="agent176ddi@demo.com";
  }

  //Obtenemos a través de Ajax  el array de agentes que tenemos definidos.
  console.log('  --> OdigoApisService.getAgentProperties()');
  var promiseAgents= OdigoApisService.getAgentsByJson();
  promiseAgents.then(function (response) {
      console.log('<<<< Retorno de Agents:',response.data.agents);
      OdigoApisCtrl.Agent= response.data.agents[response.data.agents.findIndex(x => x.Login === OdigoApisCtrl.OdigoCallInfo.UserLogin)];
      console.log('  <-- OdigoApisService.getAgentProperties:',OdigoApisCtrl.Agent);      
    })
    .catch(function (error) {
      console.log("Error:",error);      
  });
  
 //Obtenemos a través de Ajax  el array de contactos que tenemos definidos.
 OdigoApisCtrl.StartSearchingContacts = function(){
    console.log("  --> Filling Contacts");
    var promise= OdigoApisService.getContactsByJson();
    promise
    .then(
      function (response) {
        console.log('Then:',response.data);      
        OdigoApisCtrl.CrmContacts=response.data.contacts;
        console.log("  --> SelectContactById:",OdigoApisCtrl.OdigoCallInfo.CustomerCode);
        OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactById(OdigoApisCtrl.OdigoCallInfo.CustomerCode,OdigoApisCtrl.CrmContacts);
        console.log("  <-- SelectContactById:",OdigoApisCtrl.CrmSelectedContact); 
        if (OdigoApisCtrl.CrmSelectedContact.Id.IsValidObject){
          OdigoApisCtrl.OdigoGetInteractionsByCustId(OdigoApisCtrl.CrmSelectedContact.Id);
        }
      })
      .catch(
        function (error) {
        console.log("Error:",error);      
    });
    console.log("  <-- Filling Contacts",OdigoApisCtrl.CrmContacts);   
  }
  OdigoApisCtrl.OrganizeInteractions = function(pInteractions){
      console.log("  --> OrganizeInteractions:",pInteractions);
      
      console.log("  <-- OrganizeInteractions");   
  }  
  
//********************************
//FUNCIONES DE CRM
//********************************    
  OdigoApisCtrl.SearchContact = function(){
    var EmptyObject={};
    OdigoApisCtrl.CrmSelectedContact=EmptyObject;
    OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactById(OdigoApisCtrl.SearchId,OdigoApisCtrl.CrmContacts);    
    if (OdigoApisCtrl.CrmSelectedContact==undefined){
      OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactLastName(OdigoApisCtrl.SearchId,OdigoApisCtrl.CrmContacts);    
      if (OdigoApisCtrl.CrmSelectedContact==undefined){
        OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactName(OdigoApisCtrl.SearchId,OdigoApisCtrl.CrmContacts);
      }
    }     
    if (OdigoApisCtrl.IsValidObject(OdigoApisCtrl.CrmSelectedContact)){
      OdigoApisCtrl.LastSearchSearchId=null;
      $state.go('profile');
    }
    else{
      OdigoApisCtrl.LastSearchSearchId=OdigoApisCtrl.SearchId;
      $state.go('notfound'); 
    }
  }; 
 

  OdigoApisCtrl.GetTotalPrice = function(){
    var total = 0;
    for(var i = 0; i < OdigoApisCtrl.CrmSelectedContact.Products.length; i++){
        var product = OdigoApisCtrl.CrmSelectedContact.Products[i];
        total += (product.Price);
    }
    return total;
  }; 

//********************************
//APIS METHODS
//********************************

  //GET THE TOKEN KEY
  OdigoApisCtrl.getTokenFromApi = function(){
      var promise= OdigoApisService.getToken();
      promise.then(function (response) {
          console.log('Then:',response.data);
          TokBoxCredentials.apiKey=response.data.apiKey;
          TokBoxCredentials.sessionId=response.data.sessionId;
          TokBoxCredentials.token=response.data.token;
          initializeSession();
        })
        .catch(function (error) {
          console.log("Error:",error);          
      });                
  };



//###########################################################
//#################       RUN ACTIONS      ##################
//###########################################################

OdigoApisCtrl.StartSearchingContacts();

OdigoApisCtrl.getTokenFromApi();

//###########################################################
//#################  TOKBOX INITIALICE  #####################
//###########################################################

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

// (optional) add server code here

  
function initializeSession() {
  var session = OT.initSession(TokBoxCredentials.apiKey, TokBoxCredentials.sessionId);

  var myPublisherStyle={};
  myPublisherStyle.audioLevelDisplayMode="off";


  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%',        
      insertDefaultUI: true, 
      showControls: false,
      style: myPublisherStyle              
    }, handleError);
  });

  // Create a publisher o camara espejo


  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%',      
    insertDefaultUI: true, 
    showControls: true,
    style: myPublisherStyle      
  }, handleError);

  // Connect to the session
  session.connect(TokBoxCredentials.token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}



}//FIN CONTROLER

  

}//FIN FUNCION INICIAL
)();
