'use strict';


var base = require('./menu'),
  _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  Statechart = require('statechart'),
  gamesPath = path.join(__dirname, 'games');

var FlipperDriver = require('FlipperDriver');
var flipperDriver = FlipperDriver.createDefault();
//
//flipperDriver.flipperModel.onAny(function(value){
//  console.log(arguments);
//});
//
//flipperDriver.flipperModel.emit('test1', {name: 'test2'});
//
//return;

var mergeGames =
  function(files, filePath) {
    var currentGame,
      currentFile;
    for (var i = 0, len = files.length; i < len; i++) {
      currentFile = [filePath, files[i]].join('/');
      currentGame = require(currentFile);
      for (var game in currentGame) {
        base.states[base.initialState][game] = {target: game};
        _.extend(base.states['inGame'].states, currentGame);
      }
    }
  };

var runServer =
function() {
  var files = fs.readdirSync(gamesPath);
  mergeGames(files, gamesPath);


  var Game = _.extend(base, Statechart);


  Game.run({ debug: function(msg) {

    console.log(msg);

  } });



//  Game.dispatch('swe1');
//  Game.dispatch('LeftFlipperButton', {state: false});
//  Game.dispatch('LeftFlipperButton', {state: true});

//Game.dispatch('start');


};

exports.runServer =  runServer;
//runServer();