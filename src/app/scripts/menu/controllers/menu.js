/**
 * Created by acomitevski on 30/04/14.
 */

'use strict';

angular.module('fuMenu')
  .controller('MenuController', function ($scope, $state, uiInterface, serverInterface) {
    $scope.selectedGame = 'swe1';
    uiInterface.on('startSelectedGame', angular.bind($scope, $scope.startSelectedGame));

    $scope.games = [
      {title: 'swe1'},
      {title: 'soccer'}
    ];

    $scope.startSelectedGame = function() {
      $state.go('game', {game: $scope.selectedGame});
      serverInterface.dispatch($scope.selectedGame);
    }

  });
