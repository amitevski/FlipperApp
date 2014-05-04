/**
 * Created by acomitevski on 30/04/14.
 */

'use strict';

angular.module('fuMenu')
  .controller('MenuController', function ($scope) {
    $scope.myInterval = 10000000;
    $scope.games = [
      {title: 'Star Wars Episode 1', image: 'images/games/swe1/logo.svg'},
      {title: 'Soccer', image: 'http://placekitten.com/400/300'}
    ];
  });
