import { Component, HostListener } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SharedService } from './shared/services/shared.service';
import { SiteConfigService } from './components/site-configuration/site-configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Casino Admin';
  
  constructor(private router : Router, private sharedservice : SharedService, private siteconfigservice : SiteConfigService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.url) {
          if(event.url != '/login' && event.url != '/register'){
            if(!localStorage.getItem('admin_data')){
              this.router.navigate(['login']);
            }            
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.onResize(null);
    this.siteconfigservice.getSiteConfig().subscribe((res : any) => {
      if(res){
        this.sharedservice.siteConfig = res.data[0];
        if (this.sharedservice.siteConfig?.siteName) {
          document.title = String(this.sharedservice.siteConfig.siteName);
        }

        if (this.sharedservice.siteConfig?.icon) {
          this.setFavicon(this.sharedservice.siteConfig.icon);
        }

        const theme = this.sharedservice.siteConfig?.theme;
        if (theme) {
          document.querySelector('body')?.classList.add(theme);
        }

        const primaryColor = this.sharedservice.siteConfig?.primaryColor;
        if (primaryColor) {
          this.sharedservice.setPrimaryColor(primaryColor);
        }
      }
    })
  }

  private setFavicon(href: string) {
    try {
      const head = document.head || document.getElementsByTagName('head')[0];
      if (!head) return;

      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        head.appendChild(link);
      }
      link.href = href;
    } catch {}
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event) {
      this.sharedservice.deviceWidth = event.target.innerWidth;
      this.sharedservice.deviceHeight = event.target.innerHeight;
    } else {
      this.sharedservice.deviceWidth = window.innerWidth;
      this.sharedservice.deviceHeight = window.innerHeight;
    }
  };
}