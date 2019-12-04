//http://localhost:3000/Apis.html#?agentId=agente176ddi@demo.com&gate=InfoGate&callref=98769dsfjsdfj9079087
(function () {
"use strict";

angular.module('SeniorApisModule')
.controller('SeniorApisController', SeniorApisController);

SeniorApisController.$inject = ['$location','SeniorApisService','userUid','appUid','$scope','$sce','$window','$state','SeniorApisDynamicsService'];
function SeniorApisController($location,SeniorApisService,userUid,appUid,$scope, $sce,$window,$state,SeniorApisDynamicsService) {

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
    //var promise= SeniorApisDynamicsService.GetContactByMobilePhone(SeniorApisCtrl.SearchId);
    promise.then(function (response) {
        console.log('Contact Found:',response.data);
        SeniorApisCtrl.CrmSelectedContact=response.data;        
        if (SeniorApisCtrl.IsValidObject(SeniorApisCtrl.CrmSelectedContact)){
          SeniorApisCtrl.LastSearchSearchId=null;
          //SeniorApisCtrl.CrmSelectedContact.DynamicsURL='https://crm838148.crm4.dynamics.com/main.aspx?appid=34476255-4b0a-ea11-a816-000d3ab85fc1&pagetype=entityrecord&etn=contact&id='+ SeniorApisCtrl.CrmSelectedContact.value[0].contactid;
          SeniorApisCtrl.CrmSelectedContact.DynamicsURL='https://crm838148.crm4.dynamics.com/main.aspx?appid=34476255-4b0a-ea11-a816-000d3ab85fc1&pagetype=entityrecord&etn=contact&id='+SeniorApisCtrl.CrmSelectedContact.DynamicsId;
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
  var StringDataToSend= 'motivo:'+ SeniorApisCtrl.CrmSelectedContact.Outcome.Motivo + 
                        '|contact:'+ SeniorApisCtrl.CrmSelectedContact.Outcome.PerContacto +
                        '|comments:'+ SeniorApisCtrl.CrmSelectedContact.Outcome.Comments +
                        '|gdpr:'+ (SeniorApisCtrl.CrmSelectedContact.Outcome.Gdpr ? 1 : 0) ; 
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


SeniorApisCtrl.SearchContact();

}//FIN CONTROLER



}//FIN FUNCION INICIAL
)();
