import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from './login.model';
import { urlConstant } from '../../shared/constant/urlConst';

@Injectable({
    providedIn: 'root'
})


export class LoginService {
    constructor(private http: HttpClient) { }

    userLogin(loginModal: LoginModel) {
        return this.http.post(urlConstant.LoginAPI.loginAdministrator, loginModal);
    }
}