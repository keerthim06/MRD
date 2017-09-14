(function () {
    'use strict';

    angular
        .module('inspinia')
        .service('commonService', commonService)
        .service('fileUpload', fileUpload);

    commonService.$inject = ['$http', 'Repository' ];
    fileUpload.$inject = ['$http'];

    function commonService($http, Repository) {

        this.filter = { "page": '', "obj": null };

        this.getData = getData;
        this.getFilterCondition = getFilterCondition;
        this.getDate = getDate;
        this.formatDate = formatDate;
        this.getDateFromOdata = getDateFromOdata;
        this.setSearchDate = setSearchDate;
        this.getUniqueItems = getUniqueItems;
        this.getTypeaheadContacts = getTypeaheadContacts;
        this.getMonths = getMonths;
        this.getReportTypes = getReportTypes;
        this.getLastDateOfMonth = getLastDateOfMonth;
        this.getReportDate = getReportDate;
        this.setFilterStr = setFilterStr;
        this.getFilterStr = getFilterStr;

        function setFilterStr(page, obj) {
            this.filter.page = page;
            this.filter.obj = obj;

        }

        function getFilterStr(page) {
            return this.filter.page === page ?  this.filter.obj : null;
        }


        function getTypeaheadContacts(val, gender, isMember, isTaxEligible) {
            var odaturl = '';
            if (isNaN(val)) {
                odaturl = '/odata/Contacts?$select=Email, ContactId,CustomerId,Title,FirstName,LastName&$filter=((startswith(FirstName,\'' + val + '\') or startswith(LastName,\'' + val + '\')))&$skip=0&$top=35';
            }
            else
            {
                odaturl = '/odata/Contacts?$select=Email, ContactId,CustomerId,Title,FirstName,LastName&$filter=(ContactId eq '+ val +')&$skip=0&$top=35';
            }
            if (angular.isDefined(gender) && gender !== '') {
                if (isNaN(val)) {
                    odaturl = '/odata/Contacts?$select=ContactId,CustomerId,Title,FirstName,LastName&$filter=((startswith(FirstName,\'' + val + '\') or startswith(LastName,\'' + val + '\')) and Gender eq \'' + gender + '\' )&$skip=0&$top=35';
                }
                else
                {
                    odaturl = '/odata/Contacts?$select=ContactId,CustomerId,Title,FirstName,LastName&$filter=((ContactId eq ' + val + ') and Gender eq \'' + gender + '\' )&$skip=0&$top=35';
                }
            }
            if (angular.isDefined(isMember) && isMember) {
                if (isNaN(val)) {
                    odaturl = '/odata/Contacts?$select=ContactId,CustomerId,Title,FirstName,LastName, Email&$filter=((startswith(FirstName,\'' + val + '\') or startswith(LastName,\'' + val + '\')) and IsMember eq true)&$skip=0&$top=35';
                }
                else
                {
                    odaturl = '/odata/Contacts?$select=ContactId,CustomerId,Title,FirstName,LastName, Email&$filter=((ContactId eq ' + val + ') and IsMember eq true)&$skip=0&$top=35';
                }
            }
            if (angular.isDefined(isMember) && isMember && angular.isDefined(isTaxEligible) && isTaxEligible) {
                if (isNaN(val)) {
                    odaturl = '/odata/Contacts?$select=ContactId,CustomerId,Title,FirstName,LastName, Email&$filter=((startswith(FirstName,\'' + val + '\') or startswith(LastName,\'' + val + '\')) and IsMember eq true and IsEligibleForTax eq true )&$skip=0&$top=35';
                }
                else
                {
                    odaturl = '/odata/Contacts?$select=ContactId,CustomerId,Title,FirstName,LastName, Email&$filter=((ContactId eq ' + val + ') and IsMember eq true and IsEligibleForTax eq true )&$skip=0&$top=35';
                }
            }
            return Repository.getData(odaturl).then(function (results) {
                var pesrons = [];
                angular.forEach(results.value, function (value, key) {
                    pesrons.push({ "Email": value.Email, "ContactId": value.ContactId, "Name": value.FirstName + ' ' + value.LastName + '   :' + value.ContactId, "ContactName": value.FirstName + ' ' + value.LastName + '   :' + value.ContactId });
                });

                return pesrons;
            });
        }


        function getDate(dt) {
            try{
                var year = dt.getFullYear();
                var month = (dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : '0' + (dt.getMonth() + 1);
                var day = dt.getDate() > 9 ? dt.getDate() : '0' + dt.getDate();
                return year + '-' + month + '-' + day;
            }catch(err){
                return dt;
            }
        }

        function getReportDate(dt) {
            try {
                var year = dt.getFullYear();
                var month = (dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : '0' + (dt.getMonth() + 1);
                var day = dt.getDate() > 9 ? dt.getDate() : '0' + dt.getDate();
                return month + '-' + day + '-' + year;
            } catch (err) {
                return dt;
            }
        }

        function getMonths() {
            return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }

        function getReportTypes() {
            return [{ "id": 1, "name": "Daily" }, { "id": 2, "name": "Monthly" }, { "id": 3, "name": "Yearly" }, { "id": 4, "name": "Date Range" }];
        }

        function getLastDateOfMonth(newdate) {
            var dt = newdate;
            switch (dt.getMonth()) {
                case 0:
                case 2:
                case 4:
                case 6:
                case 7:
                case 9:
                case 11:
                    return parseInt(dt.getMonth() + 1) + '/31/' + dt.getFullYear();
                    break;
                case 3:
                case 5:
                case 8:
                case 10:
                    return parseInt(dt.getMonth() + 1) + '/30/' + dt.getFullYear();
                    break;
                case 1:
                    var day = dt.getFullYear() % 4 == 0 ? 29 : 28;
                    return parseInt(dt.getMonth() + 1) + '/' + day + '/' + dt.getFullYear();
                    break;

            }
        }

        function formatDate(val) {
            var valArr = val.split('-');
            var valArr1 = val.split('/');
            if (valArr.length > 2) {
                val = appendZero(valArr[1].substr(0, 2)) + '-' + appendZero(valArr[0]) + '-' + appendZero(valArr[2]);
            }
            else if (valArr1.length > 2) {
                val = appendZero(valArr1[1].substr(0, 2)) + '-' + appendZero(valArr1[0]) + '-' + appendZero(valArr1[2]);
            }

            return val;
        }

        function getDateFromOdata(val) {
            var valArr = val.split('-');
            var valArr1 = val.split('/');
            if (valArr.length > 2) {
                val = appendZero(valArr[2].substr(0, 2)) + '-' + appendZero(valArr[1]) + '-' + appendZero(valArr[0]);
            }
            if (valArr1.length > 2) {
                val = appendZero(valArr1[2].substr(0, 2)) + '-' + appendZero(valArr1[1]) + '-' + appendZero(valArr1[0]);
            }
            return val;
        }

       function setSearchDate(val) {
            var valArr = val.split('-');
            var valArr1 = val.split('/');
            if (valArr.length > 2) {
                val = appendZero(valArr[2]) + '-' + appendZero(valArr[1]) + '-' + appendZero(valArr[0]);
            }
            if (valArr1.length > 2) {
                val = appendZero(valArr1[2]) + '-' + appendZero(valArr1[1]) + '-' + appendZero(valArr1[0]);
            }
            return val;
        }

       function getUniqueItems(data, key) {
            var result = [];
            angular.forEach(function (obj, index) {
                var value = data[index][key];
                if (result.indexOf(value) == -1) {
                    result.push(obj);
                }
            })
            //for (var i = 0; i < data.length; i++) {
            //    var value = data[i][key];
            //    if (result.indexOf(value) == -1) {
            //        result.push({ key: value });
            //    }
            //}
            return result;
        };

        function getFilterCondition(filterObj) {
            var str = '';
            if (filterObj != null && angular.isDefined(filterObj) && filterObj.length > 0) {
                angular.forEach(filterObj, function (value, key) {
                    if (value.operator != '') {
                        if(value.type === 'date')
                        {
                            var d1 = new Date(value.date1);
                            var mon1 = (d1.getMonth() + 1) > 9 ? (d1.getMonth() + 1) : '0' + (d1.getMonth() + 1);
                            var day1 = d1.getDate() > 9 ? d1.getDate() : '0' + d1.getDate();
                            var dt1 = d1.getFullYear() + '-' + mon1 + '-' + day1;
                            if (value.date2 !== '') {
                                var d2 = new Date(value.date2);
                                var mon2 = (d2.getMonth() + 1) > 9 ? (d2.getMonth() + 1) : '0' + (d2.getMonth() + 1);
                                var day2 = d2.getDate() > 9 ? d2.getDate() : '0' + d2.getDate();
                                var dt2 = d2.getFullYear() + '-' + mon2 + '-' + day2;
                                str += str !== '' ? ' and (' + value.key + ' ge datetime\'' + dt1 + '\' and ' + value.key + ' le datetime\'' + dt2 + '\')' :
                                   '(' + value.key + ' ge datetime\'' + dt1 + '\' and ' + value.key + ' le datetime\'' + dt2 + '\')';
                            }
                            else {
                                str += str !== '' ? ' and ' + value.operator.replace("plcholder", 'datetime\'' + dt1 + '\'') : value.operator.replace("plcholder", 'datetime\'' + dt1 + '\'');
                            }
                        }
                        else if (value.type === 'bool') {
                            str += str !== '' ? ' and ' + value.operator : value.operator;
                        }
                        else if (value.type === 'number') {
                            str += str !== '' ? ' and ' + value.operator.replace("plcholder", value.value1) : value.operator.replace("plcholder", value.value1);
                        }
                        else
                        {
                            str += str !== '' ? ' and ' + value.operator.replace("plcholder", '\'' + value.value1 + '\'') : value.operator.replace("plcholder", '\'' + value.value1 + '\'');
                        }
                    }
                })
            }
            console.log(str);
            return str.length > 0 ? '&$filter=('+ str +')' : '';
        }

        function getData() { }

        //Private methods
        function appendZero(val) {
            if (val.length == 1)
                return '0' + val;
            else
                return val;
        }
    }

    function fileUpload($http) {
        this.uploadFileToUrl = function (file, uploadUrl) {
            if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
                alert('Invalid image type. Please select valid image types like gif, jpg, jpeg, tiff or png.');
                return false;
            }
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function () {
            })
            .error(function (e) {
                console.log(e);
                alert("Some technical error in file upload" + e);
            });
        }
    }
})();