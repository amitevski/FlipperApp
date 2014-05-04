/**
 * Created by acomitevski on 04/05/14.
 */

'use strict';

angular.module('fuNodeInterface')
  .factory('uiInterface', function($state) {
    var ui = require('./node/helpers/ui');
//    ui.on('startGame', function(gameName) {
//      $state.go('game', {game: gameName});
//    });
    return ui;
  });