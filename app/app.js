let addressBookApp = angular.module("addressBookApp", []);

addressBookApp.controller("addressBookController", [
  "$scope",
  "$http",
  function ($scope, $http) {
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
        },
        function (error) {
          // TODO make this error handling better
          console.log("OOPS");
        }
      );
  },
]);
