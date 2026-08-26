import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstant } from '../../shared/constant/urlConst';

@Injectable({ providedIn: 'root' })
export class CustomersService {
    constructor(private http: HttpClient) { }

    getAllByPage(page: number, limit: number, searchTxt: string) {
        return this.http.get<any>(`${urlConstant.CustomerAPI.getAllByPage}?limit=${limit}&page=${page}&searchtxt=${searchTxt}`);
    }
    create(data: any) { return this.http.post<any>(urlConstant.CustomerAPI.create, data); }
    update(id: number, data: any) { return this.http.put<any>(urlConstant.CustomerAPI.update + id, data); }
    updateStatus(id: number, data: any) { return this.http.put<any>(urlConstant.CustomerAPI.updateStatus + id, data); }
    delete(id: number) { return this.http.delete<any>(urlConstant.CustomerAPI.delete + id); }
}
