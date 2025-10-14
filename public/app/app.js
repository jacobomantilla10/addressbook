let addressBookApp = angular.module("addressBookApp", []);

addressBookApp.controller("addressBookController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    // controls view mode for conditionally rendering table or cards
    $scope.view = {
      mode: "table",
    };

    $scope.isFiltered = {
      filtered: false,
    };

    $scope.year = new Date().getFullYear();

    $scope.filters = {
      search: "",
      company: "",
      role: "",
      country: "",
      sort: "ContactName"
    };

    $scope.order = {
      ContactName: {
        sort: "ContactName",
        symbol: "▲"
      },
      Email: {
        sort: "Email",
        symbol: "▲"
      },
      Phone: {
        sort: "Phone",
        symbol: "▲"
      },
      Fax: {
        sort: "Fax",
        symbol: "▲"
      },
      ContactTitle: {
        sort: "ContactTitle",
        symbol: "▲"
      },
      CompanyName: {
        sort: "CompanyName",
        symbol: "▲"
      },
      Email: {
        sort: "Email",
        symbol: "▲"
      },
      Address: {
        sort: "Address",
        symbol: "▲"
      }
    }

    // Reverse sort order of elements in table
    $scope.changeOrder = function (sortField) {
      // save value of original sort order to reset it to sort up later
      let currentSortItem = $scope.filters.sort.replace("-", "");
      // Adjust sorting for selected element
      let newSortItem = $scope.order[sortField];
      if (newSortItem.symbol === "▲") {
        newSortItem.symbol = "▼";
        newSortItem.sort = "-" + newSortItem.sort;
      } else {
        newSortItem.symbol = "▲";
        newSortItem.sort = newSortItem.sort.replace("-", "");
      }
      // Set sort to be the value of the new sort of the selected element
      $scope.filters.sort = newSortItem.sort;
      // Don't reset value if element is the same
      if (currentSortItem !== sortField) {
        $scope.order[currentSortItem].symbol = "▲";
        $scope.order[currentSortItem].sort = currentSortItem;
      }
    };

    // Reset search filters and update available options
    $scope.resetFilters = function () {
      $scope.filters.search = "";
      $scope.filters.company = "";
      $scope.filters.role = "";
      $scope.filters.country = "";

      $scope.updateAvailableOptions();
    };

    // Update filter options depending on what's available
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

    // Fetch XML and set data
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
          console.log("An error occurred: ", error);
        }
      );
  },
]);
