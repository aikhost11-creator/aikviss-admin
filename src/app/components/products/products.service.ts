import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstant } from '../../shared/constant/urlConst';

@Injectable({ providedIn: 'root' })
export class ProductsService {
    constructor(private http: HttpClient) { }

    getAllByPage(page: number, limit: number, searchTxt: string, filters: any = {}) {
        let url = `${urlConstant.ProductAPI.getAllByPage}?limit=${limit}&page=${page}&searchtxt=${searchTxt}`;
        if (filters.categoryId) url += `&categoryId=${filters.categoryId}`;
        return this.http.get<any>(url);
    }
    getById(id: number) {
        return this.http.get<any>(urlConstant.ProductAPI.getById + id);
    }
    create(data: any) {
        return this.http.post<any>(urlConstant.ProductAPI.create, data);
    }
    update(id: number, data: any) {
        return this.http.put<any>(urlConstant.ProductAPI.update + id, data);
    }
    updateStatus(id: number, data: any) {
        return this.http.put<any>(urlConstant.ProductAPI.updateStatus + id, data);
    }
    updateFeatured(id: number, data: any) {
        return this.http.put<any>(urlConstant.ProductAPI.updateFeatured + id, data);
    }
    delete(id: number) {
        return this.http.delete<any>(urlConstant.ProductAPI.delete + id);
    }
    duplicate(id: number) {
        return this.http.post<any>(urlConstant.ProductAPI.duplicate + id, {});
    }
    getAllReviews(page: number, limit: number, productId?: number) {
        let url = `${urlConstant.ProductAPI.getAllReviews}?limit=${limit}&page=${page}`;
        if (productId) url += `&productId=${productId}`;
        return this.http.get<any>(url);
    }
    updateReviewStatus(id: number, data: any) {
        return this.http.put<any>(urlConstant.ProductAPI.updateReviewStatus + id, data);
    }
    deleteReview(id: number) {
        return this.http.delete<any>(urlConstant.ProductAPI.deleteReview + id);
    }
}
