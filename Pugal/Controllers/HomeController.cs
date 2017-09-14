
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Pugal.Controllers
{
    public class HomeController : Controller
    {
       
        
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

    }
}
