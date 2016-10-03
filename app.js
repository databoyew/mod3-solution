(function () {
	'use strict';

	angular
	.module("NarrowItDownApp", [])
	.controller("NarrowItDownController", NarrowItDownController)
	.service("MenuSearchService", MenuSearchService)
	.directive('foundItems', FoundItemsDirective)
	.constant('menuBaseUrl', "https://davids-restaurant.herokuapp.com");


    //directive
    function FoundItemsDirective() {
    	var ddo = {
    		templateUrl: 'foundItems.html',
    		scope: {
    			menuItems: '<',
    			onRemove: '&'
    		},
    		controller: FoundItemsDirectiveController,
    		controllerAs: 'list',
    		bindToController: true,
    	};

    	return ddo;
    }

    function FoundItemsDirectiveController() {
    	var list = this;

    	list.isEmpty =  function() {
    		return (list.menuItems && list.menuItems.length === 0);
    	}
    }


    //application controller
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
    	var controller = this;

    	controller.searchTerm = "";
    	controller.found = null;  //null by default in order to prevent the display if 'Nothing found' from the very begining

    	controller.findMenuItems = function() {
    		controller.found = [];

    		if (controller.searchTerm) {
    			controller.found = MenuSearchService
    			.getMatchedMenuItems(controller.searchTerm)
    			.then(function (foundItems) {
    				controller.found = foundItems;
    			});
    		}
    	}

    	controller.putAway = function(index) {
    		if (controller.found && controller.found.length > index) {
    			controller.found.splice(index, 1);
    		}
    	}
    }


    MenuSearchService.$inject = ['$http', 'menuBaseUrl'];
    function MenuSearchService($http, menuBaseUrl) {
    	var self = this;

    	self.getMatchedMenuItems = function(searchTerm) {
    		return  $http({
    			method: "GET",
    			url: (menuBaseUrl + "/menu_items.json")
    		}).then(function (response) {
    			var foundItems = response.data.menu_items;
    			var normalizedSearchTerm = searchTerm.toUpperCase();

    			return foundItems.filter(function (item) {
    				return item.description.toUpperCase().includes(normalizedSearchTerm);
    			});
    		});
    	}
    }

})();
