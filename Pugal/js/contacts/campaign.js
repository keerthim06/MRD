(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('campaignCtrl', campaignCtrl);

    campaignCtrl.$inject = ['$location', '$scope', 'Repository', 'commonService', '$modal', '$stateParams', '$filter', '$q'];

    function campaignCtrl($location, $scope, Repository, commonService, $modal, $stateParams, $filter, $q) {
        /* jshint validthis:true */
        var url = 'api/CommonApi/MailCampaign';

        var vm = this;
        vm.Mail = {};
        var EMAIL_REGEXP = /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/i;

        vm.title = 'Campaign';
        vm.getGroups = getGroups;
        vm.send = send;
        vm.init = init;
        
        function init() {

        }
        function getGroups(val) {
            var odaturl = '/odata/Groups?$select=Id,GroupName,Type&$filter=((startswith(GroupName,\'' + val + '\') and  Type eq 1))&$skip=0&$top=35';

            return Repository.getData(odaturl).then(function (results) {
                return results.value;
            });
        }

        function send() {
            if (!validate(myForm)) { return false; };
            vm.Mail.MailGroupId = (vm.MailGroup != null && angular.isDefined(vm.MailGroup) && vm.MailGroup.Id != '') ? vm.MailGroup.Id : 0;
            return Repository.insertData(url, vm.Mail).then(function (results) {
                alert('Mail sent successfully');
            });
        }

        function validate(myForm) {
            var isValid = true;
            if (angular.isUndefined(vm.Mail.Emails) || vm.Mail.Emails === '') {
                myForm.cname.$invalid = true;
                myForm.cname.$pristine = false;
                isValid = false;
            }
            else if (!EMAIL_REGEXP.test(vm.Mail.Emails.trim())) {
                myForm.cname.$invalid = true;
                myForm.cname.$pristine = false;
                isValid = false;
            }
            if (!isValid) { alert("Please enter valid inputs"); isValid = false; }
            return isValid;
        }
    }
})();
