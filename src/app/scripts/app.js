'use strict';

angular
  .module('flipperUiApp', ['fuMenu', 'fuGame', 'ui.bootstrap', 'ui.router'])
  .config(function($urlRouterProvider) {
    //
    // For any unmatched url, redirect to /menu
    $urlRouterProvider.otherwise('/menu');
    //
    // Now set up the st
  });
