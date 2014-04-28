'use strict';

angular
  .module('flipperUiApp', [])
  .run(function() {
    console.log(process.mainModule);
//    process.mainModule.exports.runServer();
    var server = require('./node/index');
//    console.log(server);
    server.runServer();
  });
