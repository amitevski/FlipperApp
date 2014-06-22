/**
 * Created by acomitevski on 30/04/14.
 */
'use strict';


var emitSpy,
  ui;

describe('UI', function() {
  beforeEach(function() {
    emitSpy = sinon.spy();
    function EmitterMock() {}
    EmitterMock.prototype.emit = emitSpy;
    ui = proxyquire(root + 'helpers/ui',
      {
        'eventemitter2': {
          EventEmitter2: EmitterMock
        }
      }
    );
  });
  it('should only create one instance', function() {
    var a = require(root + 'helpers/ui');
    var b = require(root + 'helpers/ui');
    expect(a).to.equal(b);
  });
  describe('setPoints', function() {
    it('should emit given points', function() {
      ui.setPoints(10);
      expect(emitSpy).calledWith('setPoints', 10);
    });
  });
  describe('startGame', function() {
    it('should emit startGame', function() {
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
