(function() {
"use strict";

angular.module('SeniorApisModule', ['ui.router'])
.constant('ApiPath', 'https://paas-de01.prosodie.com:443/agent/v1/agents/')
.constant('ApiAuthPath', 'https://paas-de01.prosodie.com:443/auth/v2/routing_de01/direct-access-claim-sets')
.constant('CI360ApiPath', 'https://paas-de01.prosodie.com:443')
.constant('userUid', 'agent176ddi@demo.com')
.constant('appUid', 'fxBYAMsu7Ja9OM3ezAhLAvLPLRsa')
.constant('DataPath', 'https://raulnaldo.github.io/crm/data//')
.constant('DataPathLocal', 'https://localhost:3000/data/')
.constant('DataPathGit', 'https://raulnaldo.github.io/crm/data/')
.constant('HerokuBackEnd', 'https://seniorbackend.herokuapp.com/')
.constant('DynamicsEndPoint', 'https://crm838148.crm4.dynamics.com/api/data/v9.1/')

//http://localhost:8080/
//https://seniorbackend.herokuapp.com/


 
.config(config)
.config(RoutesConfig);
//
config.$inject = ['$httpProvider'];
function config($httpProvider) {
//  $httpProvider.interceptors.push('loadingHttpInterceptor');
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function RoutesConfig($stateProvider, $urlRouterProvider) {

  // Redirect to tab 1 if no other URL matches
  $urlRouterProvider.otherwise('/profileVideo');

  // Set up UI states
  $stateProvider
    .state('profileVideo', {
      url: '/profileVideo',
      templateUrl: 'src/templates/profileVideo.html'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'src/templates/profile.html'
    })

    .state('invoice', {
      url: '/invoice',
      templateUrl: 'src/templates/invoice.html'
    })

    .state('calendar', {
      url: '/calendar',
      templateUrl: 'src/templates/calendar.html'
    })

    .state('codificar', {
      url: '/codificar',
      templateUrl: 'src/templates/codificar.html'
    })
    
    .state('statistics', {
      url: '/statistics',
      templateUrl: 'src/templates/statistics.html'
    })

    .state('cleared', {
      url: '/cleared',
      templateUrl: 'src/templates/cleared.html'
    })
    .state('notfound', {
      url: '/notfound',
      templateUrl: 'src/templates/notfound.html'
    })   
    .state('video_ivp', {
      url: '/video_ivp',
      templateUrl: 'src/templates/video_ivp.html'
    })    
    .state('listaVideo', {
      url: '/listaVideo',
      templateUrl: 'src/templates/listaVideo.html'
    })        
    ;
}



})();