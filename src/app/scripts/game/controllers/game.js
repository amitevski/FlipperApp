/**
 * Created by acomitevski on 04/05/14.
 */

'use strict';

angular.module('fuGame')
  .controller('GameController', function($scope, $stateParams, uiInterface, serverInterface, $timeout) {
    $scope.game = $stateParams.gameName;
    $scope.points = 0;
    $scope.gameMessage = '';
    $scope.targets = ['', '', ''];

    uiInterface.on('setPoints', function(points) {
      $scope.points = points;
      $scope.$digest(); //update model binding
    });
    uiInterface.on('setGameMessage', function(message) {
      $scope.gameMessage = message;
      $scope.$digest(); //update model binding
    });
    uiInterface.on('setTargets', function(targets) {
      $scope.targets = targets;
      $scope.$digest(); //update model binding
    });

    /**
     * methods for manually testing ui
     * testing methods
     */

    $scope.dispatch = function(event) {
      $timeout(function() {
        serverInterface.HSM.dispatch(event);
      }, 5, false);
    };


    /**
     * end testing methods
     */
  });
