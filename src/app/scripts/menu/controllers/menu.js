/**
 * Created by acomitevski on 30/04/14.
 */

'use strict';

angular.module('fuMenu')
  .controller('MenuController', function ($scope, $state, uiInterface, serverInterface) {

    $scope.startSelectedGame = function() {
      $state.go('game', {gameName: $scope.selectedGame});
      serverInterface.HSM.dispatch($scope.selectedGame);
    };

    $scope.games = serverInterface.games;

    $scope.selectedGame = $scope.games[0].title;
    $scope.prev = function() {
      for (var i in $scope.games) {
        var game = $scope.games[i];
        if (true === game.active) {
          game.active = false;
          if (i > 0) {
            $scope.select($scope.games[--i]);
          } else {
            $scope.select($scope.games[$scope.games.length-1]);
          }

          break;
        }
      }
    };
    $scope.next = function() {
      for (var i in $scope.games) {
        var game = $scope.games[i];
        if (true === game.active) {
          game.active = false;
          if (i < ($scope.games.length-1) ) {
            $scope.select($scope.games[++i]);
          } else {
            $scope.select($scope.games[0]);
          }

          break;
        }
      }
    };

    $scope.select = function(game) {
      game.active = true;
      $scope.selectedGame = game.title;
      $scope.$digest();
    };

    uiInterface.on('startSelectedGame', angular.bind($scope, $scope.startSelectedGame));
    uiInterface.on('nextGame', angular.bind($scope, $scope.next));
    uiInterface.on('prevGame', angular.bind($scope, $scope.prev));



    /**
     * methods for manually testing ui
     * testing methods
     */

    $scope.startGame = function(game) {
      $state.go('game', {gameName: game});
      serverInterface.HSM.dispatch(game);
    };


    /**
     * end testing methods
     */

  });
