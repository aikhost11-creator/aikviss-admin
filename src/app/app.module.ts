import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { UsersComponent } from './components/users/users.component';
import { AddUpdateUsersComponent } from './components/users/add-update-users/add-update-users.component';
import { NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TableViewSkeletonComponent } from './shared/components/table-view-skeleton/table-view-skeleton.component';
import { BoxViewSkeletonComponent } from './shared/components/box-view-skeleton/box-view-skeleton.component';
import { Interceptor } from './shared/services/intercenptor';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ViewImageComponent } from './shared/components/view-image/view-image.component';
import { ViewContentComponent } from './shared/components/view-content/view-content.component';
import { NgxSimpleTextEditorModule } from 'ngx-simple-text-editor';
import { OnlyNumberDirective } from './shared/directive/only-number.directive';
import { DeleteConfirmationComponent } from './shared/components/delete-confirmation/delete-confirmation.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SiteConfigurationComponent } from './components/site-configuration/site-configuration.component';
import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';
import { ViewLocationComponent } from './shared/components/view-location/view-location.component';
import { BtnLoaderComponent } from './shared/components/btn-loader/btn-loader.component';
import { ConfigService } from './shared/services/config.service';
import { HomeBannersComponent } from './components/home-banners/home-banners.component';
import { AddUpdateHomeBannersComponent } from './components/home-banners/add-update-home-banners/add-update-home-banners.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AddUpdateCategoriesComponent } from './components/categories/add-update-categories/add-update-categories.component';
import { CategoryTreeNodeComponent } from './components/categories/category-tree-node/category-tree-node.component';
import { ParentPickerNodeComponent } from './components/categories/parent-picker-node/parent-picker-node.component';
import { ProductsComponent } from './components/products/products.component';
import { AddUpdateProductsComponent } from './components/products/add-update-products/add-update-products.component';
import { PromoBannersComponent } from './components/promo-banners/promo-banners.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AddUpdateCustomersComponent } from './components/customers/add-update-customers/add-update-customers.component';
import { ViewCustomerAddressesComponent } from './components/customers/view-customer-addresses/view-customer-addresses.component';
import { PaymentSettingsComponent } from './components/payment-settings/payment-settings.component';
import { OrdersComponent } from './components/orders/orders.component';
import { FaqsAdminComponent } from './components/faqs/faqs.component';
import { AbandonCheckoutsComponent } from './components/abandon-checkouts/abandon-checkouts.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { LegalPagesComponent } from './components/legal-pages/legal-pages.component';
import { UnsyncOrdersComponent } from './components/unsync-orders/unsync-orders.component';

export function initAppConfig(cfg: ConfigService) {
  return () => cfg.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    BreadcrumbComponent,
    UsersComponent,
    AddUpdateUsersComponent,
    TableViewSkeletonComponent,
    BoxViewSkeletonComponent,
    SpinnerComponent,
    ViewImageComponent,
    ViewContentComponent,
    DeleteConfirmationComponent,
    SiteConfigurationComponent,
    FileUploadComponent,
    ViewLocationComponent,
    BtnLoaderComponent,
    HomeBannersComponent,
    AddUpdateHomeBannersComponent,
    CategoriesComponent,
    AddUpdateCategoriesComponent,
    CategoryTreeNodeComponent,
    ParentPickerNodeComponent,
    ProductsComponent,
    AddUpdateProductsComponent,
    PromoBannersComponent,
    CustomersComponent,
    AddUpdateCustomersComponent,
    ViewCustomerAddressesComponent,
    PaymentSettingsComponent,
    OrdersComponent,
    FaqsAdminComponent,
    AbandonCheckoutsComponent,
    AboutUsComponent,
    LegalPagesComponent,
    UnsyncOrdersComponent,
  ],
  imports: [
    CommonModule,
    OnlyNumberDirective,
    FormsModule,
    BrowserModule,
    NgxPaginationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    NgbTooltip,
    NgMultiSelectDropDownModule,
    ToastrModule.forRoot(),
    NgxSimpleTextEditorModule,
    NgApexchartsModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initAppConfig, deps: [ConfigService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
