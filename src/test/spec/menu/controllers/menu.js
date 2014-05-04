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

  describe('next', function() {
    it('should set next game as selected', function() {
      scope.games = [
        {title: 'swe1', active: true},
        {title: 'soccer', active: false}
      ];
      expect(scope.selectedGame).toBe('swe1');
      expect(scope.games[0].active).toBe(true);
      scope.next();
      expect(scope.selectedGame).toBe('soccer');
      expect(scope.games[1].active).toBe(true);
    });
    it('should go to first element if its last', function() {
      scope.games = [
        {title: 'swe1', active: false},
        {title: 'soccer', active: true}
      ];
      scope.selectedGame = 'soccer';
      expect(scope.selectedGame).toBe('soccer');
      expect(scope.games[1].active).toBe(true);
      scope.next();
      expect(scope.selectedGame).toBe('swe1');
      expect(scope.games[0].active).toBe(true);
    });
  });

  describe('prev', function() {
    it('should set prev game as selected', function() {
      scope.games = [
        {title: 'swe1', active: false},
        {title: 'soccer', active: true}
      ];
      scope.selectedGame = 'soccer';
      expect(scope.selectedGame).toBe('soccer');
      expect(scope.games[1].active).toBe(true);
      scope.prev();
      expect(scope.selectedGame).toBe('swe1');
      expect(scope.games[0].active).toBe(true);
    });
    it('should go to last element if we are on the first element', function() {
      scope.games = [
        {title: 'swe1', active: true},
        {title: 'soccer', active: false}
      ];
      expect(scope.selectedGame).toBe('swe1');
      expect(scope.games[0].active).toBe(true);
      scope.prev();
      expect(scope.selectedGame).toBe('soccer');
      expect(scope.games[1].active).toBe(true);
    });
  });
});
