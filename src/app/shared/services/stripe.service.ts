import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstant } from '../constant/urlConst';

@Injectable({
    providedIn: 'root'
})

export class StripeService {
    constructor(private http: HttpClient) { }

    getCustomerBillingInfo(req : any) {
        return this.http.post<any>(urlConstant.StripeAPI.getCustomerBillingInfo,req);
    }
    getCustomerPaymentDetails(req : any) {
        return this.http.post<any>(urlConstant.StripeAPI.getCustomerPaymentDetails,req);
    }
    getSavedPaymentMethods(req : any) {
        return this.http.post<any>(urlConstant.StripeAPI.getSavedPaymentMethods,req);
    }
    updateCustomerBillingInfo(req : any) {
        return this.http.post<any>(urlConstant.StripeAPI.updateCustomerBillingInfo,req);
    }
    getInvoicesByCustomerId(req : any) {
        return this.http.post<any>(urlConstant.StripeAPI.getInvoicesByCustomerId,req);
    }
}