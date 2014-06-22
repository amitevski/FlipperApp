/**
 * Created by acomitevski on 04/05/14.
 */
'use strict';

/*jshint expr: true*/
/*jshint laxcomma: true*/

var uiMock,
  solenoidMock,
  lampMock,
  sandbox,
  menu = require(root + 'menu'),
  _ = require('underscore'),
  Statechart = require('statechart'),
  MenuHsm;


describe('Menu HSM', function() {

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    uiMock = {
      openMenu: sandbox.spy()
      ,startSelectedGame: sandbox.spy()
      ,nextGame: sandbox.spy()
      ,prevGame: sandbox.spy()
      ,setPoints: sandbox.spy()
    };
    solenoidMock = {
      fire: sandbox.spy()
      ,release: sandbox.spy()
    };
    lampMock = {
      on: sandbox.spy()
      ,off: sandbox.spy()
      ,toggle: sandbox.spy()
    };
    MenuHsm = _.extend(menu(uiMock, solenoidMock, lampMock), Statechart);
  });
  afterEach(function() {
    sandbox.restore();
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
    describe('TroughBall4Down', function() {
      it('should not fire solenoid if shooter lane is down', function() {
        MenuHsm.dispatch('ShooterLaneDown');
        MenuHsm.dispatch('TroughBall4Down');
        MenuHsm.dispatch('TroughBall4Down');
        // first call is on entry inGame
        solenoidMock.fire.should.have.callCount(1);
      });
      it('should re-enable TroughEject if shooter lane is up again', function() {
        MenuHsm.dispatch('ShooterLaneDown');
        MenuHsm.dispatch('TroughBall4Down');
        MenuHsm.dispatch('TroughBall4Down');
        // first call is on entry inGame
        solenoidMock.fire.should.have.callCount(1);
        MenuHsm.dispatch('ShooterLaneUp');
        MenuHsm.dispatch('TroughBall4Down');
        solenoidMock.fire.should.have.callCount(2);
      });
      it('should fire solenoid if shooter lane is up', function() {
        MenuHsm.dispatch('TroughBall4Down');
        solenoidMock.fire.should.have.callCount(2);
      });
      it('should end game after 3 TroughBalls', function() {
        MenuHsm.dispatch('TroughBall4Down');
        MenuHsm.dispatch('TroughBall4Down');
        expect(MenuHsm.myState.name).to.equal('inGame');
        MenuHsm.dispatch('TroughBall4Down');
        expect(MenuHsm.myState.name).to.equal('Menu');
      });
    });
    describe('Saucers', function() {
      it('should fire left saucer solenoid when left saucer is hit', function(){
        MenuHsm.dispatch('LeftSaucerDown');
        solenoidMock.fire.should.have.been.calledWith('LeftSaucer');
      });
      it('should fire right saucer solenoid when rght saucer is hit', function(){
        MenuHsm.dispatch('RightSaucerDown');
        solenoidMock.fire.should.have.been.calledWith('RightSaucer');
      });
    });
  });

});
