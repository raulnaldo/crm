//http://localhost:3000/Apis.html#?agentId=agente176ddi@demo.com&gate=InfoGate&callref=98769dsfjsdfj9079087
(function () {
"use strict";

angular.module('SeniorApisModule')
.controller('SeniorApisController', SeniorApisController);

SeniorApisController.$inject = ['$location','SeniorApisService','userUid','appUid','$scope','$sce','$window','$state'];
function SeniorApisController($location,SeniorApisService,userUid,appUid,$scope, $sce,$window,$state) {

  var SeniorApisCtrl = this;

  var TokBoxCredentials = {};

  var activeStream = {};
  var activePublish = {};
  var activeArchiving = {};  
  SeniorApisCtrl.loadingImage=true;


//###########################################################
//#################       UTILS            ##################
//###########################################################

  SeniorApisCtrl.FormatDate = function formatDate(pDate){
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

  SeniorApisCtrl.FormatDateHour = function FormatDateHour(pDate){
    var date = new Date(pDate);

    var currentHours = date.getHours();
    currentHours = ("0" + currentHours).slice(-2);

    var currentMins = date.getMinutes();
    currentMins = ("0" + currentMins).slice(-2);

    var currentSecs = date.getSeconds();
    currentSecs = ("0" + currentSecs).slice(-2);

    return currentHours + ':' + currentMins + ':' + currentSecs;
  }

  SeniorApisCtrl.IsValidObject = function IsValidObject(pObject){
    if(typeof pObject !== "undefined") {
      return true;
    }
    else{
      return false;
    }
  }

SeniorApisCtrl.cleanDate = function cleanDate(d) {
  var day = moment.unix(d);
  return day.toString();  
}

SeniorApisCtrl.timeConverter = function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour.substring(-2) + ':' + min + ':' + sec ;
    return time;
  }

//###########################################################
//#################       INIT            ##################
//###########################################################

  //Obtenemos la informacion proporcionada en la URL queryString
  SeniorApisCtrl.CallInfo=$location.search();
  console.log('--> SeniorApisController Init()');
  console.log('  --> Location SearchData();',$location.search());
  console.log('      SeniorApisCtrl.CallInfo();',SeniorApisCtrl.CallInfo);
  console.log('  <-- Location SearchData()');

  //Para pruebas, asignamos por defecto un Id y un nombre de agente.
  if (!SeniorApisCtrl.IsValidObject(SeniorApisCtrl.CallInfo.CustomerCode)){
    SeniorApisCtrl.CallInfo.CustomerCode="699479614";
    $state.go('notfound');
  }
  if (SeniorApisCtrl.CallInfo.UserLogin==undefined){
    SeniorApisCtrl.CallInfo.UserLogin="agent176ddi@demo.com";
  }
  SeniorApisCtrl.SearchId=SeniorApisCtrl.CallInfo.CustomerCode;

  //Obtenemos a través de Ajax  el array de agentes que tenemos definidos.
  console.log('  --> ApisService.getAgentProperties()');
  var promiseAgents= SeniorApisService.getAgentsByJson();
  promiseAgents.then(function (response) {
      console.log('<<<< Retorno de Agents:',response.data.agents);
      SeniorApisCtrl.Agent= response.data.agents[response.data.agents.findIndex(x => x.Login === SeniorApisCtrl.CallInfo.UserLogin)];
      console.log('  <-- SeniorApisService.getAgentProperties:',SeniorApisCtrl.Agent);
    })
    .catch(function (error) {
      console.log("Error:",error);
  });

 //Obtenemos a través de Ajax  el array de contactos que tenemos definidos.
 SeniorApisCtrl.StartSearchingContacts = function(){
    console.log("  --> Filling Contacts");
    var promise= SeniorApisService.getContactsByJson();
    promise
    .then(
      function (response) {
        console.log('Then:',response.data);
        SeniorApisCtrl.CrmContacts=response.data.contacts;
        console.log("  --> SelectContactById:",SeniorApisCtrl.CallInfo.CustomerCode);
        SeniorApisCtrl.CrmSelectedContact=SeniorApisService.SelectContactById(SeniorApisCtrl.CallInfo.CustomerCode,SeniorApisCtrl.CrmContacts);
        console.log("  <-- SelectContactById:",SeniorApisCtrl.CrmSelectedContact);
        if (SeniorApisCtrl.CrmSelectedContact.Id.IsValidObject){
          SeniorApisCtrl.GetInteractionsByCustId(SeniorApisCtrl.CrmSelectedContact.Id);
        }
      })
      .catch(
        function (error) {
        console.log("Error:",error);
    });
    console.log("  <-- Filling Contacts",SeniorApisCtrl.CrmContacts);
  }
  SeniorApisCtrl.OrganizeInteractions = function(pInteractions){
      console.log("  --> OrganizeInteractions:",pInteractions);

      console.log("  <-- OrganizeInteractions");
  }

//********************************
//FUNCIONES DE CRM
//********************************
  SeniorApisCtrl.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
  SeniorApisCtrl.ShowMasMovil = function() {
    SeniorApisCtrl.CurrentMasMovilUrl="https://yosoymas.masmovil.es/validate/"; 
  }
  

  SeniorApisCtrl.SetCrmDynamicsURL = function(){
    SeniorApisCtrl.CurrentDynamicsUrl=SeniorApisCtrl.CrmSelectedContact.DynamicsURL;
  }
  SeniorApisCtrl.SearchContact = function(){
    var EmptyObject={};
    SeniorApisCtrl.CrmSelectedContact=EmptyObject;

    var promise= SeniorApisService.SelectContactById(SeniorApisCtrl.SearchId,SeniorApisCtrl.CrmContacts);
    promise.then(function (response) {
        console.log('Contact Found:',response.data);
        SeniorApisCtrl.CrmSelectedContact=response.data;
        if (SeniorApisCtrl.IsValidObject(SeniorApisCtrl.CrmSelectedContact)){
          SeniorApisCtrl.LastSearchSearchId=null;
          SeniorApisCtrl.CrmSelectedContact.DynamicsURL='https://raultests.crm4.dynamics.com/main.aspx?appid=aef19262-6ded-e911-a819-000d3a4a16f3&pagetype=entityrecord&etn=contact&id='+ SeniorApisCtrl.CrmSelectedContact.DynamicsId;
          //SeniorApisCtrl.CrmSelectedContact.DynamicsURL='https://raultests.crm4.dynamics.com/main.aspx?appid=aef19262-6ded-e911-a819-000d3a4a16f3&pagetype=entityrecord&etn=contact&id=0c85e618-4fef-e911-a812-000d3a24c29d'
          //alert(SeniorApisCtrl.CrmSelectedContact.DynamicsURL);          
          if (SeniorApisCtrl.IsValidObject(SeniorApisCtrl.CurrentDynamicsUrl)){
            SeniorApisCtrl.SetCrmDynamicsURL();
          }
          
          $state.go('profile');
        }
        else{
          SeniorApisCtrl.LastSearchSearchId=SeniorApisCtrl.SearchId;
          $state.go('notfound');
        }
      })
      .catch(function (error) {
        console.error("Error:",error.message);
        $state.go('notfound');
    });
  };


  SeniorApisCtrl.GetTotalPrice = function(){
    var total = 0;
    for(var i = 0; i < SeniorApisCtrl.CrmSelectedContact.Products.length; i++){
        var product = SeniorApisCtrl.CrmSelectedContact.Products[i];
        total += (product.Price);
    }
    return total;
  };

//###########################################################
//#################  TOKBOX SECTION  #####################
//###########################################################

//*********************************************************
//                     GET TOKEN FROM BACKEND
//---------------------------------------------------------

  //GET THE TOKEN KEY
  SeniorApisCtrl.getTokenFromApi = function(){
    console.log("--> getTokenFromApi()");
      var promise= SeniorApisService.getToken();
      promise.then(function (response) {
          console.log('Then:',response.data);
          TokBoxCredentials.apiKey=response.data.apiKey;
          TokBoxCredentials.sessionId=response.data.sessionId;
          TokBoxCredentials.token=response.data.token;
          SeniorApisCtrl.initializeSession();
        })
        .catch(function (error) {
          console.error("Error:",error.message);
      });
    console.log("<-- getTokenFromApi()");
  };




//*********************************************************
//                   TOKBOX INITIALICE
//---------------------------------------------------------

function handleError(error) {
  if (error) {
    alert(error.message);
  }
  else{
    console.log("<<<<< handleError Received >>>>>",error)
  }
}

// (optional) add server code here


SeniorApisCtrl.ChangeCamera= function () {
  SeniorApisCtrl.getTokenFromApi();
  //activePublish.cycleVideo().then(console.log);
};

SeniorApisCtrl.initializeSession= function () {
  console.log("--> OT.initSession()");
  //TokBoxCredentials.apiKey = '45828062';
  //TokBoxCredentials.sessionId = '2_MX40NTgyODA2Mn5-MTU2OTQ4ODIyMDYxNn5SSlZhUWliVEVnOXZ4WndQaTdUZFVjMHJ-UH4';
  //TokBoxCredentials.token = 'T1==cGFydG5lcl9pZD00NTgyODA2MiZzaWc9MmJhZjU5MDJlYmM5MjM1MDI2NDgyNTdkOGM1N2MwNjMyMzViZWJkNDpzZXNzaW9uX2lkPTJfTVg0ME5UZ3lPREEyTW41LU1UVTJPVFE0T0RJeU1EWXhObjVTU2xaaFVXbGlWRVZuT1haNFduZFFhVGRVWkZWak1ISi1VSDQmY3JlYXRlX3RpbWU9MTU2OTQ4ODI2MiZub25jZT0wLjQ2MjA2ODM1OTgyOTgyMzg2JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1Njk1NzQ2NjI=';

  if (SeniorApisCtrl.IsValidObject(OT)){
    var session = OT.initSession(TokBoxCredentials.apiKey, TokBoxCredentials.sessionId);
  }
  else{
      console.log("OT is not valid Object");
  }

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



  session.on('streamDestroyed', function(event) {
    console.log("<***> streamDestroyed()");
  });

  session.on('connectionDestroyed', function(event) {
    console.log("<***> connectionDestroyed()");
    SeniorApisCtrl.loadingImage=true;
    //session.unsubscribe(activeStream);
    //session.unpublish(activePublish,handleError);
  });

  session.on('sessionDisconnected', function(event) {
    console.log("<***> sessionDisconnected()");
  });


  session.on('streamCreated', function(event) {
    activeStream = event.stream;
    console.log("--> session.on(streamCreated)");
    SeniorApisCtrl.loadingImage=false;
    console.log("--> session.subscribe()");
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      insertDefaultUI: true,
      showControls: true,
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
    showControls: true,
    insertMode: 'append',
    width: '100%',
    height: '100%',
    //resolution: '1280x720',
    resolution: '640x480',
    //frameRate: 15,
    insertDefaultUI: true,
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
      session.publish(activePublish, handleError);
    }
    console.log("<-- session.connect");
  });
  console.log("<-- OT.initSession()");
}

//*********************************************************
//                   TOKBOX START ARCHIVING
//---------------------------------------------------------

SeniorApisCtrl.TokBoxStartArchiving= function () {
  try{

    console.log("--> TokBoxStartArchiving(",TokBoxCredentials.sessionId,')');    
    var promise= SeniorApisService.TokboxStartArchiving(TokBoxCredentials.sessionId);
    promise.then(function (response) {
        console.log('Then:',response.data);
        activeArchiving=response.data.id;
      })
      .catch(function (error) {
        console.error("Error:",error.message);
    });    
    console.log("<-- TokBoxStartArchiving");  
  }
  catch(error){
    console.error(error);
  }
};

SeniorApisCtrl.TokBoxStopArchiving= function () {
  try{

    console.log("--> TokBoxStopArchiving()",activeArchiving);    
    var promise= SeniorApisService.TokBoxStopArchiving(activeArchiving);
    promise.then(function (response) {
        console.log('Then:',response.data);        
      })
      .catch(function (error) {
        console.error("Error:",error);
    });    
    console.log("<-- TokBoxStopArchiving");  
  }
  catch(error){
    console.error(error);
  }
};

SeniorApisCtrl.TokBoxViewArchiving= function () {
  try{

    console.log("--> TokBoxViewArchiving()",activeArchiving);    
    var promise= SeniorApisService.TokBoxViewArchiving(activeArchiving);
    promise.then(function (response) {
        console.log('Then:',response.data);        
      })
      .catch(function (error) {
        console.error("Error:",error);
    });    
    console.log("<-- TokBoxViewArchiving");  
  }
  catch(error){
    console.error(error);
  }
};

SeniorApisCtrl.TokBoxGetAllArchiving= function () {
  try{

    console.log("--> TokBoxGetAllArchiving()");    
    var promise= SeniorApisService.TokBoxGetAllArchiving();
    promise.then(function (response) {
        console.log('Then:',response.data);
        SeniorApisCtrl.arrayArchiving=response.data;
      })
      .catch(function (error) {
        console.error("Error:",error);
    });    
    console.log("<-- TokBoxGetAllArchiving");  
  }
  catch(error){
    console.error(error);
  }
};

//###########################################################
//#################       CTI ACTIONS      ##################
//###########################################################

SeniorApisCtrl.PhoneAnswer= function () {
  try{
  console.log("--> PhoneAnswer()");    
  var promise= SeniorApisService.PhoneAnswer(SeniorApisCtrl.CallInfo.EndPoint);
    promise.then(function (response) {
      console.log('Then:',response.data);      
    })
    .catch(function (error) {
      console.error("Error:",error);
    });    
    console.log("<-- PhoneAnswer");  
  }
  catch(error){
    console.error(error);
  }
};

SeniorApisCtrl.PhoneHangUp= function () {
  try{
  console.log("--> PhoneHangUp()");    
  var promise= SeniorApisService.PhoneHangUp(SeniorApisCtrl.CallInfo.EndPoint);
    promise.then(function (response) {
      console.log('Then:',response.data);      
    })
    .catch(function (error) {
      console.error("Error:",error);
    });    
    console.log("<-- PhoneHangUp");  
  }
  catch(error){
    console.error(error);
  }
};

SeniorApisCtrl.EndSession= function () {
  try{
  console.log("--> EndSession()");
  var StringDataToSend= 'motivo:'+ SeniorApisCtrl.CrmSelectedContact.Outcome.Motivo + '|contact:'+ SeniorApisCtrl.CrmSelectedContact.Outcome.PerContacto
  var promise= SeniorApisService.EndSession(SeniorApisCtrl.CallInfo.EndPoint,StringDataToSend);
    promise.then(function (response) {
      console.log('Then:',response.data);      
    })
    .catch(function (error) {
      console.error("Error:",error);
    });    
    console.log("<-- EndSession");  
  }
  catch(error){
    console.error(error);
  }
};

SeniorApisCtrl.SelectedMotivo= function () {
  try{
  console.log("--> CrmSelectedContact.Outcome.Motivo:",SeniorApisCtrl.CrmSelectedContact.Outcome.Motivo);
  }
  catch(error){
    console.error(error);
  }
};


//###########################################################
//#################       RUN ACTIONS      ##################
//###########################################################

//SeniorApisCtrl.StartSearchingContacts();

//SeniorApisCtrl.getTokenFromApi();
SeniorApisCtrl.SearchContact();

}//FIN CONTROLER



}//FIN FUNCION INICIAL
)();
