'use strict';

// dummy require function
var require = function(){
  return {
    runServer: function(){}
  };
};

describe('Controller: MainCtrl', function () {
  // load the controller's module
  beforeEach(module('flipperUiApp'));

  var MenuController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuController = $controller('MenuController', {
      $scope: scope
    });
  }));

  it('should attach a list of games to the scope', function () {
    expect(scope.games.length).toBe(2);
  });
});
