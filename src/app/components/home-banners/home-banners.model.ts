export class HomeBannerReqModel {
    type: string = 'image';       // 'image' | 'video'
    url: string = '';
    forMobile: boolean = false;
    redirectionUrl: string = '';
    sortOrder: number = 0;
    isActive: boolean = true;
}
