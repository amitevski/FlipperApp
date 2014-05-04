/**
 * Created by acomitevski on 04/05/14.
 */

'use strict';

angular.module('fuNodeInterface')
  .factory('serverInterface', function() {
    var server = require('./node/index');
    server.runServer();
    return server.Game;
  });