'use strict';

module.exports = function(ui, solenoid, lamp) {

  var addPoints = function(bonus, points) {
    this.points += points * bonus;
    ui.setPoints(this.points);
  };
  return {

    points: 0,

    initialState: 'Menu',

    pushStates: {
      x2bonus: {
        addPoints: function(points) {
          addPoints.call(this, 2, points);
        }
      },
      x3bonus: {
        addPoints: function(points) {
          addPoints.call(this, 3, points);
        }
      },
      x4bonus: {
        addPoints: function(points) {
          addPoints.call(this, 4, points);
        }
      },
      x5bonus: {
        addPoints: function(points) {
          addPoints.call(this, 5, points);
        }
      }
    },

    states: {
      inGame: {
        LeftSaucerDown: function() {
          solenoid.fire('LeftSaucer');
        },
        RightSaucerDown: function() {
          solenoid.fire('RightSaucer');
        },
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
        LeftBankLightsOff: function() {
          lamp.off('LeftStandupsUpper');
          lamp.off('LeftStandupsMiddle');
          lamp.off('LeftStandupsLowser');
        },
        RightBankLightsOff: function() {
          lamp.off('RightStandupsUpper');
          lamp.off('RightStandupsMiddle');
          lamp.off('RightStandupsLower');
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
          // reset bank
          for(var j in this[side+'Bank']) {
            this[side+'Bank'][j] = false;
          }
          this.dispatch(side + 'BankLightsOff');
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
          this.RightBank = {
            Upper: false,
            Middle: false,
            Lower: false
          };
          this.LeftBank = {
            Upper: false,
            Middle: false,
            Lower: false
          };
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
          this.dispatch('LeftBankLightsOff');
          this.dispatch('RightBankLightsOff');
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
