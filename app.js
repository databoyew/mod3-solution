(function () {

  angular.module("NarrowItDownApp", [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('APIPath', 'https://davids-restaurant.herokuapp.com/')
  .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;

    narrowCtrl.searchTerm = "";
    narrowCtrl.found = [];

    narrowCtrl.getMatchedMenuItems = function () {

      if (narrowCtrl.searchTerm !== "") {
        var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm);
          promise.then(function(response) {
            // console.log(response);
            narrowCtrl.found = response;
          });
      } else {
        narrowCtrl.found = [];
      }
    }

    narrowCtrl.removeItem = function (index) {
      narrowCtrl.found.splice(index, 1);
    }

  }


  MenuSearchService.$inject = ['$http', '$q', 'APIPath'];
  function MenuSearchService($http, $q, APIPath) {

    var searchSvc = this;

    searchSvc.getMatchedMenuItems = function (searchTerm) {
      var httpRequest = {
        method: 'GET',
        url: APIPath + 'menu_items.json'
      }

      return $http(httpRequest).then(function (result) {
        // process result and only keep items that match
        var items = result.data.menu_items;
        var foundItems = [];
        for (var i = 0; i < items.length; i++) {
          var itemDescription = items[i].description;
          if (itemDescription.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(items[i]);
          }
        }
        // return processed items
        return foundItems;
      });
    }
  }

  function FoundItemsDirectiveController() {
    var foundList = this;

    foundList.removeItem = function (index) {
      foundList.onRemove({index: index});
    }

  }

  function FoundItemsDirective() {
    var ddo = {
        restrict: 'E',
        templateUrl: 'templates/list.html',
        scope: {
          items: '<foundItems',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'foundList',
        bindToController: true
    };

    return ddo;
  }

})();
