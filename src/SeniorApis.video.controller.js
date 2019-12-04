//http://localhost:3000/Apis.html#?agentId=agente176ddi@demo.com&gate=InfoGate&callref=98769dsfjsdfj9079087
(function () {
"use strict";

angular.module('SeniorApisModule')
.controller('SeniorApisVideoController', SeniorApisVideoController);

SeniorApisVideoController.$inject = ['$location','SeniorApisService','userUid','appUid','$scope','$sce','$window','$state','SeniorApisDynamicsService'];
function SeniorApisVideoController($location,SeniorApisService,userUid,appUid,$scope, $sce,$window,$state,SeniorApisDynamicsService) {

  console.log("SeniorApisVideoController --> init();",SeniorApisCtrl);
  var SeniorApisCtrl = this;

  var Archiving=false;

  var TokBoxCredentials = {};

  var activeStream = {};
  var activePublish = {};
  var activeArchiving = {};  
  activeArchiving.active=false;
  SeniorApisCtrl.loadingImage=true;


//###########################################################
//#################       UTILS            ##################
//###########################################################

SeniorApisCtrl.IsValidObject = function IsValidObject(pObject){
  if(typeof pObject !== "undefined") {
    return true;
  }
  else{
    return false;
  }
}


//********************************
//FUNCIONES DE CRM
//********************************
  
//###########################################################
//#################  TOKBOX SECTION  #####################
//###########################################################

//*********************************************************
//                     GET TOKEN FROM BACKEND
//---------------------------------------------------------

  //GET THE TOKEN KEY
  SeniorApisCtrl.getTokenFromApi = function(){
    console.log("--> getTokenFromApi()");
      var promise= SeniorApisService.getRoom();
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
  var subscriber={};
  myPublisherStyle.audioBlockedDisplayMode= "off";
  myPublisherStyle.audioLevelDisplayMode="on";
  myPublisherStyle.buttonDisplayMode="auto"; // off BOTON DE MUTE no mostrado / on Siempre visible / auto solo si te posicionas
  //myPublisherStyle.videoDisabledDisplayMode= "on";
  myPublisherStyle.nameDisplayMode= "auto";


  mySubscriberStyle.audioBlockedDisplayMode= "off";
  mySubscriberStyle.audioLevelDisplayMode="off"; // Muestra los cascos indicando si se detecta audio con ondas verdes
  mySubscriberStyle.buttonDisplayMode="auto"; //Boton para habilitar o habilitar el icono de altavoces
  mySubscriberStyle.videoDisabledDisplayMode= "auto";
  mySubscriberStyle.nameDisplayMode= "on";


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
    subscriber = session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      insertDefaultUI: true,
      showControls: true,
      fitMode: "cover",
      testNetwork: true,
      style: mySubscriberStyle
    }, handleError);
    console.log("<-- session.subscribe()");

    //SeniorApisCtrl.TokBoxStartArchiving();

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
    //frameRate: 30,
    frameRate: 15,
    insertDefaultUI: true,
    fitMode: "cover", //cover-contain
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


SeniorApisCtrl.DoStartStopArchive= function () {
  console.log("--> DoStartStopArchive()");    
  if (activeArchiving.active){
    SeniorApisCtrl.TokBoxStopArchiving();
  }
  else{
    SeniorApisCtrl.TokBoxStartArchiving();
  }
  console.log("<-- DoStartStopArchive()");      
}
SeniorApisCtrl.TokBoxStartArchiving= function () {
  try{

    console.log("--> TokBoxStartArchiving(",TokBoxCredentials.sessionId,')');    
    activeArchiving.active=true;
    var promise= SeniorApisService.TokboxStartArchiving(TokBoxCredentials.sessionId);
    promise.then(function (response) {
        console.log('Then:',response.data);
        activeArchiving.id=response.data.id;        
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

    console.log("--> TokBoxStopArchiving()",activeArchiving.id);    
    activeArchiving.active=false;
    var promise= SeniorApisService.TokBoxStopArchiving(activeArchiving.id);    
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
//#################       RUN ACTIONS      ##################
//###########################################################

//SeniorApisCtrl.StartSearchingContacts();

SeniorApisCtrl.getTokenFromApi();

}//FIN CONTROLER



}//FIN FUNCION INICIAL
)();
