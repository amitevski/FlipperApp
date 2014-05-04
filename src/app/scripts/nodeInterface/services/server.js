/**
 * Created by acomitevski on 04/05/14.
 */

'use strict';

angular.module('fuNodeInterface')
  .factory('serverInterface', function() {
    var Server = require('./node/index'),
      server = new Server();
    server.run();
    return server;
  });