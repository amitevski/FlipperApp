'use strict';

module.exports = function(ui, solenoid, lamp) {
  return {
    initialState: "Menu",

    states: {
      inGame: {
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
            ui.startSelectedGame()
          }
        },
        states: {},
        entry: function () {
          ui.openMenu();
          console.log('dummy');
          //update ui state
        }
      }
    }
  }
};
