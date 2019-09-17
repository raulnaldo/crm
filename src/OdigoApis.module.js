(function() {
"use strict";

angular.module('OdigoApisModule', [])
.constant('ApiPath', 'https://paas-de01.prosodie.com:443/agent/v1/agents/')
.constant('ApiAuthPath', 'https://paas-de01.prosodie.com:443/auth/v2/routing_de01/direct-access-claim-sets')
.constant('CI360ApiPath', 'https://paas-de01.prosodie.com:443')
.constant('userUid', 'agent176ddi@demo.com')
.constant('appUid', 'fxBYAMsu7Ja9OM3ezAhLAvLPLRsa')


.config(config);

config.$inject = ['$httpProvider'];
function config($httpProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
}




})();