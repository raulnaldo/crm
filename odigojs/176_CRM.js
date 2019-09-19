try {
  console.log('-->> CRMCALL');
  //var BaseUrl="https://raulnaldo.github.io/crm/Crm_ui-route.html#/profile";
  var BaseUrl="https://localhost:3000/Crm_ui-route.html#/profile";

  //OBTENEMOS VALORES DE LA INTERACCION DESDE LA CONSOLA
  console.log(' --> ODIGO DATA()');   
  try{
    var vPHONE= odigo.getCustomerDdi();
    console.log(' >>>>> vPHONE()',vPHONE);   

  }
  catch(error) {
    console.error(error);
  }
  try{
    var vDATA = odigo.getHideFolder();
    console.log(' >>>>> vDATA()',vDATA);   
  }
  catch(error) {
    console.error(error);
  }

  try{
    var vCALLREF = odigo.getVoiceTaskId();
    console.log(' >>>>> vCALLREF()',vCALLREF);   
  }
  catch(error) {
    console.error(error);
  }

  try{
    var vCAMPAIGN = odigo.getVoiceGateLabel();
    console.log(' >>>>> vCAMPAIGN()',vCAMPAIGN);   
  }
  catch(error) {
    console.error(error);
  }

  try{
    var vAGENTNAME = odigo.getAgentFirstName();
    console.log(' >>>>> vAGENTNAME()',vAGENTNAME);   
  }
  catch(error) {
    console.error(error);
  }

  try{
    var vAGENLAST = odigo.getAgentLastName();
    console.log(' >>>>> vAGENLAST()',vAGENLAST);   
  }
  catch(error) {
    console.error(error);
  }

  try{
    var vLOGIN = odigo.getAgentLogin();
    console.log(' >>>>> vLOGIN()',vLOGIN);   
  }
  catch(error) {
    console.error(error);
  }

  try{
    var vGATE = odigo.getGateId(odigo.getVoiceTaskId());
    console.log(' >>>>> vGATE from getGateId()',vGATE);   
    if (vGATE==''){
      vGATE = odigo.getVoiceGateId();
      console.log(' >>>>> vGATE from getVoiceGateId()',vGATE);   
      if (vGATE==''){
        vGATE = odigo.getGateLabel();
        console.log(' >>>>> vGATE from getGateLabel()',vGATE);   
        if (vGATE==''){
          vGATE = odigo.getVoiceGateLabel();
          console.log(' >>>>> vGATE from getVoiceGateLabel()',vGATE);   
        }
      }
    }
  }
   catch(error) {
    console.error(error);
  }
  console.log(' <-- ODIGO DATA()');     
  console.log(' --> odigo.getCustomerSelected()');   
  var Url="";
  try{
    var vOdigoCustomer=odigo.getCustomerSelected('voice');
    console.log(' <--> CustomerSelected:',vOdigoCustomer);   
    if (vOdigoCustomer.id=='undefined'){
       Url=BaseUrl + '?UserLogin='+vLOGIN+'&CustomerCode=1262&CallRef='+vCALLREF+'&GateId='+vGATE;
    }  
    else{
       Url=BaseUrl + '?UserLogin='+odigo.getAgentLogin()+'&CustomerCode='+vOdigoCustomer.id+'&CallRef='+vCALLREF+'&GateId='+vGATE;
    }
   
  }
  catch(error){
     console.error(error);
     //Asignamos por defecto un codigo de cliente
     Url=BaseUrl + '?UserLogin='+vLOGIN+'&CustomerCode=1262&CallRef='+vCALLREF+'&GateId='+vGATE;
  }
  console.log(' <-- odigo.getCustomerSelected()');   
  console.log('######################################################');   
  console.log(' --> category.loadIframe(Url)',Url);   
  category.loadIframe(Url);
  console.log(' <-- category.loadIframe(Url)');     
console.log('######################################################');     
  console.log('<<-- CRMCALL');
}
catch(error) {
  console.error(error);
}
