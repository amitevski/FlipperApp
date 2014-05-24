'use strict';

module.exports = function(ui, solenoid, lamp) {
  return {

    points: 0,

    initialState: 'Menu',

    states: {
      inGame: {
        LeftSlingshotDown: {
          action: function() {
            this.dispatch('Slingshot', 'Left');
          }
        },
        RightSlingshotDown: {
          action: function() {
            this.dispatch('Slingshot', 'Right');
          }
        },
        Slingshot: {
          action: function(side) {
            lamp.on(side + 'SlingGIUpper');
            lamp.on(side + 'SlingGILower');
            solenoid.fire(side + 'Slingshot');
            // TODO: move this to DriverFacade
            // and expose API method blink()
            setTimeout(function() {
              lamp.off(side + 'SlingGIUpper');
              lamp.off(side + 'SlingGILower');
            }, 100);
            this.dispatch('addPoints', 10000);
          }
        },
        addPoints: {
          action: function(points) {
            this.points += points;
            ui.setPoints(this.points);
          }
        },
        LeftFlipperButtonDown: {
          action: function () {
            this.dispatch('FlipperButtonDown', 'Left');
          }
        },
        LeftFlipperButtonUp: {
          action: function () {
            this.dispatch('FlipperButtonUp', 'Left');
          }
        },
        RightFlipperButtonDown: {
          action: function () {
            this.dispatch('FlipperButtonDown', 'Right');
          }
        },
        RightFlipperButtonUp: {
          action: function () {
            this.dispatch('FlipperButtonUp', 'Right');
          }
        },
        FlipperButtonDown: {
          action: function (side) {
            solenoid.fire(side + 'FlipperPower');
            this[side + 'FlipperHoldTimer'] = setTimeout(function() {
              solenoid.fire(side + 'FlipperHold');
            }, 20);
          }
        },
        FlipperButtonUp: {
          action: function (side) {
            if (this[side + 'FlipperHoldTimer']) {
              clearTimeout(this[side + 'FlipperHoldTimer']);
              this[side + 'FlipperHoldTimer'] = null;
            }
            solenoid.release(side + 'FlipperHold');
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
