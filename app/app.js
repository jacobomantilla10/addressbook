let addressBookApp = angular.module("addressBookApp", []);

addressBookApp.controller("addressBookController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $scope.view = {
      mode: "table",
    };

    $scope.isFiltered = {
      filtered: false,
    };

    $scope.contactOrderSymbol = "▲";
    $scope.contactOrder = "ContactName";

    $scope.year = new Date().getFullYear();

    $scope.filters = {
      search: "",
      company: "",
      role: "",
      country: "",
    };

    $scope.changeContactOrder = function () {
      if ($scope.contactOrderSymbol === "▲") {
        $scope.contactOrderSymbol = "▼";
        $scope.contactOrder = "-ContactName";
      } else {
        $scope.contactOrderSymbol = "▲";
        $scope.contactOrder = "ContactName";
      }
    };

    $scope.resetFilters = function () {
      $scope.filters.search = "";
      $scope.filters.company = "";
      $scope.filters.role = "";
      $scope.filters.country = "";

      $scope.updateAvailableOptions();
    };

    $scope.updateAvailableOptions = function () {
      if (
        $scope.filters.search !== "" ||
        $scope.filters.company !== "" ||
        $scope.filters.role !== "" ||
        $scope.filters.country !== ""
      ) {
        $scope.isFiltered.filtered = true;
      } else {
        $scope.isFiltered.filtered = false;
      }

      let availableContacts = $scope.addresses.filter((contact) => {
        return (
          ($scope.filters.search === "" ||
            contact.ContactName.toLowerCase().includes(
              $scope.filters.search.toLowerCase()
            )) &&
          ($scope.filters.company === "" ||
            contact.CompanyName === $scope.filters.company) &&
          ($scope.filters.role === "" ||
            contact.ContactTitle === $scope.filters.role) &&
          ($scope.filters.country === "" ||
            contact.Country === $scope.filters.country)
        );
      });
      $scope.countries = [
        ...new Set(availableContacts.map((contact) => contact.Country)),
      ];
      $scope.roles = [
        ...new Set(availableContacts.map((contact) => contact.ContactTitle)),
      ];
      $scope.companies = [
        ...new Set(availableContacts.map((contact) => contact.CompanyName)),
      ];
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
