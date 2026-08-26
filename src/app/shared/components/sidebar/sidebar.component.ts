import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  sidebarPages: any[] = [
    {
      category: "Overview",
      pages: [
        {
          pagename: "Dashboard",
          icon: "grid-2",
          url: "/dashboard",
        }
      ]
    },
    {
      category: "Administrator",
      pages: [
        {
          pagename: "Users",
          icon: "users",
          url: "/users"
        },
        // {
        //   pagename : "Customers",
        //   icon : "user-group",
        //   url : "/customers"
        // },
        {
          pagename: "Site Configuration",
          icon: "gears",
          url: "/site-configuration"
        }
      ]
    },
    {
      category: "Content",
      pages: [
        // {
        //   pagename : "Home Banners",
        //   icon : "image",
        //   url : "/home-banners"
        // },
        {
          pagename: "Legal Pages",
          icon: "file-lines",
          url: "/legal-pages"
        },
        // {
        //   pagename : "Promo Banners",
        //   icon : "grid-2",
        //   url : "/promo-banners"
        // },
        {
          pagename: "FAQs",
          icon: "circle-question",
          url: "/faqs"
        }
      ]
    },
    {
      category: "Business",
      pages: [
        {
          pagename: "Categories",
          icon: "folder-tree",
          url: "/categories"
        },
        {
          pagename: "Products",
          icon: "box",
          url: "/products"
        },
        {
          pagename: "Orders",
          icon: "bag-shopping",
          url: "/orders"
        },
        {
          pagename: "Unsync Orders",
          icon: "truck-fast",
          url: "/unsync-orders"
        },
        // {
        //   pagename : "Abandon Checkouts",
        //   icon : "cart-shopping",
        //   url : "/abandon-checkouts"
        // }
      ]
    },
    {
      category: "Settings",
      pages: [
        {
          pagename: "Payment Settings",
          icon: "credit-card",
          url: "/payment-settings"
        }
      ]
    }
  ];

  constructor(
    public sharedservice: SharedService,
    public router: Router,
  ) { }
  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('admin_data');
    localStorage.clear();
    this.router.navigate(['/'])
  }

}
