(function () {
"use strict";

angular.module('OdigoApisModule')
.service('OdigoApisService', OdigoApisService);


OdigoApisService.$inject = ['$http', 'ApiPath','ApiAuthPath','CI360ApiPath','userUid','appUid'];
function OdigoApisService($http, ApiPath,ApiAuthPath,CI360ApiPath,userUid,appUid) {
  var service = this;



//********************************
// LISTADO DE AGETNES
//********************************

  service.getAgentProperties = function (pAgentLogin) {
    console.log(">>>> service.getAgentProperties()");
    var Agents=[
    {
      "Login":"agent176ddi@demo.com",
      "Name":"Raúl",
      "LastName":"Ortega Andrés",
      "Image" : "./images/Roa.jpg"
    },
    {
      "Login":"agent175ddi@demo.com",
      "Name":"Tatiana",
      "LastName":"Lloret",
      "Image" : "./images/Tatiana.png"
    }    
    ];
    var SelectedAgent= Agents[Agents.findIndex(x => x.Login === pAgentLogin)];    
    console.log("<<<<< service.getAgentProperties:",SelectedAgent);
    return SelectedAgent;    
  };


//********************************
// LISTADO DE CONTACTOS 
//********************************

  service.getContacs = function () {
    console.log(">>>> service.getContacs()");
    var Contacts=[
    {
      "Id":"1262",
      "Name":"Raúl",
      "LastName":"Ortega Andrés",      
      "JobPosition":"Presales engineer",
      "Address":"Mar Cantabrico 23",
      "CP":"28860",
      "City":"Paracuellos de Jarama",
      "Province":"Madrid",      
      "Phone":"0034699479614",
      "email":"raul.ortega@odigo.com",
      "Image" : "./images/Roa.jpg",
      "Comments" : "Cliente dado de alta en Noviembre de 2000.",
      "ContractMonthlyAmmount" :"68€",
      "ContractStartDate" :"25 Agosto 2016",
      "ContractDuration" :"Sin permanencia",
      "ContractRisk" :"Riesgo Bajo",
      "ContractDetails" :"Contrato residencial de largo plazo",            
      "Products" : [
        {"Product":"Linea Fibra 100Mb"},
        {"Product":"Linea movil 699479614"},
        {"Product":"Paquete datos 20 Gb"},
        {"Product":"Series HBO"}
      ],
      "Facturas" : [
        {"Factura":"Julio 68€"},
        {"Factura":"Agosto 68€"},
        {"Factura":"Septiembre 105€"},
        {"Factura":"Octubre 95€"}
      ],
      "Promos" : [
        {"Promo":"HBO 1 año gratis"},
        {"Promo":"Descuento 25% nueva linea"}
      ],
        "Dispositivos" : [
        {"Dispositivo":"Televisión"},
        {"Dispositivo":"Móvil"},
        {"Dispositivo":"Tablet"}
        ]     
    },
    {
      "Id":"1617",
      "Name":"Tatiana",
      "LastName":"Lloret",
      "JobPosition":"Presales engineer",      
      "Address":"Calle Avenida de la Pedriza 3",
      "CP":"28410",
      "City":" Manzanares el Real España",
      "Province":"Madrid",
      "Phone":"686093478",
      "email":"tatiana.lloret-iglesias@odigo.com",
      "Image" : "./images/Tatiana.png",
      "Comments" : "Uso del movil solo para los fines de semana.",
      "ContractMonthlyAmmount" :"35€",
      "ContractStartDate" :"10 Enero 2015",
      "ContractDuration" :"permanencia hasta Mayo 2020",
      "ContractRisk" :"Riesgo Medio",      
      "ContractDetails" :"Contrato de portabilidad desde la compañia Josefa Telecoming.",
      "Products" : [
        {"Product":"Linea Fibra 100Mb"},
        {"Product":"Linea movil 686093478"},
        {"Product":"Paquete datos 20 Gb"},
        {"Product":"Series HBO"}
      ],
      "Facturas" : [
        {"Factura":"Julio 53"},
        {"Factura":"Agosto 43€"},
        {"Factura":"Septiembre 68€"},
        {"Factura":"Octubre 88€"}
      ],
      "Promos" : [
        {"Promo":"HBO 1 año gratis"},
        {"Promo":"Descuento 25% nueva linea"}
      ]            
    },
    {
      "Id":"1301",
      "Name":"Jose Luis",
      "LastName":"Martinez Rubio",
      "JobPosition":"Account Manager",      
      "Address":"Avda la maliciosa 33",
      "CP":"28450",
      "City":"Tres Cantos",
      "Province":"Madrid",
      "Phone":"699479615",
      "email":"jose-luis.martinez-rubio@prosodie.com",
      "Image" : "./images/JoseLuis.jpg",
      "Comments" : "Ultima llamada realizada para pedir la portabilidad del servicio.",
      "ContractMonthlyAmmount" :"68€",
      "ContractStartDate" :"01 Enero 2018",
      "ContractDuration" :"permanencia hasta abril 2021",
      "ContractRisk" :"Riesgo Alto",      
      "ContractDetails" :"Contrato de linea particular migrada de una linea de empresa desde Jacinto comunications s.l",      
      "Products" : [
        {"Product":"Linea Fibra 100Mb"},
        {"Product":"Linea movil 686093478"},
        {"Product":"Paquete datos 20 Gb"},
        {"Product":"Series HBO"}
      ],
      "Facturas" : [
        {"Factura":"Octubre 88€"}
      ],
      "Promos" : [
        {"Promo":"HBO 1 año gratis"},
        {"Promo":"Descuento 25% nueva linea"}
      ],
      "Dispositivos" : [
        {"Dispositivo":"Televisión"},
        {"Dispositivo":"Móvil"},
        {"Dispositivo":"Tablet"}
        ]
    }         
    ];
    console.log("<<<<< service.getContacs()")
    return Contacts;
  };


  service.SelectContactById = function(pId,pContacts){
    console.log(">>>> service.SelectContactById()");
    console.log("---->>>> pId:",pId);
    console.log("---->>>> pContacts:",pContacts);  
    
    var IndexPosition=pContacts.findIndex(x => x.Id === pId);
    //var IndexPosition=pContacts.find(x => x.id === pId).foo;
    //var IndexPosition=pContacts.filter(x => x.Id === '45');
    console.log("  -->>>> Contact Index:",IndexPosition);  
    console.log("<<<< service.SelectContactById()");  
    return pContacts[IndexPosition];
  }

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



 


}

})();