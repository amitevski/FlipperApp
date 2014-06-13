'use strict';

module.exports = function(ui, solenoid, lamp) {
  return {


    swe1: {
      UpperJetBumperDown: function() {
        solenoid.fire('UpperBumper');
        this.dispatch('BlinkLamp', {id:'UpperJet', duration:20});
        this.dispatch('addPoints', 5000);
      },
      MiddleJetBumperDown: function() {
        solenoid.fire('MiddleBumper');
        this.dispatch('BlinkLamp', {id:'MiddleJets', duration:20});
        this.dispatch('addPoints', 5000);
      },
      LowerJetBumperDown: function() {
        solenoid.fire('LowerBumper');
        this.dispatch('BlinkLamp', {id:'LowerJet', duration:20});
        this.dispatch('addPoints', 5000);
      },
      LeftSlingshotDown: function() {
        this.dispatch('Slingshot', 'Left');
      },
      RightSlingshotDown: function() {
        this.dispatch('Slingshot', 'Right');
      },
      Slingshot: function(side) {
        this.dispatch('BlinkLamp', {id: side + 'SlingGIUpper', duration:20});
        this.dispatch('BlinkLamp', {id: side + 'SlingGILower', duration:20});
        solenoid.fire(side + 'Slingshot');
        this.dispatch('addPoints', 10000);
      },

      bankFull: function() {
         this.dispatch('addPoints', 500000);
      },
      states: {

      },
      entry: function () {
        //update ui state
        lamp.on('StartButton');
        this.RightBank = {
          Upper: false,
          Middle: false,
          Lower: false
        };
        this.LeftBank = {
          Upper: false,
          Middle: false,
          Lower: false
        };
      },
      exit: function() {

      }
    }
  };
};

