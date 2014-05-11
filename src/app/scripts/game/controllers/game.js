/**
 * Created by acomitevski on 04/05/14.
 */

'use strict';

angular.module('fuGame')
  .controller('GameController', function($scope, $stateParams, uiInterface) {
    $scope.game = 'soccer';
    $scope.points = 0;

    uiInterface.on('setPoints', function(points) {
      $scope.points = points;
      $scope.$digest(); //update model binding
    });
  });