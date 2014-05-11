/**
 * Created by acomitevski on 04/05/14.
 */

'use strict';


angular.module('fuGame')
  .config(function($stateProvider){
    $stateProvider
      .state('game', {
        url: '/game/:gameName',
        templateUrl: 'scripts/game/views/game.html',
        controller: 'GameController'
      });
  });