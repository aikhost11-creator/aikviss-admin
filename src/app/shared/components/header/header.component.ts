import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen : boolean = false;

  constructor(public sharedservice : SharedService, public router : Router){}

  logout(){
    localStorage.removeItem('admin_data');
    localStorage.clear();
    this.router.navigate(['/'])
  }


}
