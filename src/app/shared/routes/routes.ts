import { Routes } from "@angular/router";
import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { UsersComponent } from "../../components/users/users.component";
import { SiteConfigurationComponent } from "../../components/site-configuration/site-configuration.component";
import { HomeBannersComponent } from "../../components/home-banners/home-banners.component";
import { CategoriesComponent } from "../../components/categories/categories.component";
import { ProductsComponent } from "../../components/products/products.component";
import { AddUpdateProductsComponent } from "../../components/products/add-update-products/add-update-products.component";
import { CustomersComponent } from "../../components/customers/customers.component";
import { PaymentSettingsComponent } from "../../components/payment-settings/payment-settings.component";
import { OrdersComponent } from "../../components/orders/orders.component";
import { PromoBannersComponent } from "../../components/promo-banners/promo-banners.component";
import { FaqsAdminComponent } from "../../components/faqs/faqs.component";
import { AbandonCheckoutsComponent } from "../../components/abandon-checkouts/abandon-checkouts.component";
import { LegalPagesComponent } from "../../components/legal-pages/legal-pages.component";
import { UnsyncOrdersComponent } from "../../components/unsync-orders/unsync-orders.component";

export const routing: Routes = [
    { path: '', redirectTo: '', pathMatch: "full" },
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersComponent },
    { path: 'customers', component: CustomersComponent },
    { path: 'site-configuration', component: SiteConfigurationComponent },
    { path: 'home-banners', component: HomeBannersComponent },
    { path: 'promo-banners', component: PromoBannersComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'products/add', component: AddUpdateProductsComponent },
    { path: 'products/edit/:id', component: AddUpdateProductsComponent },
    { path: 'payment-settings', component: PaymentSettingsComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'unsync-orders', component: UnsyncOrdersComponent },
    { path: 'faqs', component: FaqsAdminComponent },
    { path: 'abandon-checkouts', component: AbandonCheckoutsComponent },
    { path: 'legal-pages', component: LegalPagesComponent },
    { path: '**', redirectTo: 'dashboard', pathMatch: "full" },
]
