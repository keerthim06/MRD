using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MRD
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            int cnt = 0;
            foreach (string url in RouteUrls)
            {
                routes.MapRoute(
                   name: string.Format("ListDefault{0}", cnt),
                   url: url,
                   defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
               );

                cnt++;
            }

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }

        private static List<string> RouteUrls
        {
            get {
                List<string> urls = new List<string>();

                urls.Add("contacts/list");
                urls.Add("contacts/create");
                urls.Add("contacts/edit/{id}");
                urls.Add("contacts/view/{id}");

                urls.Add("groups/list");
                urls.Add("groups/create");
                urls.Add("groups/edit/{id}");
                urls.Add("groups/view/{id}");

                urls.Add("tax/list");
                urls.Add("tax/create");
                urls.Add("tax/edit/{id}");
                urls.Add("tax/view/{id}");

                urls.Add("taxcollection/list");
                urls.Add("taxcollection/create");
                urls.Add("taxcollection/edit/{id}");
                urls.Add("taxcollection/view/{id}");

                urls.Add("income/list");
                urls.Add("income/create");
                urls.Add("income/edit/{id}");
                urls.Add("income/view/{id}");

                urls.Add("expense/list");
                urls.Add("expense/create");
                urls.Add("expense/edit/{id}");
                urls.Add("expense/view/{id}");

                urls.Add("savings/list");
                urls.Add("savings/create");
                urls.Add("savings/edit/{id}");
                urls.Add("savings/view/{id}");

                urls.Add("bidding/list");
                urls.Add("bidding/create");
                urls.Add("bidding/edit/{id}");
                urls.Add("bidding/view/{id}");

                urls.Add("savingsreturns/list");
                urls.Add("savingsreturns/create");
                urls.Add("savingsreturns/edit/{id}");
                urls.Add("savingsreturns/view/{id}");

                urls.Add("users/list");
                urls.Add("users/create");
                urls.Add("users/edit/{id}");
                urls.Add("users/view/{id}");
                urls.Add("users/changepassword");

                urls.Add("customer/list");
                urls.Add("customer/create");
                urls.Add("customer/edit/{id}");
                urls.Add("customer/view/{id}");

                urls.Add("reports/audit");
                urls.Add("reports/savings");
                urls.Add("reports/savingreturns");
                urls.Add("reports/loancollection");
                urls.Add("reports/taxcollection");
                urls.Add("reports/income");
                urls.Add("reports/expense");

                urls.Add("mail/campaign");

                urls.Add("loan/list");
                urls.Add("loan/create");
                urls.Add("loan/edit/{id}");
                urls.Add("loan/view/{id}");

                urls.Add("loancollections/list");
                urls.Add("loancollections/create");
                urls.Add("loancollections/edit/{id}");
                urls.Add("loancollections/view/{id}");

                urls.Add("rd/list");
                urls.Add("rd/create");
                urls.Add("rd/edit/{id}");
                urls.Add("rd/view/{id}");

                urls.Add("rdcollection/list");
                urls.Add("rdcollection/create");
                urls.Add("rdcollection/edit/{id}");
                urls.Add("rdcollection/view/{id}");

                urls.Add("rdincome/list");
                urls.Add("rdincome/create");
                urls.Add("rdincome/edit/{id}");
                urls.Add("rdincome/view/{id}");

                urls.Add("rdexpense/list");
                urls.Add("rdexpense/create");
                urls.Add("rdexpense/edit/{id}");
                urls.Add("rdexpense/view/{id}");

                urls.Add("rdcommission/list");
                urls.Add("rdcommission/create");
                urls.Add("rdcommission/edit/{id}");
                urls.Add("rdcommission/view/{id}");

                urls.Add("rdloan/list");
                urls.Add("rdloan/create");
                urls.Add("rdloan/edit/{id}");
                urls.Add("rdloan/view/{id}");

                urls.Add("rdloancollection/list");
                urls.Add("rdloancollection/create");
                urls.Add("rdloancollection/edit/{id}");
                urls.Add("rdloancollection/view/{id}");

                urls.Add("rdreports/rdaudit");
                urls.Add("rdreports/rdcollection");
                urls.Add("rdreports/rdloancollection");
                urls.Add("rdreports/rdcommission");
                urls.Add("rdreports/rdincome");
                urls.Add("rdreports/rdexpense");
                urls.Add("rdreports/settlement");
                urls.Add("rdreports/rdloans");
                urls.Add("rdreports/rdloancollections");

                return urls;
            }
        }
    }
}
