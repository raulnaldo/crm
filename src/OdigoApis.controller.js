//http://localhost:3000/Apis.html#?agentId=agente176ddi@demo.com&gate=InfoGate&callref=98769dsfjsdfj9079087
(function () {
"use strict";

angular.module('OdigoApisModule')
.controller('OdigoApisController', OdigoApisController);

OdigoApisController.$inject = ['$location','OdigoApisService','userUid','appUid','$scope','$sce','$window','$state'];
function OdigoApisController($location,OdigoApisService,userUid,appUid,$scope, $sce,$window,$state) {  

  var OdigoApisCtrl = this;
  OdigoApisCtrl.OdigoCallInfo=$location.search();  
  console.log('--> OdigoApisController Init()'); 
  console.log('  --> Location SearchData();',$location.search());
  console.log('      OdigoApisCtrl.OdigoCallInfo();',OdigoApisCtrl.OdigoCallInfo);
  console.log('  <-- Location SearchData()');

  if (OdigoApisCtrl.OdigoCallInfo.CustomerCode==undefined){
    OdigoApisCtrl.OdigoCallInfo.CustomerCode="1262";
  }
  if (OdigoApisCtrl.OdigoCallInfo.UserLogin==undefined){
    OdigoApisCtrl.OdigoCallInfo.UserLogin="agent176ddi@demo.com";
  }
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
  

  console.log("  --> Filling Contacts");
  var promise= OdigoApisService.getContactsByJson();
  promise.then(function (response) {
      console.log('Then:',response.data);      
      OdigoApisCtrl.CrmContacts=response.data.contacts;
      console.log("  --> SelectContactById:",OdigoApisCtrl.OdigoCallInfo.CustomerCode);
      OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactById(OdigoApisCtrl.OdigoCallInfo.CustomerCode,OdigoApisCtrl.CrmContacts);
      console.log("  <-- SelectContactById:",OdigoApisCtrl.CrmSelectedContact);        

    })
    .catch(function (error) {
      console.log("Error:",error);      
  });
  console.log("  <-- Filling Contacts",OdigoApisCtrl.CrmContacts); 

  
//********************************
//FUNCIONES DE CRM
//********************************    
  OdigoApisCtrl.SearchContact = function(){
    OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactById(OdigoApisCtrl.SearchId,OdigoApisCtrl.CrmContacts);    
    if (OdigoApisCtrl.CrmSelectedContact==undefined){
      OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactLastName(OdigoApisCtrl.SearchId,OdigoApisCtrl.CrmContacts);    
      if (OdigoApisCtrl.CrmSelectedContact==undefined){
        OdigoApisCtrl.CrmSelectedContact=OdigoApisService.SelectContactName(OdigoApisCtrl.SearchId,OdigoApisCtrl.CrmContacts);
      }
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
//ODIGO APIS METHODS
//********************************

  //GET THE TOKEN KEY
  OdigoApisCtrl.getTokenFromApi = function(){
      OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.getToken();
      promise.then(function (response) {
          console.log('Then:',response.data);
          OdigoApisCtrl.OpStatus='200';
          OdigoApisCtrl.Token=response.data.accessToken;
        })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
          OdigoApisCtrl.OpStatus=error;
      });                
  };
  
//********************************
//ODIGO AGENT STATUS
//********************************
  OdigoApisCtrl.OdigoGetAgent = function(Token,Agent){
    console.log("--OdigoApisCtrl.OdigoGetAgent():",Token,Agent);
    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoGetAgent(Token,Agent);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          OdigoApisCtrl.userActiveSettings={};
          OdigoApisCtrl.userInfo=response.data;          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });                
  }; 

  OdigoApisCtrl.OdigoGetAgentActiveSettings = function(Token,Agent){
    console.log("--OdigoApisCtrl.OdigoGetAgentActiveSettings():",Token,Agent);
    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoGetAgentActiveSettings(Token,Agent);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          OdigoApisCtrl.userActiveSettings=response.data[0];
          console.log('OdigoApisCtrl.userActiveSettings:',OdigoApisCtrl.userActiveSettings);                              
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });                
  }; 



