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
        vm.editTable = editTable;

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
            ],
            documents: [
                { name: "ES  Sample", author: "William", date: "08/23/2017" },
                { name: "CS Sample", author: "Rock", date: "08/40/2017" },
                { name: "HP Mass Production", author: "Huston", date: "12/12/2018" }
            ],
            roi: {
                title: "ROI Marketing Inputs", 
                isEditable: false,
                showEdit: true,
             description : [],
             table:   [
                    { col1: "", col2: "FY18 Q1", col3: "FY18 Q2", col4: "FY18 Q3", col5: "FY18 Q4", col6: "FY19 Q1", col7: "FY19 Q2", col8: "FY19 Q3" },
                    { col1: "Cost ($)", col2: "$100", col3: "$100", col4: "$0.98", col5: "$0.96", col6: "$0.97", col7: "$0.96", col8: "$0.99" },
                    { col1: "ABP ($)", col2: "$195", col3: "$196", col4: "$197", col5: "$199", col6: "$194", col7: "$196", col8: "195" },
                    { col1: "Volume", col2: "240k", col3: "240k", col4: "2M", col5: "3M", col6: "4M", col7: "3M", col8: "6M" },
                    { col1: "Revenue($)", col2: "24k", col3: "22k", col4: "2.7M", col5: "3.8M", col6: "4.1M", col7: "3.6M", col8: "6.1M" },
                    { col1: "Volume(%)", col2: "47%", col3: "45%", col4: "50%", col5: "50%", col6: "34%", col7: "44%", col8: "43%" }
                ]
            },
            dfc: {
                title: "Design For Cost (DFC) output",
                isEditable: false,
                showEdit: false,
                description: [
                    { name: "Name", owner: "Owner", modifydate: "Last Modify Date", qtr: "Launch Qtr" },
                    { name: "PD", owner: "John", modifydate: "08/12/206", qtr: "FY17 Q2" },
                ],
                table: [
                    { col1: "", col2: "FY18 Q1", col3: "FY18 Q2", col4: "FY18 Q3", col5: "FY18 Q4", col6: "FY19 Q1", col7: "FY19 Q2", col8: "FY19 Q3" },
                    { col1: "Cost ($)", col2: "$100", col3: "$100", col4: "$0.98", col5: "$0.96", col6: "$0.97", col7: "$0.96", col8: "$0.99" },
                    { col1: "ABP ($)", col2: "$195", col3: "$196", col4: "$197", col5: "$199", col6: "$194", col7: "$196", col8: "195" },
                    { col1: "Volume", col2: "240k", col3: "240k", col4: "2M", col5: "3M", col6: "4M", col7: "3M", col8: "6M" },
                    
                ]
            },
            dms: {
                title: "Demand Management System (DMS) output",
                isEditable: false,
                showEdit: false,
                description: [
                    { name: "Name"},
                    { name: "PD" },
                ],
                table: [
                    { col1: "", col2: "FY18 Q1", col3: "FY18 Q2", col4: "FY18 Q3", col5: "FY18 Q4", col6: "FY19 Q1", col7: "FY19 Q2", col8: "FY19 Q3" },
                    { col1: "Cost ($)", col2: "$100", col3: "$100", col4: "$0.98", col5: "$0.96", col6: "$0.97", col7: "$0.96", col8: "$0.99" },
                    { col1: "ABP ($)", col2: "$195", col3: "$196", col4: "$197", col5: "$199", col6: "$194", col7: "$196", col8: "195" },
                    { col1: "Volume", col2: "240k", col3: "240k", col4: "2M", col5: "3M", col6: "4M", col7: "3M", col8: "6M" },
                    { col1: "Revenue($)", col2: "24k", col3: "22k", col4: "2.7M", col5: "3.8M", col6: "4.1M", col7: "3.6M", col8: "6.1M" },
                    { col1: "Volume(%)", col2: "47%", col3: "45%", col4: "50%", col5: "50%", col6: "34%", col7: "44%", col8: "43%" }
                ]
            }
        };

        vm.customers = ["Smasung", "LG", "Apple", "Sony"];
        vm.attributes = ["Size L x W (mm)", "Cost", "TBD", "TBD123"];
        vm.priority = ["High", "Medium", "Low"];


        vm.hotElement = document.querySelector('#hot');
        //vm.hotElementContainer = hotElement.parentNode;
        vm.hotSettings = {
            data: vm.product.roi.table,
            columns: [
                {
                    data: 'col1',
                    type: 'text'
                },
                {
                    data: 'col2',
                    type: 'text'
                },
                {
                    data: 'col3',
                    type: 'text'
                },
                {
                    data: 'col4',
                    type: 'text'
                },
                {
                    data: 'col5',
                    type: 'text'
                },
                {
                    data: 'col6',
                    type: 'text'
                },
                {
                    data: 'col7',
                    type: 'text'
                },
                {
                    data: 'col8',
                    type: 'text'
                }
            ],
            stretchH: 'all',
            width: 900,
            autoWrapRow: true,
            maxRows: 22,
            rowHeaders: true,
            colHeaders: [
                '',
                'FY18 Q1',
                'FY18 Q2',
                'FY18 Q3',
                'FY18 Q4',
                'FY19 Q1',
                'FY19 Q2',
                'FY19 Q3'
            ],
            manualRowResize: true,
            manualColumnResize: true,
            manualRowMove: true,
            manualColumnMove: true,
            contextMenu: true,
            filters: true,
            dropdownMenu: true
        };

        

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

        function editTable() {
            alert('asdasd')
        }
    }
})();
