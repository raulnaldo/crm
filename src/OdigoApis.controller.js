//http://localhost:3000/Apis.html#?agentId=agente176ddi@demo.com&gate=InfoGate&callref=98769dsfjsdfj9079087
(function () {
"use strict";

angular.module('OdigoApisModule')
.controller('OdigoApisController', OdigoApisController);

OdigoApisController.$inject = ['$location','OdigoApisService','userUid','appUid','$scope','$sce','$window'];
function OdigoApisController($location,OdigoApisService,userUid,appUid,$scope, $sce,$window) {  

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
  OdigoApisCtrl.OdigoHangUp = function(Token,Agent){
    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoHangUp(Token,Agent);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
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
  OdigoApisCtrl.OdigoEndWrapUp = function(Token,Agent){
    OdigoApisCtrl.OpStatus='';
    OdigoApisCtrl.CallReasonCreate={};
    OdigoApisCtrl.CallReasonCreate.agentId=OdigoApisCtrl.userUid;
    OdigoApisCtrl.CallReasonCreate.callId=OdigoApisCtrl.OdigoCallInfo.CallRef;
    OdigoApisCtrl.CallReasonCreate.gateId=OdigoApisCtrl.OdigoCallInfo.GateId;
    OdigoApisCtrl.CallReasonCreate.keyboardDuration=0;
    var reason={};
    reason.key='Folder';
    reason.value='Valor De Reason';
    OdigoApisCtrl.CallReasonCreate.reasons=[reason];
    OdigoApisCtrl.CallReasonCreate.storing=true;
    OdigoApisCtrl.CallReasonCreate.wrapUpEnd=true;
    

      var promise= OdigoApisService.OdigoEndWrapUp(Token,Agent,OdigoApisCtrl.CallReasonCreate);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });                
  };

    //CALL CODIFICATIONS
  OdigoApisCtrl.OdigovalidateCallCodifications = function(Token,Agent){
    OdigoApisCtrl.OpStatus='';
    OdigoApisCtrl.CallCodification={};

    OdigoApisCtrl.CallCodification.callBackId='';
    OdigoApisCtrl.CallCodification.callId=OdigoApisCtrl.OdigoCallInfo.CallRef;
    OdigoApisCtrl.CallCodification.campaignId='';
    var field={};
    field.label='Folder';
    field.order=1;
    field.value='123456';
    OdigoApisCtrl.CallCodification.fields=[ 
        {
        "label" : "CallRef",
        "value" : OdigoApisCtrl.OdigoCallInfo.CallRef,
        "order" : 1
        },
        {
        "label" : "CallComments",
        "value" : "Estos son los comentarios",
        "order" : 2
        }
        ];
    OdigoApisCtrl.CallCodification.gateKeyWord='gt_demo_176';
    OdigoApisCtrl.CallCodification.isStoringRecord=true;

    OdigoApisCtrl.CallCodification.reasons=[ 
      {
        "id" : 193,
        "label" : "OtherBank"
      }
    ];

    var promise= OdigoApisService.OdigovalidateCallCodifications(Token,Agent,OdigoApisCtrl.CallCodification);
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
//           REASONS OF CONVERSATIONS             ///
/////////////////////////////////////////////////////    
  OdigoApisCtrl.SetReasonsOfConversation = function(Token,Agent){
    console.log('--> SetReasonsOfConversation()');
    console.log(Token,Agent);
    console.log(OdigoApisCtrl);
    OdigoApisCtrl.OpStatus='';

   
    OdigoApisCtrl.ReasonsOfConversation.conversationNumber=OdigoApisCtrl.OdigoCallInfo.CallRef.substring(23, 24);
    OdigoApisCtrl.ReasonsOfConversation.sessionReference=OdigoApisCtrl.OdigoCallInfo.CallRef.substring(20, 22);    
    console.log(OdigoApisCtrl.ReasonsOfConversation);
    var promise= OdigoApisService.ReasonsOfConversation(Token,Agent,'DE01',OdigoApisCtrl.OdigoCallInfo.CallRef.substring(0, 20),OdigoApisCtrl.ReasonsOfConversation);
    promise.then(function (response) {          
        OdigoApisCtrl.OpStatus='200';
        console.log('Then:',response.data);          
        console.log('<-- SetReasonsOfConversation()');
      })
      .catch(function (error) {
        console.log("Error:",error.status);
        OdigoApisCtrl.OpStatus=error.status;
        console.log('<-- SetReasonsOfConversation()');
    });                
  };


/////////////////////////////////////////////////////
//           END SESSION OF CALL SETTING DATA     ///
/////////////////////////////////////////////////////    
  OdigoApisCtrl.EndSessionSettingData = function(Token,Agent){
    console.log('--> EndSessionSettingData()');
    console.log(Token,Agent);
    console.log(OdigoApisCtrl);
    OdigoApisCtrl.OpStatus='';

   
    OdigoApisCtrl.ReasonsOfConversation.conversationNumber=OdigoApisCtrl.OdigoCallInfo.CallRef.substring(23, 24);
    OdigoApisCtrl.ReasonsOfConversation.sessionReference=OdigoApisCtrl.OdigoCallInfo.CallRef.substring(20, 22);    
    console.log(OdigoApisCtrl.ReasonsOfConversation);


    //First we hangup de call

    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoHangUp(Token,Agent);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);
          //Set the codification
          var promiseII= OdigoApisService.ReasonsOfConversation(Token,Agent,'DE01',OdigoApisCtrl.OdigoCallInfo.CallRef.substring(0, 20),OdigoApisCtrl.ReasonsOfConversation);
          promiseII.then(function (response) {          
              OdigoApisCtrl.OpStatus='200';
              console.log('Then:',response.data);          
              console.log('<-- EndSessionSettingData()');

              //EndWrapUpTimeOut              
              OdigoApisCtrl.OpStatus='';
              OdigoApisCtrl.CallReasonCreate={};
              OdigoApisCtrl.CallReasonCreate.agentId=OdigoApisCtrl.userUid;
              OdigoApisCtrl.CallReasonCreate.callId=OdigoApisCtrl.OdigoCallInfo.CallRef;
              OdigoApisCtrl.CallReasonCreate.gateId=OdigoApisCtrl.OdigoCallInfo.GateId;
              OdigoApisCtrl.CallReasonCreate.keyboardDuration=0;
              var reason={};
              reason.key='Folder';
              reason.value='Valor De Reason';
              OdigoApisCtrl.CallReasonCreate.reasons=[reason];
              OdigoApisCtrl.CallReasonCreate.storing=true;
              OdigoApisCtrl.CallReasonCreate.wrapUpEnd=true;
              var promiseIII= OdigoApisService.OdigoEndWrapUp(Token,Agent,OdigoApisCtrl.CallReasonCreate);
              promiseIII.then(function (response) {
                    OdigoApisCtrl.OpStatus='200';
                    console.log('Then:',response.data);          
                  })
                  .catch(function (error) {
                    console.log("Error:",error.status);
                    OdigoApisCtrl.OpStatus=error.status;
                });
            })
            .catch(function (error) {
              console.log("Error:",error.status);
              OdigoApisCtrl.OpStatus=error.status;
              console.log('<-- EndSessionSettingData()');
          });                


        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });

    //Set the codification



    


               
  };


    //GET VOICE INTERACTIONS
  OdigoApisCtrl.GetVoiceInteraction = function(Token,Agent){
    console.log('--> GetVoiceInteraction()');
    console.log(Token,Agent);

    var promise= OdigoApisService.GetVoiceInteraction(Token,Agent,'DE01','5d3afb13Vel1j00002fe');
    promise.then(function (response) {
        OdigoApisCtrl.OpStatus='200';
        console.log('Then:',response.data);          
        console.log('<-- GetVoiceInteraction()');
      })
      .catch(function (error) {
        console.log("Error:",error.status);
        OdigoApisCtrl.OpStatus=error.status;
        console.log('<-- GetVoiceInteraction()');
    });                
  };

  //GATE CODIFICATIONS SETTINGS  
  OdigoApisCtrl.OdigoGetGateCodificationSettings = function(Token,Agent){
    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoGetGateCodificationSettings(Token,Agent);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });                
  };  


  //GATE CODIFICATIONS

  OdigoApisCtrl.OdigoGetGateCodifications = function(Token,Agent,Gate){
    OdigoApisCtrl.OpStatus='';
      var promise= OdigoApisService.OdigoGetGateCodifications(Token,Agent,Gate);
      promise.then(function (response) {
          OdigoApisCtrl.OpStatus='200';
          console.log('Then:',response.data);          
        })
        .catch(function (error) {
          console.log("Error:",error.status);
          OdigoApisCtrl.OpStatus=error.status;
      });                
  };

  //ANSWER
  OdigoApisCtrl.OdigoAnswer = function(Token){    
    OdigoApisCtrl.OpStatus='';
  };


//ATTACH TO VIDEO

OdigoApisCtrl.OdigoLoadVideo = function(pVideoRoom){    
    console.log(pVideoRoom);
    //OdigoApisCtrl.videSessionUrl='https://webrtc.demo.ivrpowers.com/webclient?theme=odigo&autocall=false&callerid='+pVideoRoom;
    //$window.open('https://webrtc.demo.ivrpowers.com/split_agent_popup?theme=odigo&room='+pVideoRoom);
    $scope.currentProjectUrl = $sce.trustAsResourceUrl('https://webrtc.demo.ivrpowers.com/split_agent_popup?theme=odigo&room='+pVideoRoom);    
    console.log(OdigoApisCtrl.videSessionUrl);
};



}


})();
