import { environment } from "../environment/environment";

export let urlConstant: any = {};

export function rebuildUrlConstant() {
  urlConstant = {
    LoginAPI: {
      loginAdministrator: environment.APIUrl + 'users/loginUser',
    },
    FilesAPI: {
      fileUpload: environment.APIUrl + 'file/upload',
      deleteFile: environment.APIUrl + 'file/deleteFile/',
      getFoldersByPath: environment.APIUrl + 'file/getFoldersByPath',
      getFilesByPath: environment.APIUrl + 'file/getFilesByPath',
    },
    DashboardAPI: {
      dashboard: environment.APIUrl + 'dashboard/dashboard',
    },
    SiteConfigAPI: {
      getSiteConfig: environment.APIUrl + 'siteconfig/getSiteconfig',
      updateSiteConfig: environment.APIUrl + 'siteconfig/updateSiteconfig/1',
    },
    UsersAPI: {
      getUsers: environment.APIUrl + 'users/getAllUsers',
      getAllUsersByPage: environment.APIUrl + 'users/getAllUsersByPage',
      addUser: environment.APIUrl + 'users/createUser',
      updateUser: environment.APIUrl + 'users/updateUser/',
      updateUserStatus: environment.APIUrl + 'users/updateUserStatus/',
      deleteUser: environment.APIUrl + 'users/deleteUser/',
    },
    HomeBannerAPI: {
      getAllByPage: environment.APIUrl + 'homebanner/getAllBannersByPage',
      create: environment.APIUrl + 'homebanner/createBanner',
      update: environment.APIUrl + 'homebanner/updateBanner/',
      updateStatus: environment.APIUrl + 'homebanner/updateBannerStatus/',
      delete: environment.APIUrl + 'homebanner/deleteBanner/',
    },
    CategoryAPI: {
      getAllByPage: environment.APIUrl + 'category/getAllCategoriesByPage',
      getAll: environment.APIUrl + 'category/getAllCategories',
      getChildren: environment.APIUrl + 'category/getChildren',
      create: environment.APIUrl + 'category/createCategory',
      update: environment.APIUrl + 'category/updateCategory/',
      updateStatus: environment.APIUrl + 'category/updateCategoryStatus/',
      delete: environment.APIUrl + 'category/deleteCategory/',
    },
    BrandAPI: {
      getAllByPage: environment.APIUrl + 'brand/getAllBrandsByPage',
      getAll: environment.APIUrl + 'brand/getAllBrands',
      create: environment.APIUrl + 'brand/createBrand',
      update: environment.APIUrl + 'brand/updateBrand/',
      updateStatus: environment.APIUrl + 'brand/updateBrandStatus/',
      delete: environment.APIUrl + 'brand/deleteBrand/',
    },
    ProductAPI: {
      getAllByPage: environment.APIUrl + 'product/getAllProductsByPage',
      getById: environment.APIUrl + 'product/getProductById/',
      create: environment.APIUrl + 'product/createProduct',
      update: environment.APIUrl + 'product/updateProduct/',
      updateStatus: environment.APIUrl + 'product/updateProductStatus/',
      updateFeatured: environment.APIUrl + 'product/updateProductFeatured/',
      delete: environment.APIUrl + 'product/deleteProduct/',
      duplicate: environment.APIUrl + 'product/duplicateProduct/',
      exportCSV: environment.APIUrl + 'product/exportCSV',
      importCSV: environment.APIUrl + 'product/importCSV',
      getAllReviews: environment.APIUrl + 'product/getAllReviews',
      updateReviewStatus: environment.APIUrl + 'product/updateReviewStatus/',
      deleteReview: environment.APIUrl + 'product/deleteReview/',
    },
    CustomerAPI: {
      getAllByPage: environment.APIUrl + 'customer/getAllByPage',
      create: environment.APIUrl + 'customer/createCustomer',
      update: environment.APIUrl + 'customer/updateCustomer/',
      updateStatus: environment.APIUrl + 'customer/updateStatus/',
      delete: environment.APIUrl + 'customer/deleteCustomer/',
    },
    CustomerAddressAPI: {
      getByCustomerId: environment.APIUrl + 'customer-address/admin/',
    },
    PaymentSettingsAPI: {
      getAdmin: environment.APIUrl + 'payment-settings/admin',
      update: environment.APIUrl + 'payment-settings/update',
    },
    OrderAPI: {
      getAllOrders: environment.APIUrl + 'orders/getAllOrders',
      exportCSV:   environment.APIUrl + 'orders/exportCSV',
      updateStatus: environment.APIUrl + 'orders/updateStatus/',
      getById: environment.APIUrl + 'orders/getById/',
      resyncShipeaso: environment.APIUrl + 'orders/resyncShipeaso/',
      getUnsyncedOrders: environment.APIUrl + 'orders/getUnsyncedOrders',
      syncAllUnsynced:   environment.APIUrl + 'orders/syncAllUnsynced',
    },
    AbandonCheckoutAPI: {
      getAll: environment.APIUrl + 'abandon-checkout/getAll',
    },
    ReelsAPI: {
      getAll:        environment.APIUrl + 'reels/getAll',
      create:        environment.APIUrl + 'reels/create',
      update:        environment.APIUrl + 'reels/update/',
      updateStatus:  environment.APIUrl + 'reels/updateStatus/',
      delete:        environment.APIUrl + 'reels/delete/',
    },
    AboutUsAPI: {
      get:    environment.APIUrl + 'about-us/get',
      upsert: environment.APIUrl + 'about-us/upsert',
    },
    LegalPagesAPI: {
      getAll:  environment.APIUrl + 'legal/getAll',
      getBySlug: environment.APIUrl + 'legal/get/',
      upsert:  environment.APIUrl + 'legal/upsert',
    },
    PromoBannerAPI: {
      getAll:        environment.APIUrl + 'promo-banner/getAll',
      upsert:        environment.APIUrl + 'promo-banner/upsert/',
      updateStatus:  environment.APIUrl + 'promo-banner/status/',
      clear:         environment.APIUrl + 'promo-banner/clear/',
    },
  };
}

rebuildUrlConstant();