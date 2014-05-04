'use strict';


var ui = require('./helpers/ui'),
  _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  Statechart = require('statechart'),
  gamesPath = path.join(__dirname, 'games'),
  flipperDriver = require('FlipperDriver').createDefault();


function FlipperServer() {
  this.games = [];
}



/**
 * load module and inject dependencies
 * @param module
 * @returns {*}
 */
FlipperServer.prototype.loadGameDefinitions = function(module) {
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
FlipperServer.prototype.mergeGames =
  function(menu, gamesPath) {
    var files = fs.readdirSync(gamesPath);
    var currentGame,
      currentFile;
    for (var i = 0, len = files.length; i < len; i++) {
      currentFile = [gamesPath, files[i]].join('/');
      currentGame = this.loadGameDefinitions(require(currentFile));
      for (var game in currentGame) {
        // add event for current game, that transitions to selected game
        menu.states[menu.initialState][game] = {target: game};
        _.extend(menu.states.inGame.states, currentGame);
        this.games.push({title: game});
      }
    }
  };

/**
 * load games from gamesPath
 * @returns {*}
 */
FlipperServer.prototype.loadHSM =
  function() {
    var menuHSM = this.loadGameDefinitions(require('./menu'));
    this.mergeGames(menuHSM, gamesPath);
    return menuHSM;
  };


/**
 * get events from flipperModel and dispatch to Game FSM
 * @param game
 */
FlipperServer.prototype.bindFlipperEvents =
  function(game) {
    flipperDriver.flipperModel.onAny(function(value){
      game.dispatch(value.name, value);
  });

//  flipperDriver.flipperModel.emit('RightActionButton', {name: 'RightActionButton'});
  setTimeout(function() {
    flipperDriver.flipperModel.emit('start', {name: 'start'});
    setTimeout(function() {
      game.dispatch('addPoints', 10000);
    }, 1000);
  }, 2*1000);

};

FlipperServer.prototype.run =
  function() {
    this.HSM = _.extend(this.loadHSM(), Statechart);

    this.HSM.run({ debug: function(msg) {

      console.log(msg);

    } });

    this.bindFlipperEvents(this.HSM);
  };

module.exports = FlipperServer;
