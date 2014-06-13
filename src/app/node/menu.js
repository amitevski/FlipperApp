'use strict';

module.exports = function(ui, solenoid, lamp) {
  return {

    points: 0,

    initialState: 'Menu',

    states: {
      inGame: {

        LeftBankUpperDown: function() {
          lamp.on('LeftStandupsUpper');
          this.dispatch('enableBank', {side: 'Left', pos: 'Upper'});
        },
        LeftBankMiddleDown: function() {
          lamp.on('LeftStandupsMiddle');
          this.dispatch('enableBank', {side: 'Left', pos: 'Middle'});
        },
        LeftBankLowerDown: function() {
          // TODO: fix typo lowser in FlipperDriver
          lamp.on('LeftStandupsLowser');
          this.dispatch('enableBank', {side: 'Left', pos: 'Lower'});
        },
        RightBankUpperDown: function() {
          lamp.on('RightStandupsUpper');
          this.dispatch('enableBank', {side: 'Right', pos: 'Upper'});
        },
        RightBankMiddleDown: function() {
          lamp.on('RightStandupsMiddle');
          this.dispatch('enableBank', {side: 'Right', pos: 'Middle'});
        },
        RightBankLowerDown: function() {
          lamp.on('RightStandupsLower');
          this.dispatch('enableBank', {side: 'Right', pos: 'Lower'});
        },
        enableBank: function(opts) {
          var side = opts.side,
            pos = opts.pos;
          this[side+'Bank'][pos] = true;
          // if all positions are hit bankFull event is triggered
          for(var o in this[side+'Bank']) {
            if (!this[side+'Bank'][o]) {
              return;
            }
          }

          for(var j in this[side+'Bank']) {
            this[side+'Bank'][j] = false;
          }
          this.dispatch('bankFull');
        },
        addPoints: function(points) {
          this.points += points;
          ui.setPoints(this.points);
        },
        LeftFlipperButtonDown: function () {
          this.dispatch('FlipperButtonDown', 'Left');
        },
        LeftFlipperButtonUp: function () {
          this.dispatch('FlipperButtonUp', 'Left');
        },
        RightFlipperButtonDown: function () {
          this.dispatch('FlipperButtonDown', 'Right');
        },
        RightFlipperButtonUp: function () {
          this.dispatch('FlipperButtonUp', 'Right');
        },
        FlipperButtonDown: function (side) {
          solenoid.fire(side + 'FlipperPower');
          this[side + 'FlipperHoldTimer'] = setTimeout(function() {
            solenoid.fire(side + 'FlipperHold');
          }, 20);
        },
        FlipperButtonUp: function (side) {
          if (this[side + 'FlipperHoldTimer']) {
            clearTimeout(this[side + 'FlipperHoldTimer']);
            this[side + 'FlipperHoldTimer'] = null;
          }
          solenoid.release(side + 'FlipperHold');
        },
        gameOver: {target: 'Menu'},
        BlinkLamp: function(opts) {
          lamp.on(opts.id);
          setTimeout(function() {
            lamp.off(opts.id);
          }, opts.duration);
        },
        BaseLights: function(mode) {
          lamp[mode]('BottomArchLeftLeft');
          lamp[mode]('BottomArchRightRight');
          lamp[mode]('BottomArchRightLeft');
          lamp[mode]('BottomArchLeftRight');
          lamp[mode]('StartButton');
        },
        ShooterLaneDown: function() {
          this.shooterLaneDown = true;
        },
        ShooterLaneUp: function() {
          this.shooterLaneDown = false;
        },
        TroughBall4Down: function() {
          // hack to prevent accidental switch triggers
          if (this.shooterLaneDown) {
            return;
          }
          solenoid.fire('TroughEject');
          this.ballCount--;
          if (0 === this.ballCount) {
            this.dispatch('gameOver');
          }
        },
        states: {
        },
        entry: function () {
          this.ballCount = 3;
          var that = this;
          solenoid.fire('TroughEject');
          // wait for transition to inGame to finish
          // otherwise BaseLights is not defined
          setTimeout(function() {
            that.dispatch('BaseLights', 'on');
          }, 0);
        },
        exit: function() {
          this.dispatch('BaseLights', 'off');
        }
      },
      Menu: {
        // Menu events
        StartDown: function () {
          ui.startSelectedGame();
        },
        RightActionButtonDown: function() {
          ui.nextGame();
        },
        LeftActionButtonDown: function() {
          ui.prevGame();
        },
        states: {},
        entry: function () {
          ui.openMenu();
          this.lampInterval = setInterval(function() {
            lamp.toggle('StartButton');
          }, 1000);
        },
        exit: function() {
          clearInterval(this.lampInterval);
        }
      }
    }
  };
};
