'use strict';

var Base;

Base = {
  initialState: "Menu",

  states: {
    inGame: {
      LeftFlipperButton: {
        action: function(args) {
          switch (args.state) {
            case false:
              console.log('fire solenoid');
            case true:
              console.log('release solenoid');
            default:
          }
        }
      },
      start: {target: 'Menu'},
      states: {
      },
      entry: function() {
        console.log('entering game');
      //update ui state
      }
    },
    Menu: {
      // Menu events

      states: {},
      entry: function() {
        console.log('dummy');
        //update ui state
      }
    }
  }
};

module.exports = Base;
