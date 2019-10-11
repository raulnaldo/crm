//http://localhost:3000/Apis.html#?agentId=agente176ddi@demo.com&gate=InfoGate&callref=98769dsfjsdfj9079087
(function () {
"use strict";

angular.module('OdigoApisModule')
.controller('OdigoApisController', OdigoApisController);

OdigoApisController.$inject = ['$location','OdigoApisService','userUid','appUid','$scope','$sce','$window','$state'];
function OdigoApisController($location,OdigoApisService,userUid,appUid,$scope, $sce,$window,$state) {  

  var OdigoApisCtrl = this;

  var TokBoxCredentials = {};

  var activeStream = {};
  var activePublish = {};
  OdigoApisCtrl.loadingImage=true;


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
    console.log("--> getTokenFromApi()");
      var promise= OdigoApisService.getToken();
      promise.then(function (response) {
          console.log('Then:',response.data);
          TokBoxCredentials.apiKey=response.data.apiKey;
          TokBoxCredentials.sessionId=response.data.sessionId;
          TokBoxCredentials.token=response.data.token;
          OdigoApisCtrl.initializeSession();
        })
        .catch(function (error) {
          console.error("Error:",error.message);
      });                
    console.log("<-- getTokenFromApi()");  
  };





//###########################################################
//#################  TOKBOX INITIALICE  #####################
//###########################################################

function handleError(error) {
  if (error) {
    alert(error.message);
  }
  else{
    console.log("<<<<< Hadled Received >>>>>")
  }
}

// (optional) add server code here

  
OdigoApisCtrl.initializeSession= function () {
  console.log("--> OT.initSession()");
  //TokBoxCredentials.apiKey = '45828062';
  //TokBoxCredentials.sessionId = '2_MX40NTgyODA2Mn5-MTU2OTQ4ODIyMDYxNn5SSlZhUWliVEVnOXZ4WndQaTdUZFVjMHJ-UH4';
  //TokBoxCredentials.token = 'T1==cGFydG5lcl9pZD00NTgyODA2MiZzaWc9MmJhZjU5MDJlYmM5MjM1MDI2NDgyNTdkOGM1N2MwNjMyMzViZWJkNDpzZXNzaW9uX2lkPTJfTVg0ME5UZ3lPREEyTW41LU1UVTJPVFE0T0RJeU1EWXhObjVTU2xaaFVXbGlWRVZuT1haNFduZFFhVGRVWkZWak1ISi1VSDQmY3JlYXRlX3RpbWU9MTU2OTQ4ODI2MiZub25jZT0wLjQ2MjA2ODM1OTgyOTgyMzg2JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1Njk1NzQ2NjI=';  
  
  
  var session = OT.initSession(TokBoxCredentials.apiKey, TokBoxCredentials.sessionId);

  console.log("  >> capabilities:"+ session.capabilities);
  
  var myPublisherStyle={};
  var mySubscriberStyle={};
  myPublisherStyle.audioBlockedDisplayMode= "off";
  myPublisherStyle.audioLevelDisplayMode="on";
  myPublisherStyle.buttonDisplayMode="auto";    
  //myPublisherStyle.videoDisabledDisplayMode= "on";
  myPublisherStyle.nameDisplayMode= "auto";
  

  mySubscriberStyle.audioBlockedDisplayMode= "off";
  mySubscriberStyle.audioLevelDisplayMode="on";
  mySubscriberStyle.buttonDisplayMode="auto";  
  mySubscriberStyle.videoDisabledDisplayMode= "auto";  
  mySubscriberStyle.nameDisplayMode= "auto";
  
  
  
  
  
  // Subscribe to a newly created stream
  console.log("--> session.on('streamCreated')");


  session.on('streamDestroyed', function(event) {    
    console.log("<***> streamDestroyed()");
  });

  session.on('connectionDestroyed', function(event) {    
    console.log("<***> connectionDestroyed()");
    OdigoApisCtrl.loadingImage=true;
    session.unsubscribe(activeStream);
    session.unpublish(activePublish,handleError);
  });

  session.on('sessionDisconnected', function(event) {    
    console.log("<***> sessionDisconnected()");
  });
  

  session.on('streamCreated', function(event) {    
    activeStream = event.stream;
    console.log("--> session.subscribe()");
    OdigoApisCtrl.loadingImage=false;
    
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      //width: '100%',
      //height: '100%',        
      insertDefaultUI: true, 
      showControls: false, 
      fitMode: "contain",
      testNetwork: true,
      style: mySubscriberStyle              
    }, handleError);

    console.log("<-- session.subscribe()");
  });
  console.log("<-- session.on('streamCreated')");

  

  // Create a publisher o camara espejo

  console.log("--> OT.initPublisher()");
  activePublish = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%',      
    resolution: '1280x720',
    frameRate: 30,
    insertDefaultUI: true, 
    showControls: false,
    fitMode: "contain",
    style: myPublisherStyle      
  }, handleError);

  console.log("<-- OT.initPublisher()");

  // Connect to the session
  session.connect(TokBoxCredentials.token, function(error) {    
    // If the connection is successful, initialize a publisher and publish to the session
    console.log("--> session.connect:",session.connection);    
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);  
      
    }
    console.log("<-- session.connect");
  });
  console.log("<-- OT.initSession()");
}

//###########################################################
//#################       RUN ACTIONS      ##################
//###########################################################

//OdigoApisCtrl.StartSearchingContacts();

OdigoApisCtrl.getTokenFromApi();


}//FIN CONTROLER

  

}//FIN FUNCION INICIAL
)();
