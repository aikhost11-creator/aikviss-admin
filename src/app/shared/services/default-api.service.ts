import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})

export class DefaultApiService {
    constructor(private http: HttpClient) { }

    getStatesList(country) {
        return this.http.get<any>('https://countriesnow.space/api/v0.1/countries/states/q?country='+country);
    }
    getCityList(country, state) {
        return this.http.get<any>(`https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${country}&state=${state}`);
    }
}