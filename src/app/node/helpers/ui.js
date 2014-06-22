/**
 * Created by acomitevski on 30/04/14.
 */

'use strict';

var util = require('util'),
  EventEmitter2 = require('eventemitter2').EventEmitter2;

function UI() {}

util.inherits(UI, EventEmitter2);

UI.prototype.setPoints = function(points) {
  this.emit('setPoints', points);
};

UI.prototype.startGame = function(gameTitle) {
  this.emit('startGame', gameTitle);
};

UI.prototype.openMenu = function() {
  this.emit('openMenu');
};


UI.prototype.startSelectedGame = function() {
  this.emit('startSelectedGame');
};


UI.prototype.nextGame = function() {
  this.emit('nextGame');
};

UI.prototype.prevGame = function() {
  this.emit('prevGame');
};

UI.prototype.setGameMessage = function(message) {
  this.emit('setGameMessage', message);
};

UI.prototype.resetGameMessage = function() {
  this.emit('setGameMessage', '');
};

UI.prototype.setTargets = function(targets) {
  this.emit('setTargets', targets);
};




module.exports = new UI();