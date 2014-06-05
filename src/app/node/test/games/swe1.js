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
});