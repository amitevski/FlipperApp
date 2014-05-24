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
    };
    MenuHsm = _.extend(menu(uiMock, solenoidMock, lampMock), Statechart);
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
        MenuHsm.LeftFlipperHoldTimer.should.be.defined;
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
        expect(MenuHsm.LeftFlipperHoldTimer).to.equal(null);
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
        MenuHsm.RightFlipperHoldTimer.should.be.defined;
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
        expect(MenuHsm.RightFlipperHoldTimer).to.equal(null);
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

    describe('SlingshotDown', function() {
      ['Left', 'Right'].map(function(side) {
        describe(side + 'SlingshotDown', function() {

          it('should blink '+ side +' sling GI lamps', function(done) {
            MenuHsm.states.Menu.ingame = {target: 'inGame'};
            MenuHsm.run();
            MenuHsm.dispatch('ingame');
            MenuHsm.dispatch(side + 'SlingshotDown');
            lampMock.on.should.have.been.calledWith(side + 'SlingGIUpper');
            lampMock.on.should.have.been.calledWith(side + 'SlingGILower');
            setTimeout(function() {
              lampMock.off.should.have.been.calledWith(side + 'SlingGIUpper');
              lampMock.off.should.have.been.calledWith(side + 'SlingGILower');
              done();
            }, 110);
          });

          it('should fire '+ side +' slingshot solenoid', function() {
            MenuHsm.states.Menu.ingame = {target: 'inGame'};
            MenuHsm.run();
            MenuHsm.dispatch('ingame');
            MenuHsm.dispatch(side + 'SlingshotDown');
            solenoidMock.fire.should.have.been.calledWith(side + 'Slingshot');
          });


          it('should add 10.000 points', function() {
            MenuHsm.states.Menu.ingame = {target: 'inGame'};
            MenuHsm.run();
            MenuHsm.dispatch('ingame');
            MenuHsm.dispatch(side + 'SlingshotDown');
            uiMock.setPoints.should.have.been.calledWith(10000);
          });
        });
      });


    });
  });

});