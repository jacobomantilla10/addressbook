let addressBookApp = angular.module("addressBookApp", []);

addressBookApp.controller("addressBookController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $scope.viewmode = "table";

    $scope.contactOrderSymbol = "▲";
    $scope.contactOrder = "ContactName";

    $scope.year = new Date().getFullYear();

    $scope.changeContactOrder = function () {
      if ($scope.contactOrderSymbol === "▲") {
        $scope.contactOrderSymbol = "▼";
        $scope.contactOrder = "-ContactName";
      } else {
        $scope.contactOrderSymbol = "▲";
        $scope.contactOrder = "ContactName";
      }
    };

    const x2js = new X2JS();

    $http
      .get("data/ab.xml", {
        transformResponse: function (xmlString) {
          return x2js.xml_str2json(xmlString);
        },
      })
      .then(
        function (response) {
          $scope.addresses = response.data.AddressBook.Contact;

          $scope.countries = [
            ...new Set($scope.addresses.map((address) => address.Country)),
          ];
          $scope.roles = [
            ...new Set($scope.addresses.map((address) => address.ContactTitle)),
          ];
          $scope.companies = [
            ...new Set($scope.addresses.map((address) => address.CompanyName)),
          ];
        },
        function (error) {
          // TODO make this error handling better
          console.log("OOPS");
        }
      );
  },
]);
