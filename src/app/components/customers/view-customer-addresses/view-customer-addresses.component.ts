import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { urlConstant } from '../../../shared/constant/urlConst';

@Component({
    selector: 'app-view-customer-addresses',
    templateUrl: './view-customer-addresses.component.html',
    styleUrl: './view-customer-addresses.component.scss'
})
export class ViewCustomerAddressesComponent implements OnInit {
    @Input() customer: any;

    addresses: any[] = [];
    isLoading: boolean = true;
    hasError: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        this.http.get<any>(`${urlConstant.CustomerAddressAPI.getByCustomerId}${this.customer.id}`)
            .subscribe(
                res => {
                    this.addresses = res.data || [];
                    this.isLoading = false;
                },
                () => {
                    this.hasError = true;
                    this.isLoading = false;
                }
            );
    }
}
