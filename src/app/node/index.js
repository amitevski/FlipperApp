'use strict';


var ui = require('./helpers/ui'),
  _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  Statechart = require('statechart'),
  gamesPath = path.join(__dirname, 'games'),
  flipperDriver = require('FlipperDriver').createDefault();


/**
 * load module and inject dependencies
 * @param module
 * @returns {*}
 */
var loadGameDefinitions = function(module) {
  //inject Angular ui, solenoid and lamp
  return module(ui,
    flipperDriver.driverFacade.solenoid,
    flipperDriver.driverFacade.lamp
  );
};


/**
 * merge
 * @param menu
 * @param gamesPath
 */
var mergeGames =
  function(menu, gamesPath) {
    var files = fs.readdirSync(gamesPath);
    var currentGame,
      currentFile;
    for (var i = 0, len = files.length; i < len; i++) {
      currentFile = [gamesPath, files[i]].join('/');
      currentGame = loadGameDefinitions(require(currentFile));
      for (var game in currentGame) {
        // add event for current game, that transitions to selected game
        menu.states[menu.initialState][game] = {target: game};
        _.extend(menu.states['inGame'].states, currentGame);
      }
    }
  };

/**
 * load games from gamesPath
 * @returns {*}
 */
var loadGames =
  function() {
    var menu = loadGameDefinitions(require('./menu'));
    mergeGames(menu, gamesPath);
    return menu
  };


/**
 * get events from flipperModel and dispatch to Game FSM
 * @param game
 */
var bindFlipperEvents = function(game) {
  flipperDriver.flipperModel.onAny(function(value){
    game.dispatch(value.name, value);
  });

  flipperDriver.flipperModel.emit('swe1', {name: 'swe1'});
};

var runServer =
function() {
  this.Game = _.extend(loadGames(), Statechart);

  this.Game.run({ debug: function(msg) {

    console.log(msg);

  } });

  bindFlipperEvents(this.Game);

//  Game.dispatch('swe1');
//  Game.dispatch('LeftFlipperButton', {state: false});
//  Game.dispatch('LeftFlipperButton', {state: true});

};

exports.runServer =  runServer;
//runServer();