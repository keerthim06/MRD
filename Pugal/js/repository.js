(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('Repository', repository);

    repository.$inject = ['$http', '$q'];

    function repository($http, $q) {
        var service = {
            getData: getData,
            insertData: insertData,
            updateData: updateData,
            deleteData: deleteData,
            patchData: patchData
        };

        return service;

        function getData(url) {
            return $http.get(url)
            .error(function (err, statuscode) {
                console.log("Error in service call " + url + '\n' + statuscode);
                switch (statuscode) {
                    case 401:
                        location.href = location.href.split('/')[0] + '/' + 'login';
                        break;
                    case 409:
                        break;
                    default:
                        alert(err["odata.error"].innererror.message);
                        break;
                }
            })
            .then(function (resp) {
                if (resp != null && resp.data != null) {
                    return resp.data;
                }
                else {
                    console.log("Error in fetching data from service url : " + url);
                    return null;
                }
            });
        }

        function insertData(url, data, errorcallback) {
            return $http.post(url, data)
            .error(function (err, statuscode) {
                console.log("Error in service call " + url + '\n' + err);
                switch (statuscode) {
                    case 401:
                        location.href = location.href.split('/')[0] + '/' + 'login';
                        break;
                    case 409:
                        alert('Record can not be inserted since used in other modules or already approved');
                        break;
                    default:
                        alert(err["odata.error"].innererror.message);
                        break;

                }
            })
            .then(function (resp) {
                if (resp != null && resp.data != null) {
                    return resp.data;
                }
                else {
                    console.log("Error in fetching data from service url : " + url);
                    return null;
                }
            });
        }

        function updateData(url, data) {
            return $http.put(url, data)
            .error(function (err, statuscode) {
                console.log("Error in service call " + url + '\n' + err);
                switch (statuscode) {
                    case 401:
                        location.href = location.href.split('#')[0] + '/' + 'login';
                        break;
                    case 409:
                        alert('Record can not be updated since used in other modules or already approved');
                        break;
                    default:
                        alert(err["odata.error"].innererror.message);
                        break;
                }
            })
            .then(function (resp) {
                if (resp != null && resp.data != null) {
                    return resp.data;
                }
                else {
                    console.log("Error in fetching data from service url : " + url);
                    return null;
                }
            });
        }

        function patchData(url, data) {
            return $http.patch(url, data)
            .error(function (err, statuscode) {
                console.log("Error in service call " + url + '\n' + err);
                switch (statuscode) {
                    case 401:
                        location.href = location.href.split('#')[0] + '/' + 'login';
                        break;
                    case 409:
                        alert('Record can not be deleted since used in other modules or already approved');
                        break;
                    default:
                        alert(err["odata.error"].innererror.message);
                        break;
                }
            })
            .then(function (resp) {
                if (resp != null && resp.data != null) {
                    return resp.data;
                }
                else {
                    console.log("Error in fetching data from service url : " + url);
                    return null;
                }
            });
        }

        function deleteData(url) {
            return $http.delete(url)
            .error(function (err, statuscode) {
                console.log("Error in service call " + url + '\n' + err);
                switch (statuscode) {
                    case 401:
                        location.href = location.href.split('#')[0] + '/' + 'login';
                        break;
                    case 409:
                        alert('Record can not be deleted since used in other modules or already approved');
                        break;
                    default:
                        alert(err["odata.error"].innererror.message);
                        break;
                }
            })
            .then(function (resp) {
                if (resp != null && resp.data != null) {
                    return resp.data;
                }
                else {
                    console.log("Error in fetching data from service url : " + url);
                    return null;
                }
            });
        }
    }
})();