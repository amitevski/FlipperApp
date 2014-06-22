/**
 * Created by acomitevski on 05/06/14.
 */

'use strict';


/*jshint expr: true*/
/*jshint laxcomma: true*/

var uiMock,
  solenoidMock,
  lampMock,
  HSMbase,
  menu,
  swe1,
  _ = require('underscore'),
  Statechart = require('statechart'),
  Swe1Hsm;


describe('SWE1 HSM', function() {

  beforeEach(function () {
    menu = require(root +'/menu');
    swe1 = require(root + '/games/swe1');
    uiMock = {
      openMenu: sinon.spy(),
      startSelectedGame: sinon.spy(),
      nextGame: sinon.spy(),
      prevGame: sinon.spy(),
      setGameMessage: sinon.spy(),
      setTargets: sinon.spy(),
      setPoints: sinon.spy()
    };
    solenoidMock = {
      fire: sinon.spy(), release: sinon.spy()
    };
    lampMock = {
      on: sinon.spy(), off: sinon.spy(), toggle: sinon.spy()
    };
    HSMbase =  menu(uiMock, solenoidMock, lampMock);
    HSMbase.states.inGame.states.swe1 =  swe1(uiMock, solenoidMock, lampMock).swe1;
    HSMbase.states.Menu.swe1 = {target: 'swe1'};
    Swe1Hsm = _.extend(HSMbase, Statechart);
  });
  afterEach(function () {
    Swe1Hsm = null;
    uiMock = null;
  });
  describe('entry', function() {
    it('should light StartButton', function(done) {
      Swe1Hsm.run();
      Swe1Hsm.dispatch('swe1');
      setTimeout(function() {
        lampMock.on.should.have.been.calledWith('StartButton');
        done();
      }, 3);

    });
  });
  describe('JetBumperDown', function() {
    beforeEach(function() {
      Swe1Hsm.run();
      Swe1Hsm.dispatch('swe1');
    });
    ['Upper', 'Lower'].map(function(pos) {
      describe(pos + 'JetBumperDown', function() {
        beforeEach(function() {
          Swe1Hsm.points = 0;
          Swe1Hsm.dispatch(pos + 'JetBumperDown');
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
          expect(Swe1Hsm.points).to.equal(5000);
        });
      });
    });
    describe('MiddleJetBumperDown', function() {
      beforeEach(function() {
        Swe1Hsm.dispatch('MiddleJetBumperDown');
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
        expect(Swe1Hsm.points).to.equal(5000);
      });
    });
  });

  describe('SlingshotDown', function() {
    beforeEach(function() {
      Swe1Hsm.run();
      Swe1Hsm.dispatch('swe1');
    });
    ['Left', 'Right'].map(function(side) {
      describe(side + 'SlingshotDown', function() {
        beforeEach(function() {
          Swe1Hsm.dispatch(side + 'SlingshotDown');
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
          expect(Swe1Hsm.points).to.equal(10000);
        });
      });
    });
  });

  describe('Banks', function() {
    beforeEach(function() {
      Swe1Hsm.run();
      Swe1Hsm.dispatch('swe1');
    });
    var sides = ['Left', 'Right'],
      positions = ['Upper', 'Middle', 'Lower'];
    describe('Left side', function() {
      it('should trigger bank full event if all banks are hit', function() {
        Swe1Hsm.dispatch('LeftBankUpperDown');
        Swe1Hsm.dispatch('LeftBankMiddleDown');
        Swe1Hsm.dispatch('LeftBankLowerDown');
        expect(Swe1Hsm.points).to.equal(500000);
      });
      it('should turn off lamps after 3 hits', function() {
        Swe1Hsm.dispatch('LeftBankUpperDown');
        lampMock.on.should.have.been.calledWith('LeftStandupsUpper');
        Swe1Hsm.dispatch('LeftBankMiddleDown');
        lampMock.on.should.have.been.calledWith('LeftStandupsMiddle');
        Swe1Hsm.dispatch('LeftBankLowerDown');
        lampMock.on.should.have.been.calledWith('LeftStandupsLowser');
        lampMock.off.should.have.callCount(3);
      });
    });
    describe('Right side', function() {
      it('should trigger bank full event if all banks are hit', function() {
        Swe1Hsm.dispatch('RightBankUpperDown');
        Swe1Hsm.dispatch('RightBankMiddleDown');
        Swe1Hsm.dispatch('RightBankLowerDown');
        expect(Swe1Hsm.points).to.equal(500000);
      });
    });
  });

  describe('SubGameSimple state', function() {
    beforeEach(function() {
      Swe1Hsm.run();
      Swe1Hsm.dispatch('swe1');
      // hit ShieldHitDown twice
      Swe1Hsm.dispatch('ShieldHitDown');
      Swe1Hsm.dispatch('ShieldHitDown');
    });
    describe('entry event', function() {
      it('should set game message', function() {
        uiMock.setGameMessage.should.have.been.calledWith('shoot the 3 targets below');
      });
      it('should set all Targets', function() {
        uiMock.setTargets.should.have.been.calledWith(['left','center','right']);
      });
    });
    describe('ShieldHitDown event', function() {
      it('should set targets if shield is hit', function() {
        Swe1Hsm.dispatch('ShieldHitDown');
        uiMock.setTargets.should.have.been.calledWith(['left','','right']);
      });
    });
    describe('LeftDropTargetDown event', function() {
      it('should set targets if LeftDropTarget is hit', function() {
        Swe1Hsm.dispatch('LeftDropTargetDown');
        uiMock.setTargets.should.have.been.calledWith(['','center','right']);
      });
    });
    describe('RightDropTargetDown event', function() {
      it('should set targets if RightDropTarget is hit', function() {
        Swe1Hsm.dispatch('RightDropTargetDown');
        uiMock.setTargets.should.have.been.calledWith(['left','center','']);
      });
    });

    describe('CenterHit substate', function() {
      describe('LeftDropTargetDown event', function() {
        it('should set targets if LeftDropTarget is hit', function() {
          expect(Swe1Hsm.myState.name).to.equal('SubGameSimple');
          Swe1Hsm.dispatch('ShieldHitDown');
          expect(Swe1Hsm.myState.name).to.equal('CenterHit');
          Swe1Hsm.dispatch('LeftDropTargetDown');
          Swe1Hsm.dispatch('LeftDropTargetDown');
          expect(Swe1Hsm.myState.name).to.equal('LeftCenterHit');
          uiMock.setTargets.should.have.been.calledWith(['','','right']);
        });
      });
    });

  });
});