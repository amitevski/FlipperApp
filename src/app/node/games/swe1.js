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
              ShieldHitDown: function() {},
              LeftDropTargetDown: {target: 'LeftCenterHit'},
              RightDropTargetDown: {target: 'LeftCenterHit'},
              entry: function() {
                ui.setTargets(['left','','right']);
              }
            },
            LeftHit: {
              LeftDropTargetDown: function() {},
              RightDropTargetDown: {target: 'RightCenterHit'},
              ShieldHitDown: {target: 'LeftCenterHit'},
              entry: function() {
                ui.setTargets(['','center','right']);
              }
            },
            RightHit: {
              RightDropTargetDown: function() {},
              LeftDropTargetDown: {target: 'LeftRightHit'},
              ShieldHitDown: {target: 'RightCenterHit'},
              entry: function() {
                ui.setTargets(['left','center','']);
              }
            },
            LeftRightHit: {
              entry: function() {
                ui.setTargets(['','center','']);
              },
              LeftDropTargetDown: function() {},
              RightDropTargetDown: function() {},
              ShieldHitDown: {target: 'swe1'} //finish subgame
            },
            LeftCenterHit: {
              entry: function() {
                ui.setTargets(['','','right']);
              },
              LeftDropTargetDown: function() {},
              ShieldHitDown: function() {},
              RightDropTargetDown: {target: 'swe1'} //finish subgame
            },
            RightCenterHit: {
              entry: function() {
                ui.setTargets(['left','','']);
              },
              RightDropTargetDown: function() {},
              ShieldHitDown: function() {},
              LeftDropTargetDown: {target: 'swe1'} //finish subgame
            }
          },

          entry: function() {
            ui.setTargets(['left','center','right']);
            ui.setGameMessage('shoot the 3 targets below');
          },
          exit: function() {
            ui.setTargets(['','','']);
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

