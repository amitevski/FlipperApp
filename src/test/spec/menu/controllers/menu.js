'use strict';

// dummy require function
var require = function(){
  return {
    runServer: function(){}
  };
};

describe('Controller: MenuController', function () {
  // load the controller's module
  beforeEach(module('flipperUiApp'));

  var MenuController,
    scope,
    uiInterfaceMock = jasmine.createSpyObj('uiInterface', ['on']),
    serverInterfaceMock = jasmine.createSpyObj('serverInterface', ['dispatch']),
    stateMock = jasmine.createSpyObj('state', ['go']);

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuController = $controller('MenuController', {
      $scope: scope
      ,uiInterface: uiInterfaceMock
      ,serverInterface: serverInterfaceMock
      ,$state: stateMock
    });
  }));

  it('should attach a list of games to the scope', function () {
    expect(scope.games.length).toBe(2);
  });
  describe('startSelectedGame', function() {
    it('should transition to game page', function() {
      scope.selectedGame = 'test';
      scope.startSelectedGame();
      expect(stateMock.go).toHaveBeenCalledWith('game', {game: 'test'});
    });
  });
});