//ODIGO API COMANDS

  //HANGUP  
  OdigoApisCtrl.OdigoHangUp = function(){
    console.log('>>>OdigoHangUp()')
    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoHangUp(OdigoApisCtrl.Token,OdigoApisCtrl.OdigoCallInfo.UserLogin);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);
          console.log('>>>OdigoHangUp()')          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
          console.log('>>>OdigoHangUp()')
      });                
  };    

  //OdigoStartRecord  
  OdigoApisCtrl.OdigoStartRecord = function(Token,Agent){
    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoStartRecord(Token,Agent);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });                
  };    
  

  //END WRAPUP
  OdigoApisCtrl.OdigoEndWrapUp = function(){
    OdigoApisCtrl.OpStatus='';
    OdigoApisCtrl.CallReasonCreate={};
    OdigoApisCtrl.CallReasonCreate.agentId=OdigoApisCtrl.OdigoCallInfo.UserLogin;
    OdigoApisCtrl.CallReasonCreate.callId=OdigoApisCtrl.OdigoCallInfo.CallRef;
    OdigoApisCtrl.CallReasonCreate.gateId=OdigoApisCtrl.OdigoCallInfo.GateId;
    OdigoApisCtrl.CallReasonCreate.keyboardDuration=0;
    var reason={};
    reason.key='';
    reason.value='';
    OdigoApisCtrl.CallReasonCreate.reasons=[reason];
    OdigoApisCtrl.CallReasonCreate.storing=true;
    OdigoApisCtrl.CallReasonCreate.wrapUpEnd=true;
    

      var promise= OdigoApisService.OdigoEndWrapUp(OdigoApisCtrl.Token,OdigoApisCtrl.OdigoCallInfo.UserLogin,OdigoApisCtrl.CallReasonCreate);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });                
  };

/////////////////////////////////////////////////////
//           END SESSION OF CALL SETTING DATA     ///
/////////////////////////////////////////////////////    
/////////////////////////////////////////////////////
//           REASONS OF CONVERSATIONS             ///
/////////////////////////////////////////////////////    
  OdigoApisCtrl.SetReasonsOfConversation = function(){
    console.log('--> SetReasonsOfConversation()');            
    OdigoApisCtrl.ReasonsOfConversation={};
    OdigoApisCtrl.ReasonsOfConversation.freeReasonsOfConversation={};
    OdigoApisCtrl.ReasonsOfConversation.freeReasonsOfConversation=[
        {
          "label" : "Motivo Interaccion",
          "value" : OdigoApisCtrl.CrmSelectedContact.Outcome.Motivo,
          "order":1
        },
        {
          "label" : "Ofrecido Television",
          "value" : OdigoApisCtrl.CrmSelectedContact.Outcome.OfreTv,
          "order":2
        },
        {
          "label" : "Ofrecido factura electronica",
          "value" : OdigoApisCtrl.CrmSelectedContact.Outcome.OfreFacElec,
          "order":3
        },        
        {
          "label" : "Ofrecido promociones",
          "value" : OdigoApisCtrl.CrmSelectedContact.Outcome.OfrePromo,
          "order":4
        },                    
        {
          "label" : "Ofrecido segunda linea 50%",
          "value" : OdigoApisCtrl.CrmSelectedContact.Outcome.OfreSecLine,
          "order":5
        },        
        {
          "label" : "Persona Contactada",
          "value" : OdigoApisCtrl.CrmSelectedContact.Outcome.PerContacto,
          "order":6
        },                
        {
          "label" : "Informamos GDPR",
          "value" : OdigoApisCtrl.CrmSelectedContact.Outcome.Gdpr,
          "order":7
        }
      ];

  OdigoApisCtrl.ReasonsOfConversation.reasonsOfConversation=[OdigoApisCtrl.CrmSelectedContact.Outcome.Comments];
   
    OdigoApisCtrl.ReasonsOfConversation.conversationNumber=OdigoApisCtrl.OdigoCallInfo.CallRef.substring(23, 24);
    OdigoApisCtrl.ReasonsOfConversation.sessionReference=OdigoApisCtrl.OdigoCallInfo.CallRef.substring(20, 22);    
    console.log(OdigoApisCtrl.ReasonsOfConversation);
    var promise= OdigoApisService.ReasonsOfConversation(OdigoApisCtrl.Token,OdigoApisCtrl.OdigoCallInfo.UserLogin,'DE01',OdigoApisCtrl.OdigoCallInfo.CallRef.substring(0, 20),OdigoApisCtrl.ReasonsOfConversation);
    promise.then(function (response) {          
        OdigoApisCtrl.OpStatus='200';
        console.log('Then:',response.data);          
        console.log('<-- SetReasonsOfConversation()');
        console.log('>>>> limpiando pantalla');          
        $state.go('profile');
        console.log('<<<< limpiando pantalla');
      })
      .catch(function (error) {
        console.log("Error:",error.status);        
        OdigoApisCtrl.OpStatus=error.status;
        $state.go('profile');        
        console.log('<-- SetReasonsOfConversation()');
    });                
  };

  //ANSWER
  OdigoApisCtrl.OdigoAnswer = function(Token){    
    OdigoApisCtrl.OpStatus='';
  };


OdigoApisCtrl.getTokenFromApi();


}//FIN CONTROLER

  

}//FIN FUNCION INICIAL
)();
