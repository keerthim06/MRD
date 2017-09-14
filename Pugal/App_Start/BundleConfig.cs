using System.Web;
using System.Web.Optimization;

namespace MRD
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/js/plugins/metisMenu/jquery.metisMenu.js",
                      "~/js/plugins/slimscroll/jquery.slimscroll.min.js",
                      "~/js/plugins/pace/pace.min.js",
                      "~/js/inspinia.js",
                      "~/js/plugins/pdfmake/pdfmake.js",
                      "~/js/plugins/pdfmake/vfs_fonts.js",
                      "~/js/plugins/ExportToExcel.js",
                     // "~/js/plugins/ckeditor/ckeditor.js",
                      "~/js/angular/angular.js",
                      "~/js/plugins/oclazyload/dist/ocLazyLoad.min.js",
                      "~/js/angular-translate/angular-translate.min.js",
                      "~/js/plugins/ngSpinner/angular-loading-spinner.js",
                      "~/js/plugins/ngSpinner/spin.min.js",
                      "~/js/plugins/ngSpinner/angular-spinner.js",
                      "~/js/ui-router/angular-ui-router.min.js",
                      "~/js/bootstrap/ui-bootstrap-tpls-0.12.0.min.js",
                      "~/js/plugins/angular-idle/angular-idle.js"
                      ));

            //bundles.Add(new ScriptBundle("~/bundles/angularapp").Include(
            //          "~/js/app.js",
            //          "~/js/config.js",
            //          "~/js/translations.js",
            //          "~/js/directives.js",
            //          "~/js/repository.js",
            //          "~/js/controllers.js",
            //          "~/js/common.services.js",
            //          "~/js/contacts/contact.controller.js",
            //          "~/js/contacts/group.controller.js",
            //          "~/js/tax/tax.controller.js",
            //          "~/js/tax/taxcollection.controller.js",
            //          "~/js/IncomeExpense/income.controller.js",
            //          "~/js/IncomeExpense/expense.controller.js",
            //          "~/js/savings/savings.controller.js",
            //          "~/js/savings/returns.controller.js",
            //          "~/js/user/user.controller.js"
            //          ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/css/bootstrap.css",
                      "~/css/animate.css",
                      "~/font-awesome/css/font-awesome.css",
                      "~/css/style.css"
                      
                      ));

           // BundleTable.EnableOptimizations = true;
        }
    }
}
