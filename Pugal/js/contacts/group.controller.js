(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('groupCtrl', groupCtrl);

    groupCtrl.$inject = ['$location', '$scope', 'Repository', 'commonService', '$modal', 'fileUpload', '$stateParams', '$filter', '$q'];

    function groupCtrl($location, $scope, Repository, commonService, $modal, fileUpload, $stateParams, $filter, $q) {
        /* jshint validthis:true */
        var url = 'odata/Groups';

        var vm = this;
        vm.title = 'Groups';
        vm.groups = [];
        vm.Group = {};
        vm.Group.MailContacts = [];
        vm.itemsPerPage = 20;
        $scope.filterCondition = '';
        vm.totalItems = 0;
        vm.currentPage = 1;
        vm.Group.Type = 0;
        vm.isList = true;

        vm.activate = activate;
        vm.loadGroups = loadGroups;

        vm.openFilter = openFilter;
        vm.addClick = addClick;
        vm.editClick = editClick;
        vm.printClick = printClick;
        vm.excelClick = excelClick;
        vm.listClick = listClick;
        vm.deleteClick = deleteClick;
        vm.getfilterObject = getfilterObject;
        vm.clearFilter = clearFilter;
        vm.simpleSearch = simpleSearch;
        
        $scope.sortingStr = '&$orderby=ModifyDate desc';

        vm.headerIconSetting = {
            showFilter: true,
            showAdd: true,
            showPrint: true,
            showExcel : true
        };

        vm.createIconSetting = {
            showList: true,
            showPrint: true
        };

        vm.gridIconSetting = {
            showEdit: true,
            //showView: true,
            showDel: true,
            showPrint: true
        };
        vm.gridmemberIconSetting = {
            showDel: true
        };

        var columnDefs = [
        { headerName: 'Id', field: 'Id', width: 60 },
        { headerName: 'Group Name', field :'GroupName' , width: 680 },
        { headerName: 'Actions', width: 100, template: '<div ibox-tools  settings="vm.gridIconSetting" editclick="vm.editClick(data.Id);" printclick="vm.printClick(data.Id);" deleteclick="vm.deleteClick(data.Id);">Actions</div>' }
        ];
        $scope.gridOptions = {
            // we are using angular in the templates
            angularCompileRows: true,
            columnDefs: columnDefs,
            rowData: null,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            rowSelection: "single",
            dontUseScrolls: true
        };
        vm.filterModel = [
                { key: "GroupName", displayName: "Group name", type: "string", value1: '', value2: '', operator: '' }
        ];

        function activate() {
            var obj = commonService.getFilterStr('group');
            if (obj != null && angular.isDefined(obj)) {
                $scope.filterCondition = obj.filterCondition;
                vm.filterModel = obj.filterModel;
                vm.searchText = obj.searchText;
            }
            vm.isList = true;
        }

        function loadGroups(pageno) {
            var skipnum = parseInt(vm.itemsPerPage) * parseInt(pageno - 1);
            var loadurl = url + '?' + $scope.filterCondition + $scope.sortingStr + "&$skip=" + skipnum + "&$top=" + vm.itemsPerPage + "&$inlinecount=allpages";
            console.log(pageno);
            Repository.getData(loadurl).then(function (results) {
                vm.groups = results.value;
                vm.totalItems = parseInt(results["odata.count"]);
            });
        }

        function openFilter(v) {
            var modalInstance = $modal.open({
                //template: '<div customfilter filtermodel="vm.filterModel" clearfilter="vm.clearFilter();" getfilterobject="vm.getfilterObject();"></div>',
                templateUrl: 'Partials/common/filter.html',
                controller: groupCtrl,
                windowClass: "animated fadeIn"
            });
            //alert(v);
        }

        function listClick() {
            $location.path('/groups/list');
        }
        function addClick() {
            $location.path('/groups/create');
        }

        function editClick(val) {
            $location.path('groups/edit/' + val);
        }
        
        function excelClick() {
            var loadurl = url + '?&' + $scope.filterCondition + $scope.sortingStr;
            Repository.getData(loadurl).then(function (results) {
                vm.headerIconSetting.exportExcel(results.value, 'Group');
            });
        }

        function printClick(val) {
            if (val === 'edit') { val = $stateParams.Id; }
            var pdfData = {
                pageOrientation: 'portrait',
                pageSize: 'A4',
                title: 'Groups',
                type: 'horizontal',
                //widths: ['20%', '20%', '*', '*', '10%', '*', '*'],
                data: [],
                coulmns: [{ "displayName": "Group Name", "field": "GroupName", "dataType": "string" }
                    
                ]
            };
            var loadurl = '';
            if (val == 'all') {
                loadurl = url + '?&' + $scope.filterCondition + $scope.sortingStr;
            } else {
                var pdfData = {
                    pageOrientation: 'portrait',
                    pageSize: 'A4',
                    title: 'Groups',
                    type: 'horizontal',
                    //widths: ['20%', '20%', '*', '*', '10%', '*', '*'],
                    data: [],
                    coulmns: [{ "displayName": "Group Name", "field": "GroupName", "dataType": "string" },
                        { "displayName": "Contact Id", "field": "ContactId", "dataType": "number" },
                        { "displayName": "Name", "field": "ContactName", "dataType": "string" },
                        { "displayName": "Email", "field": "Email", "dataType": "string" }
                    ]
                };
                loadurl = url + '(' + val + ')?$expand=MailContacts' + $scope.filterCondition;
            }
            Repository.getData(loadurl).then(function (resp) {
                var pdf = [];
                var results = [];
                if (val === 'all') { results = resp.value } else { results.push(resp) };
                angular.forEach(results, function (value, key) {
                    pdf.push({ GroupName: value.GroupName, ContactId: '', ContactName: '', Email: '' });
                    if (value.MailContacts != null && value.MailContacts.length > 0) {
                        angular.forEach(value.MailContacts, function (data, mailKey) {
                            pdf.push({ GroupName: '', ContactId: data.ContactId, ContactName: data.ContactName, Email: data.Email });
                        });
                    }
                })
                pdfData.data = pdf;
                if (angular.isDefined(vm.createIconSetting.openPdf)) {
                    vm.createIconSetting.openPdf(pdfData);
                } else {
                    vm.headerIconSetting.openPdf(pdfData);
                }
            });
        }

        function deleteClick(val) {
            var isdelete = confirm("Do you want to delete this group?");
            if (!isdelete) { return false; }

            var delUrl = url + '(' + val + ')';
            Repository.deleteData(delUrl).then(function (results) {
                vm.loadGroups(1);
            });
        }

        function getfilterObject() {
            $scope.filterCondition = commonService.getFilterCondition(vm.filterModel);
            vm.loadGroups(1);
            vm.isSearch = true;
            changeFilterIcon();
        }
        function simpleSearch() {
            $scope.filterCondition = isNaN(vm.searchText) ? '&$filter=((startswith(GroupName,\'' + vm.searchText + '\')))' : 
                '&$filter=(Id eq ' + vm.searchText + ')';
            vm.loadGroups(1);
            changeFilterIcon();
        }
        function clearFilter() {
            $scope.filterCondition = '';
            vm.searchText = '';
            vm.loadGroups(1);
            if (vm.filterModel != null && angular.isDefined(vm.filterModel) && vm.filterModel.length > 0) {
                angular.forEach(vm.filterModel, function (value, key) {
                    value.value1 = '';
                    value.value2 = '';
                    value.operator = '';
                })
            }
            var elFilter = angular.element(document.querySelector('.filter'));
            var filterContent = elFilter.parents('.ibox').find('div.filter-content');
            elFilter.find('i').removeClass('icon-selected');
            console.log(vm.filterModel);
        }

        function changeFilterIcon() {
            var elFilter = angular.element(document.querySelector('.filter'));
            var filterContent = elFilter.parents('.ibox').find('div.filter-content');
            elFilter.find('i').addClass('icon-selected');
        }

        $scope.$watch('sortingStr', function () {
            if (vm.isList) {
                vm.loadGroups(1);
            }
        });

        $scope.$watch('filterCondition', function (newval, oldval) {
            console.log(newval);
            if (newval !== oldval) {
                var obj = {
                    "filterCondition": newval,
                    "filterModel": vm.filterModel,
                    "searchText": vm.searchText
                }
                commonService.setFilterStr('contact', obj);
            }
            if (newval !== '') {
                changeFilterIcon();
            }
        });

        /*******Create Group :: Start*********/
        
        vm.oldGroupName = '';
        vm.edit = edit;
        vm.getContacts = getContacts;
        vm.save = save;
        vm.update = update;
        vm.addContacts = addContacts;
        vm.removeClick = removeClick;
        vm.isValidGroupName = isValidGroupName;

        function addContacts() {
            if (vm.memberDetail != null && angular.isDefined(vm.memberDetail.ContactId)  && vm.memberDetail.ContactId != "" && vm.memberDetail.ContactId > 0) {
                var members = $filter('filter')(vm.Group.MailContacts, function (member) { return (member.ContactId == vm.memberDetail.ContactId) });
                if (members != null && angular.isDefined(members) && angular.isObject(members) && members.length > 0) {
                    alert("Contact already added. Please select different contact");
                    return false;
                }
                vm.Group.MailContacts.push({ "ContactId": vm.memberDetail.ContactId, "ContactName": vm.memberDetail.ContactName });
                } else {
                    alert("Please select member from dropdow");
                    return false;
                }
                vm.memberDetail = '';
        }

        function removeClick(id) {
            if (vm.Group.MailContacts != null && vm.Group.MailContacts.length > 0) {
                var members = $filter('filter')(vm.Group.MailContacts, function (member) { return (member.ContactId !== id) });
                vm.Group.MailContacts = members;
            }
        }

        function edit() {
            vm.isList = false;
            if (angular.isDefined($stateParams.Id) && $stateParams.Id > 0) {
                vm.isUpdate = true;
                var odaturl = url + '(' + $stateParams.Id + ')?$expand=MailContacts';
                return Repository.getData(odaturl).then(function (results) {
                    vm.Group = results;
                    vm.oldGroupName = vm.Group.GroupName;
                });
            }
        }

        function getContacts(val) {
            return commonService.getTypeaheadContacts(val, '', true);
        }

        

        function validate(myForm) {
            var isValid = true;
            if (angular.isUndefined(vm.Group.GroupName) || vm.Group.GroupName === '') {
                myForm.groupName.$invalid = true;
                myForm.groupName.$pristine = false;
                isValid = false;
            }
            
            if (!myForm.$valid) { alert("Please enter valid inputs"); isValid = false; }

            return isValid;
        }

        function isValidGroupName () {
            var deferred = $q.defer();
            var dataUrl = url + '?&$filter=(GroupName eq \'' + vm.Group.GroupName + '\')';
            Repository.getData(dataUrl).then(function (results) {
                deferred.resolve(results);
            });
            
            return deferred.promise;
        };

        function save(myForm) {
            if (!validate(myForm)) { return false; };
            
            vm.isUpdate = false;
            return vm.isValidGroupName().then(function (resp) {
                console.log(resp);
                if (resp != null && resp.value != null && resp.value.length > 0) {
                    alert("Group name already exist. Please provide different group name");
                } else {
                    return Repository.insertData(url, vm.Group).then(function (results) {
                        alert('Group saved successfully');
                        $location.path('/groups/list');
                    });
                }
            });
        }

        function update(myForm) {
            if (!validate(myForm)) { return false; };
           
            if (vm.Group != null && angular.isDefined(vm.Group.Id) && vm.Group.Id > 0) {
                var updateurl = url + '(' + vm.Group.Id + ')';
                if (vm.oldGroupName !== vm.Group.GroupName) {
                    return vm.isValidGroupName().then(function (resp) {
                        if (resp != null && resp.value != null && resp.value.length > 0) {
                            alert("Group name already exist. Please provide different group name");
                        } else {
                            return Repository.updateData(updateurl, vm.Group).then(function (results) {
                                alert('Group updated successfully');
                                $location.path('/groups/list');
                            });
                        }
                    });
                } else {
                    return Repository.updateData(updateurl, vm.Group).then(function (results) {
                        alert('Group updated successfully');
                        $location.path('/groups/list');
                    });
                }
            }
            else {
                alert("Invalid information for edit group")
            }
        }
        
        /*******Create Group :: END*********/
    }
})();
