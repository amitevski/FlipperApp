'use strict';

module.exports = function(ui, solenoid, lamp) {
  return {


    swe1: {

      states: {

      },
      entry: function () {
        //update ui state
        lamp.on('StartButton');
        console.log("entering swe1");
      }
    }
  }
};

