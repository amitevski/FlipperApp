/**
 * Created by acomitevski on 30/04/14.
 */

'use strict';

angular.module('fuMenu')
  .controller('MenuController', function ($scope) {
    $scope.games = [
      {title: 'Star Wars Episode 1'},
      {title: 'Soccer'}
    ];
  });
