import { Component } from '@angular/core';
import { siteConfigReqModel } from './site-configuration.model';
import { SharedService } from '../../shared/services/shared.service';
import { SiteConfigService } from './site-configuration.service';

@Component({
  selector: 'app-site-configuration',
  templateUrl: './site-configuration.component.html',
  styleUrl: './site-configuration.component.scss'
})
export class SiteConfigurationComponent {
  isDataLoaded : boolean = false;
  siteConfig : siteConfigReqModel = new siteConfigReqModel();
 
  constructor(
    public sharedservice : SharedService,
    private siteconfigservice : SiteConfigService,
  ){}

  ngOnInit(): void {
    this.getSiteConfig();
  }
  
  getSiteConfig(){
    this.siteconfigservice.getSiteConfig().subscribe((res : any) => {
      let config = res.data[0];
      this.siteConfig.currency        = config.currency        || '£';
      this.siteConfig.deliveryCharge  = config.deliveryCharge  ?? 20;
      this.siteConfig.primaryColor    = config.primaryColor    || '#7b10b9';
      this.siteConfig.metaPixelId     = config.metaPixelId     || '';
      this.siteConfig.metaAccessToken = config.metaAccessToken || '';
      this.siteConfig.buyNowText      = config.buyNowText      || 'BUY NOW';
      this.siteConfig.buyNowSubtext   = config.buyNowSubtext   || '';

      if (this.siteConfig.primaryColor) {
        this.sharedservice.setPrimaryColor(this.siteConfig.primaryColor);
      }
      this.sharedservice.siteConfig = config;
      this.isDataLoaded = true;
    })
  }
  
  updateSiteConfig(){
    const payload = {
      currency:        this.siteConfig.currency,
      deliveryCharge:  this.siteConfig.deliveryCharge,
      primaryColor:    this.siteConfig.primaryColor,
      metaPixelId:     this.siteConfig.metaPixelId,
      metaAccessToken: this.siteConfig.metaAccessToken,
      buyNowText:      this.siteConfig.buyNowText,
      buyNowSubtext:   this.siteConfig.buyNowSubtext,
    };
    this.siteconfigservice.updateSiteConfig(payload).subscribe((res : any) => {
      if(res){
        this.sharedservice.setPrimaryColor(this.siteConfig.primaryColor);
        this.sharedservice.showAlert(1,'Configuration Updated Successfully');
      } else {
        this.sharedservice.showAlert(2,'Something Went Wrong');
      }
    }, err => {
      this.sharedservice.showAlert(2,'Technical Issue Found !');
    });
  }

}
