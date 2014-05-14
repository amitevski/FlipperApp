/**
 * Created by acomitevski on 04/05/14.
 */
'use strict';

/*jshint expr: true*/
/*jshint laxcomma: true*/

var uiMock,
  solenoidMock,
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
    };
    solenoidMock = {
      fire: sinon.spy()
      ,release: sinon.spy()
    };
    MenuHsm = _.extend(menu(uiMock, solenoidMock), Statechart);
  });
  afterEach(function() {
    MenuHsm = null;
    uiMock = null;
  });

  describe('entry', function() {
    beforeEach(function() {
    });
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
      MenuHsm.dispatch('RightActionButton');
      uiMock.nextGame.should.have.been.calledOnce;
    });
  });

  describe('LeftActionButton', function() {
    it('should select previous game', function() {
      MenuHsm.run();
      MenuHsm.dispatch('LeftActionButton');
      uiMock.prevGame.should.have.been.calledOnce;
    });
  });

  describe('inGame State', function() {
    describe('LeftFlipperButtonDown', function() {
      it('should fire LeftFlipperPower solenoid', function() {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('LeftFlipperButtonDown');
        solenoidMock.fire.should.have.been.calledWith('LeftFlipperPower');
      });
      it('should start timer for LeftFlipperHold solenoid', function() {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('LeftFlipperButtonDown');
        MenuHsm.leftFlipperHoldTimer.should.be.defined;
      });
      it('should fire LeftFlipperHold solenoid after timeout', function(done) {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('LeftFlipperButtonDown');
        setTimeout(function() {
          solenoidMock.fire.should.have.been.calledWith('LeftFlipperHold');
          done();
        }, 22);
      });
    });
    describe('LeftFlipperButtonUp', function() {
      it('should clear  LeftFlipperHold timer', function () {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('LeftFlipperButtonDown');
        MenuHsm.dispatch('LeftFlipperButtonUp');
        expect(MenuHsm.leftFlipperHoldTimer).to.equal(null);
      });
      it('should release LeftFlipperHold solenoid', function () {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('LeftFlipperButtonDown');
        MenuHsm.dispatch('LeftFlipperButtonUp');
        solenoidMock.release.should.have.been.calledWith('LeftFlipperHold');
      });
    });
    describe('RightFlipperButtonDown', function() {
      it('should fire RightFlipperPower solenoid', function() {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('RightFlipperButtonDown');
        solenoidMock.fire.should.have.been.calledWith('RightFlipperPower');
      });

      it('should start timer for RightFlipperHold solenoid', function() {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('RightFlipperButtonDown');
        MenuHsm.rightFlipperHoldTimer.should.be.defined;
      });
      it('should fire RightFlipperHold solenoid after timeout', function(done) {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('RightFlipperButtonDown');
        setTimeout(function() {
          solenoidMock.fire.should.have.been.calledWith('RightFlipperHold');
          done();
        }, 22);
      });
    });

    describe('RightFlipperButtonUp', function() {
      it('should clear  RightFlipperHold timer', function () {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('RightFlipperButtonDown');
        MenuHsm.dispatch('RightFlipperButtonUp');
        expect(MenuHsm.rightFlipperHoldTimer).to.equal(null);
      });
      it('should release RightFlipperHold solenoid', function () {
        MenuHsm.states.Menu.ingame = {target: 'inGame'};
        MenuHsm.run();
        MenuHsm.dispatch('ingame');
        MenuHsm.dispatch('RightFlipperButtonDown');
        MenuHsm.dispatch('RightFlipperButtonUp');
        solenoidMock.release.should.have.been.calledWith('RightFlipperHold');
      });
    });
  });

});