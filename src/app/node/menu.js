'use strict';

module.exports = function(ui, solenoid, lamp) {
  return {

    points: 0,

    initialState: 'Menu',

    states: {
      inGame: {
        addPoints: {
          action: function(points) {
            this.points += points;
            ui.setPoints(this.points);
          }
        },
        LeftFlipperButtonDown: {
          action: function () {
            solenoid.fire('LeftFlipperPower');
            this.leftFlipperHoldTimer = setTimeout(function() {
              solenoid.fire('LeftFlipperHold');
            }, 20);
          }
        },
        LeftFlipperButtonUp: {
          action: function () {
            if (this.leftFlipperHoldTimer) {
              clearTimeout(this.leftFlipperHoldTimer);
              this.leftFlipperHoldTimer = null;
            }
            solenoid.release('LeftFlipperHold');
          }
        },
        RightFlipperButtonDown: {
          action: function () {
            solenoid.fire('RightFlipperPower');
            this.rightFlipperHoldTimer = setTimeout(function() {
              solenoid.fire('RightFlipperHold');
            }, 20);
          }
        },
        RightFlipperButtonUp: {
          action: function () {
            if (this.rightFlipperHoldTimer) {
              clearTimeout(this.rightFlipperHoldTimer);
              this.rightFlipperHoldTimer = null;
            }
            solenoid.release('RightFlipperHold');
          }
        },
        StartDown: {target: 'Menu'},
        states: {
        },
        entry: function () {
//          console.log('entering game');
          //update ui state
        }
      },
      Menu: {
        // Menu events
        StartDown: {
          action: function () {
            ui.startSelectedGame();
          }
        },
        RightActionButton: {
          action: function() {
            ui.nextGame();
          }
        },
        LeftActionButton: {
          action: function() {
            ui.prevGame();
          }
        },
        states: {},
        entry: function () {
          ui.openMenu();
        }
      }
    }
  };
};
