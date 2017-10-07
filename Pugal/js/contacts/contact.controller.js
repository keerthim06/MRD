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
            tragetcustomer: [{  name: "Smasung", comment: "hello world" }, { name: "LG", comment: "" }, { name: "Apple", comment: "" }],
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
                    { col1: "Cost ($)", col2: "100", col3: "100", col4: "98", col5: "96", col6: "97", col7: "96", col8: "99" },
                    { col1: "ABP ($)", col2: "195", col3: "196", col4: "197", col5: "199", col6: "194", col7: "196", col8: "195" },
                    { col1: "Volume", col2: "240", col3: "240", col4: "28", col5: "30", col6: "41", col7: "32", col8: "61" },
                    { col1: "Revenue($)", col2: "=B2*B3", col3: "=C2*C3", col4: "=D2*D3", col5: "=E2*E3", col6: "=F2*F3", col7: "=G2*G3", col8: "=H2*H3" },
                    { col1: "Volume(%)", col2: "=( B4-(B2*B1)/B4)", col3: "=(C4-(C2*C1)/C4)", col4: "=(D4-(D2*D1)/D4)", col5: "=(E4-(E2*E1)/E4)", col6: "=(F4-(F2*F1)/F4)", col7: "=(G4-(G2*G1)/G4)", col8: "=(H4-(H2*H1)/H4)" }
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
                    { col1: "Cost ($)", col2: "100", col3: "100", col4: "98", col5: "96", col6: "97", col7: "96", col8: "99" },
                    { col1: "ABP ($)", col2: "195", col3: "196", col4: "197", col5: "199", col6: "194", col7: "196", col8: "195" },
                    { col1: "Volume", col2: "240", col3: "240", col4: "28", col5: "30", col6: "41", col7: "32", col8: "61" },
                    
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
                    { col1: "Cost ($)", col2: "100", col3: "100", col4: "98", col5: "96", col6: "97", col7: "96", col8: "99" },
                    { col1: "ABP ($)", col2: "195", col3: "196", col4: "197", col5: "199", col6: "194", col7: "196", col8: "195" },
                    { col1: "Volume", col2: "240", col3: "240", col4: "28", col5: "30", col6: "41", col7: "32", col8: "61" },
                    { col1: "Revenue($)", col2: "=B2*B3", col3: "=C2*C3", col4: "=D2*D3", col5: "=E2*E3", col6: "=F2*F3", col7: "=G2*G3", col8: "=H2*H3" },
                    { col1: "Volume(%)", col2: "=( B4-(B2*B1)/B4)", col3: "=(C4-(C2*C1)/C4)", col4: "=(D4-(D2*D1)/D4)", col5: "=(E4-(E2*E1)/E4)", col6: "=(F4-(F2*F1)/F4)", col7: "=(G4-(G2*G1)/G4)", col8: "=(H4-(H2*H1)/H4)" }
                ]
            }
        };

        vm.customers = ["Smasung", "LG", "Apple", "Sony"];
        vm.attributes = ["Size L x W (mm)", "Cost", "TBD", "TBD123"];
        vm.priority = ["High", "Medium", "Low"];
        vm.data = { name: "Smasung", comment: "" };

        vm.hotElement = document.querySelector('#hot');
        //vm.hotElementContainer = hotElement.parentNode;
        vm.hotSettings = {
            data: vm.product.roi.table,
            readonlyrow: [3, 4],
            validaterow: [0,1,2],
            columns: [
                {
                    data: 'col1',
                    type: 'text',
                    readOnly: true
                },
                {
                    data: 'col2',

                },
                {
                    data: 'col3',
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
            rowHeaders: false,
            formulas: true,
            fillHandle: {
                direction: 'horizontal',
                autoInsertRow: false,
            },
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
