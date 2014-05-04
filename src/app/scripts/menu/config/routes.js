/**
 * Created by acomitevski on 03/05/14.
 */


angular.module('fuMenu')
  .config(function($stateProvider){
    $stateProvider
      .state('menu', {
        url: '/menu',
        templateUrl: 'scripts/menu/views/menu.html',
        controller: 'MenuController'
      });
  });