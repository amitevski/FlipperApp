/**
 * Created by acomitevski on 04/05/14.
 */
'use strict';

/*jshint expr: true*/
/*jshint laxcomma: true*/

var uiMock,
  solenoidMock,
  lampMock,
  menu = require(root + 'menu'),
  _ = require('underscore'),
  Statechart = require('statechart'),
  MenuHsm;


describe('Menu HSM', function() {

  beforeEach(function() {
    uiMock = {
      openMenu: sinon.spy()
      ,startSelectedGame: sinon.spy()
      ,nextGame: sinon.spy()
      ,prevGame: sinon.spy()
      ,setPoints: sinon.spy()
    };
    solenoidMock = {
      fire: sinon.spy()
      ,release: sinon.spy()
    };
    lampMock = {
      on: sinon.spy()
      ,off: sinon.spy()
      ,toggle: sinon.spy()
    };
    MenuHsm = _.extend(menu(uiMock, solenoidMock, lampMock), Statechart);
  });
  afterEach(function() {
    MenuHsm = null;
    uiMock = null;
  });

  describe('entry', function() {
    it('should open menu in ui', function() {
      MenuHsm.run();
      uiMock.openMenu.should.have.been.calledOnce;
    });
  });
  describe('start', function() {
    it('should start selected game in ui', function() {
      MenuHsm.run();
      MenuHsm.dispatch('StartDown');
      uiMock.startSelectedGame.should.have.been.calledOnce;
      uiMock.openMenu.should.have.been.calledOnce;
    });
  });

  describe('RightActionButton', function() {
    it('should select next game', function() {
      MenuHsm.run();
      MenuHsm.dispatch('RightActionButtonDown');
      uiMock.nextGame.should.have.been.calledOnce;
    });
  });

  describe('LeftActionButton', function() {
    it('should select previous game', function() {
      MenuHsm.run();
      MenuHsm.dispatch('LeftActionButtonDown');
      uiMock.prevGame.should.have.been.calledOnce;
    });
  });

  describe('inGame State', function() {
    beforeEach(function() {
      MenuHsm.states.Menu.ingame = {target: 'inGame'};
      MenuHsm.run();
      MenuHsm.dispatch('ingame');
    });
    describe('entry', function() {
      it('should turn on base ambient lights', function(done) {
        setTimeout(function() {
          lampMock.on.should.have.been.calledWith('BottomArchLeftLeft');
          lampMock.on.should.have.been.calledWith('BottomArchRightRight');
          lampMock.on.should.have.been.calledWith('BottomArchRightLeft');
          lampMock.on.should.have.been.calledWith('BottomArchLeftRight');
          lampMock.on.should.have.been.calledWith('StartButton');
          done();
        }, 10);

      });
    });
    describe('exit', function() {
      it('should turn off base ambient lights', function() {
        MenuHsm.dispatch('exit');
        lampMock.off.should.have.been.calledWith('BottomArchLeftLeft');
        lampMock.off.should.have.been.calledWith('BottomArchRightRight');
        lampMock.off.should.have.been.calledWith('BottomArchRightLeft');
        lampMock.off.should.have.been.calledWith('BottomArchLeftRight');
        lampMock.off.should.have.been.calledWith('StartButton');

      });
    });
    describe('LeftFlipperButtonDown', function() {
      it('should fire LeftFlipperPower solenoid', function() {
        MenuHsm.dispatch('LeftFlipperButtonDown');
        solenoidMock.fire.should.have.been.calledWith('LeftFlipperPower');
      });
      it('should start timer for LeftFlipperHold solenoid', function() {
        MenuHsm.dispatch('LeftFlipperButtonDown');
        MenuHsm.LeftFlipperHoldTimer.should.be.defined;
      });
      it('should fire LeftFlipperHold solenoid after timeout', function(done) {
        MenuHsm.dispatch('LeftFlipperButtonDown');
        setTimeout(function() {
          solenoidMock.fire.should.have.been.calledWith('LeftFlipperHold');
          done();
        }, 22);
      });
    });
    describe('LeftFlipperButtonUp', function() {
      beforeEach(function() {
        MenuHsm.dispatch('LeftFlipperButtonDown');
        MenuHsm.dispatch('LeftFlipperButtonUp');
      });
      it('should clear  LeftFlipperHold timer', function () {
        expect(MenuHsm.LeftFlipperHoldTimer).to.equal(null);
      });
      it('should release LeftFlipperHold solenoid', function () {
        solenoidMock.release.should.have.been.calledWith('LeftFlipperHold');
      });
    });
    describe('RightFlipperButtonDown', function() {
      beforeEach(function() {
        MenuHsm.dispatch('RightFlipperButtonDown');
      });
      it('should fire RightFlipperPower solenoid', function() {
        solenoidMock.fire.should.have.been.calledWith('RightFlipperPower');
      });

      it('should start timer for RightFlipperHold solenoid', function() {
        MenuHsm.RightFlipperHoldTimer.should.be.defined;
      });
      it('should fire RightFlipperHold solenoid after timeout', function(done) {
        setTimeout(function() {
          solenoidMock.fire.should.have.been.calledWith('RightFlipperHold');
          done();
        }, 25);
      });
    });

    describe('RightFlipperButtonUp', function() {
      beforeEach(function() {
        MenuHsm.dispatch('RightFlipperButtonDown');
        MenuHsm.dispatch('RightFlipperButtonUp');
      });
      it('should clear  RightFlipperHold timer', function () {
        expect(MenuHsm.RightFlipperHoldTimer).to.equal(null);
      });
      it('should release RightFlipperHold solenoid', function () {
        solenoidMock.release.should.have.been.calledWith('RightFlipperHold');
      });
    });

    describe('SlingshotDown', function() {
      ['Left', 'Right'].map(function(side) {
        describe(side + 'SlingshotDown', function() {
          beforeEach(function() {
            MenuHsm.dispatch(side + 'SlingshotDown');
          });
          it('should blink '+ side +' sling GI lamps', function(done) {
            lampMock.on.should.have.been.calledWith(side + 'SlingGIUpper');
            lampMock.on.should.have.been.calledWith(side + 'SlingGILower');
            setTimeout(function() {
              lampMock.off.should.have.been.calledWith(side + 'SlingGIUpper');
              lampMock.off.should.have.been.calledWith(side + 'SlingGILower');
              done();
            }, 25);
          });

          it('should fire '+ side +' slingshot solenoid', function() {
            solenoidMock.fire.should.have.been.calledWith(side + 'Slingshot');
          });

          it('should add 10.000 points', function() {
            expect(MenuHsm.points).to.equal(10000);
          });
        });
      });

      describe('JetBumperDown', function() {
        ['Upper', 'Lower'].map(function(pos) {
          describe(pos + 'JetBumperDown', function() {
            beforeEach(function() {
              MenuHsm.points = 0;
              MenuHsm.dispatch(pos + 'JetBumperDown');
            });
            it('should blink '+ pos +' Jet Lamp', function(done) {
              lampMock.on.should.have.been.calledWith(pos +'Jet');
              setTimeout(function() {
                lampMock.off.should.have.been.calledWith(pos + 'Jet');
                done();
              }, 25);
            });
            it('should fire '+ pos +' bumper', function() {
              solenoidMock.fire.should.have.been.calledWith(pos + 'Bumper');
            });
            it('should add 5.000 points', function() {
              expect(MenuHsm.points).to.equal(5000);
            });
          });
        });
        describe('MiddleJetBumperDown', function() {
          beforeEach(function() {
            MenuHsm.dispatch('MiddleJetBumperDown');
          });
          it('should blink MiddleJet Lamp', function(done) {
            lampMock.on.should.have.been.calledWith('MiddleJets');
            setTimeout(function() {
              lampMock.off.should.have.been.calledWith('MiddleJets');
              done();
            }, 25);
          });
          it('should fire Middle bumper', function() {
            solenoidMock.fire.should.have.been.calledWith('MiddleBumper');
          });
          it('should add 5.000 points', function() {
            expect(MenuHsm.points).to.equal(5000);
          });
        });
      });
    });
  });
});
