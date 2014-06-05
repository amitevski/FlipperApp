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
  menu = require(root + 'menu'),
  swe1 = require(root + '/games/swe1'),
  _ = require('underscore'),
  Statechart = require('statechart'),
  Swe1Hsm;


describe('Menu HSM', function() {

  beforeEach(function () {
    uiMock = {
      openMenu: sinon.spy(), startSelectedGame: sinon.spy(), nextGame: sinon.spy(), prevGame: sinon.spy(), setPoints: sinon.spy()
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
    it('should light StartButton', function() {
      Swe1Hsm.run();
      Swe1Hsm.dispatch('swe1');
      lampMock.on.should.have.been.called;
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
});