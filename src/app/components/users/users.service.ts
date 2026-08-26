import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstant } from '../../shared/constant/urlConst';
@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) { }

    getUserList() {
        return this.http.get<any>(urlConstant.UsersAPI.getUsers);
    }
    getAllUsersByPage(page, limit, searchTxt) {
        return this.http.get<any>(urlConstant.UsersAPI.getAllUsersByPage+`?limit=${limit}&page=${page}&searchtxt=${searchTxt}`);
    }
    addUser(data) {
        return this.http.post<any>(urlConstant.UsersAPI.addUser, data);
    }
    updateUser(id, data) {
        return this.http.put<any>(urlConstant.UsersAPI.updateUser+id, data);
    }
    updateUserStatus(id, data) {
        return this.http.put<any>(urlConstant.UsersAPI.updateUserStatus+id, data);
    }
    deleteUser(id) {
        return this.http.delete<any>(urlConstant.UsersAPI.deleteUser+id);
    }
}