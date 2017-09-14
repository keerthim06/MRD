
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider, $locationProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds
    $locationProvider.html5Mode({
        enabled: true,
       // requireBase: false
    });
    $urlRouterProvider.otherwise("/contacts/list");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('contacts', {
            abstract: true,
            url: "/contacts",
            templateUrl: "Partials/content.html",
            resolve: {
                lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'inspinia',
                        files: ['js/contacts/contact.controller.js']
                    },
                    {
                        reconfig: true,
                        name: 'ngDialog',
                        files: ['js/plugins/ngDialog/js/ngDialog.min.js', 'js/plugins/ngDialog/css/ngDialog.css', 'js/plugins/ngDialog/css/ngDialog-theme-default.css', 'js/plugins/ngDialog/css/ngDialog-theme-plain.css']
                    }

                    ]);
                }]
            }
        })
        .state('contacts.list', {
            url: "/list",
            templateUrl: "js/contacts/templates/contacts.html",
            data: { pageTitle: 'Contact List' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
        }).state('login.logout', {
        url: "/logout",
        templateUrl: "js/user/templates/logout.html",
        data: { pageTitle: 'Logout' }
    });
    
}
angular
    .module('inspinia')
    .config(config)
    .run(function ($rootScope, $state, Repository,$q) {
        $rootScope.$state = $state;

        $rootScope.loginUser = {};
       
});


