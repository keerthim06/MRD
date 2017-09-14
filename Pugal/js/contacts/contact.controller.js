(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('contactCtrl', contactCtrl);

    contactCtrl.$inject = ['$location', '$scope', 'Repository', 'commonService', '$modal', 'fileUpload', '$stateParams', 'ngDialog'];

    function contactCtrl($location, $scope, Repository, commonService, $modal, fileUpload, $stateParams, ngDialog) {
        /* jshint validthis:true */
        
        var vm = this;
        vm.activate = activate;
        vm.cusAdd = cusAdd;
        vm.attrAdd = attrAdd;
        vm.cusRemove = cusRemove;
        vm.attrRemove = attrRemove;
        vm.mlAdd = mlAdd;
        vm.mlRemove = mlRemove;

        vm.product = {
            id : "QM12345",
            description: "asdhalsd alsdhlasjdlaskjd",
            version: "Draft sdfsdf 1.0",
            modifydate: " 08/25/2017",
            modifyby: "Mark King",
            tragetcustomer: [{ name: "Smasung", comment: "hello world" }, { name: "LG", comment: "" }, { name: "Apple", comment: "" }],
            keyattribute: [
                { name: "Size L x W (mm)", description: "111mm", risk: "Medium" },
                { name: "Cost", description: "< $120", risk: "High" },
                { name: "TBD", description: "Notes", risk: "Low" }
            ],
            milstones: [
                { name: "ES  Sample", description: "111mm", date: "08/23/2017" },
                { name: "CS Sample", description: "1aadsasm", date: "08/40/2017" },
                { name: "HP Mass Production", description: "Notes", date: "12/12/2018" }
            ]
        };

        vm.customers = ["Smasung", "LG", "Apple", "Sony"];
        vm.attributes = ["Size L x W (mm)", "Cost", "TBD", "TBD123"];
        vm.priority = ["High", "Medium", "Low"];

        function activate() {
        }

        function cusAdd() {
            vm.product.tragetcustomer.push({ name: "Smasung", comment: "" })
        }

        function cusRemove(index) {
            vm.product.tragetcustomer.splice(index, 1);
        }

        function attrAdd() {
            vm.product.keyattribute.push({ name: "TBD", description: "", risk: "Low" })
        }
        function attrRemove(index) {
            vm.product.keyattribute.splice(index, 1);
        }

        function mlAdd() {
            vm.product.milstones.push({ name: "", description: "", date: "" })
        }
        function mlRemove(index) {
            vm.product.milstones.splice(index, 1);
        }
    }
})();
