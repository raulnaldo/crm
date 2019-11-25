(function () {
"use strict";

angular.module('SeniorApisModule')
.service('SeniorApisDynamicsService', SeniorApisDynamicsService);


SeniorApisDynamicsService.$inject = ['$http', 'DynamicsEndPoint'];
function SeniorApisDynamicsService($http, DynamicsEndPoint) {
  var service = this;

  service.GetContactByMobilePhone = function(pMobile){
    console.log(">>>> Dynamics.GetContactByMobilePhone()");
    console.log("---->>>> pMobile:",pMobile);    
    var response = $http({
      method: "GET",
      headers: {
         'Content-Type': 'application/json',
         'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiJodHRwczovL2NybTgzODE0OC5jcm00LmR5bmFtaWNzLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzkxNzcyZmRkLTE2ODMtNDBjZS1iNDVhLTQwOGVmZTliMTM3Mi8iLCJpYXQiOjE1NzQ2MjUzMDAsIm5iZiI6MTU3NDYyNTMwMCwiZXhwIjoxNTc0NjI5MjAwLCJhY3IiOiIxIiwiYWlvIjoiQVNRQTIvOE5BQUFBbjlIRzFheHU2SUZXZUpkSTFlN1l4bVhxa1RkSFQ2ZXFjKzVrQzVyamZqRT0iLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiZWQ4YjI1NTktMGJiMS00YmI1LWJkM2YtNjc1OTJjZGE5ZWEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJBZG1pbmlzdHJhdG9yIiwiZ2l2ZW5fbmFtZSI6Ik1PRCIsImlwYWRkciI6Ijc3LjIyNC41NS42OCIsIm5hbWUiOiJNT0QgQWRtaW5pc3RyYXRvciIsIm9pZCI6ImY0NmRlOWJlLWM3MjItNGU1MC1iZDZjLTI3OGZjMDE1OWE0MSIsInB1aWQiOiIxMDAzMjAwMDg5MUQ5MDUwIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiQjhJa2NPV1dIQ2N1Nm5CUXpwSk53aGdIUEJMb0dIN1BsTW05OGdZalo4RSIsInRpZCI6IjkxNzcyZmRkLTE2ODMtNDBjZS1iNDVhLTQwOGVmZTliMTM3MiIsInVuaXF1ZV9uYW1lIjoiYWRtaW5AQ1JNODM4MTQ4Lm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6ImFkbWluQENSTTgzODE0OC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJTeGY2YkQwSjdFdS1waGlia2JFUUFBIiwidmVyIjoiMS4wIn0.j0HZuuUZjzpQR2bw-Mf5LigmOTreQd9R0ntdblti0y5c3eaoEKVhdksnWbfveD9FMGEDDdES7tE-j5zRDrfUluJSefTZ856ebh3JZVCNixvWAgj75bZVAflKO8vKVti7b94lk_6n7AInYQNNNAAhFL-OM_F7CW8lBFFWY8Kd7mueJT6gED39cd8UA_aFMedblV19_UgjVh3Xo_1ovzG0CznQKuIr9UNoEjSch3Nnha_gWwMaOzcZX60MRCH9y3SJ2uCtL53AB6L7lG71UMkhLpmGkTi9AT3jldz33dGt_vWZn-KfWhI-nq27CABKqWlj7g4P1pq5iGGSp7bpgM5vMA'   
       },
      url: (DynamicsEndPoint +'contacts?$select=firstname,lastname&$filter=mobilephone eq \''+ pMobile +'\'')
    });
    console.log("<<<< Dynamics.GetContactByMobilePhone()");
    return response;
  }



//FIN DE FUNCIONES DE SERVICIO
}//FIN SERVICIO

})();