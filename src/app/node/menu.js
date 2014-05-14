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
            console.log('fire left action solenoid');
          }
        },
        LeftFlipperButtonUp: {
          action: function () {
            console.log('release left action solenoid');
          }
        },
        RightFlipperButtonDown: {
          action: function () {
            console.log('fire right action solenoid');
          }
        },
        RightFlipperButtonUp: {
          action: function () {
            console.log('release right action solenoid');
          }
        },
        StartDown: {target: 'Menu'},
        states: {
        },
        entry: function () {
          console.log('entering game');
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
