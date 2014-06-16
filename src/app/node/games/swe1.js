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
      ShieldHitDown: {target: 'ShieldHitDown1'},
      states: {
        ShieldHitDown1: {
          ShieldHitDown: {target: 'SubGameSimple'},
          entry: function() {
            ui.setGameMessage('hit shield again to start simple game');
          }
        },
        SubGameSimple: {
          ShieldHitDown: {target: 'CenterHit'},
          LeftDropTargetDown: {target: 'LeftHit'},
          RightDropTargetDown: {target: 'RightHit'},
          states: {
            CenterHit: {
              LeftDropTargetDown: {target: 'LeftCenterHit'},
              RightDropTargetDown: {target: 'LeftCenterHit'}
            },
            LeftHit: {
              RightDropTargetDown: {target: 'RightCenterHit'},
              ShieldHitDown: {target: 'LeftCenterHit'}
            },
            RightHit: {
              LeftDropTargetDown: {target: 'LeftRightHit'},
              ShieldHitDown: {target: 'RightCenterHit'}
            },
            LeftRightHit: {
              ShieldHitDown: {target: 'swe1'} //finish subgame
            },
            LeftCenterHit: {
              RightDropTargetDown: {target: 'swe1'} //finish subgame
            },
            RightCenterHit: {
              LeftDropTargetDown: {target: 'swe1'} //finish subgame
            }
          },

          entry: function() {
            ui.setGameMessage('shoot the 3 targets below');
          },
          exit: function() {
            this.dispatch('addPoints', 10000000);
            ui.resetGameMessage();
          }
        }
      },
      entry: function () {
        //update ui state

      },
      exit: function() {

      }
    }
  };
};

