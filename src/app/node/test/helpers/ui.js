/**
 * Created by acomitevski on 30/04/14.
 */

var proxyquire = require('proxyquire');

var emitSpy = sinon.spy();
function EmitterMock() {}
EmitterMock.prototype.emit = emitSpy;
var ui = proxyquire(root + 'helpers/ui',
  {
    'eventemitter2': {
      EventEmitter2: EmitterMock
    }
  }
);


describe('UI', function() {
  beforeEach(function() {
//    currentUI = new ui();
  });
  it('should only create one instance', function() {
    var a = require(root + 'helpers/ui');
    var b = require(root + 'helpers/ui');
    expect(a).to.equal(b);
  });
  describe('addPoints', function() {
    it('should emit given points', function() {
      ui.addPoints(10);
      expect(emitSpy).calledWith('addPoints', 10);
    });
  });
  describe('startGame', function() {
    it('should emit starGame', function() {
      ui.startGame('swe1');
      expect(emitSpy).calledWith('startGame', 'swe1');
    });
  });
  describe('openMenu', function() {
    it('should emit openMenu', function() {
      ui.openMenu();
      expect(emitSpy).calledWith('openMenu');
    });
  });
});
