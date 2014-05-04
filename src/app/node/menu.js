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
        LeftFlipperButton: {
          action: function (args) {
            switch (args.state) {
              case false:
                console.log('fire solenoid');

                break;
              case true:
                console.log('release solenoid');
                break;
              default:
            }
          }
        },
        start: {target: 'Menu'},
        states: {
        },
        entry: function () {
          console.log('entering game');
          //update ui state
        }
      },
      Menu: {
        // Menu events
        start: {
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
