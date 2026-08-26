import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstant } from '../../shared/constant/urlConst';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    constructor(private http: HttpClient) { }

    getAllByPage(page: number, limit: number, searchTxt: string) {
        return this.http.get<any>(
            `${urlConstant.CategoryAPI.getAllByPage}?limit=${limit}&page=${page}&searchtxt=${searchTxt}`
        );
    }

    getAll() {
        return this.http.get<any>(urlConstant.CategoryAPI.getAll);
    }

    create(data: any) {
        return this.http.post<any>(urlConstant.CategoryAPI.create, data);
    }

    update(id: number, data: any) {
        return this.http.put<any>(urlConstant.CategoryAPI.update + id, data);
    }

    updateStatus(id: number, data: any) {
        return this.http.put<any>(urlConstant.CategoryAPI.updateStatus + id, data);
    }

    delete(id: number) {
        return this.http.delete<any>(urlConstant.CategoryAPI.delete + id);
    }
}
