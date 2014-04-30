'use strict';

angular
  .module('flipperUiApp', ['fuMenu'])
  .run(function() {
    var server = require('./node/index');
    server.runServer();
  });
