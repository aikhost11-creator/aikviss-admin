import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { LoginModel } from './login.model';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginModel = new LoginModel();
  loginToken: any = '';
  sidebarPages;
  passVisible: boolean = false;
  isLoginClicked : boolean = false;

  constructor(
    private loginservice: LoginService,
    public sharedservice: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('admin_data')){
      this.router.navigate(['dashboard']);
    }
  }
  getEnterEvent(event) {
    if (event.keyCode == 13) {
      this.login();
    }

  }

  login() {
    let errTxt = '';
    if (!this.loginModel.email) {
      errTxt += 'Enter Email <br/>'
    }else{
      if (String(this.loginModel.email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) { } else {
        errTxt += 'Enter Valid Email<br/>'
      }
    }
    if (!this.loginModel.password) {
      errTxt += "Plese enter password <br/>";
    }    

    if (errTxt == '') {
        this.isLoginClicked = true;
        this.loginservice.userLogin(this.loginModel).subscribe((res: any) => {
          if (res) {
            localStorage.setItem('admin_data', btoa(JSON.stringify(res.user)));
            localStorage.setItem('admin_token', btoa(JSON.stringify(res.token)));
            this.sharedservice.userData = res.user;
            this.router.navigate(['/']);
            this.sharedservice.showAlert(1, 'Login Successfully');
            this.isLoginClicked = false;
          } else {
            this.isLoginClicked = false;
            this.sharedservice.showAlert(2, 'Something Went Wrong');
          }
        }, err => {
          this.sharedservice.showAlert(2, err.error.error ? err.error.error : 'Something Went Wrong');
          this.isLoginClicked = false;
        })
    } else {
      this.sharedservice.showAlert(2, errTxt);
    }
  }

  viewHidePass() {
    this.passVisible = !this.passVisible;
  }
}