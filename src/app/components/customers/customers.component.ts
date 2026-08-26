import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { CustomersService } from './customers.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUpdateCustomersComponent } from './add-update-customers/add-update-customers.component';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';
import { ViewCustomerAddressesComponent } from './view-customer-addresses/view-customer-addresses.component';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {

    dataList: any[] = [];
    searchTxt: string = '';
    page: number = 1;
    totalCount: number = 0;
    limit: number = 10;
    isDataLoaded: boolean = false;
    isTechnicalIssue: boolean = false;

    constructor(
        public sharedservice: SharedService,
        private customersService: CustomersService,
        private modalService: NgbModal,
        private http: HttpClient
    ) { }

    ngOnInit(): void { this.getDataList(); }

    getDataList() {
        this.isDataLoaded = false;
        this.customersService.getAllByPage(this.page, this.limit, this.searchTxt).subscribe(
            (res: any) => {
                this.dataList = res.data;
                this.totalCount = res.totalCount;
                this.isDataLoaded = true;
            },
            () => {
                this.isTechnicalIssue = true;
                this.sharedservice.showAlert(2, 'Technical Issue Found!');
            }
        );
    }

    filterData() {
        this.page = 1;
        this.searchTxt = this.searchTxt.trim();
        this.getDataList();
    }

    addUpdateData(isEdit: boolean, data?: any) {
        const modalRef = this.modalService.open(AddUpdateCustomersComponent, {
            size: 'lg', backdrop: 'static', centered: true
        });
        modalRef.componentInstance.isEdit = isEdit;
        if (data) modalRef.componentInstance.data = data;
        modalRef.result.then(result => { if (result) this.getDataList(); }).catch(() => { });
    }

    viewAddresses(customer: any) {
        const modalRef = this.modalService.open(ViewCustomerAddressesComponent, {
            size: 'lg', centered: true
        });
        modalRef.componentInstance.customer = customer;
    }

    deleteData(id: number) {
        const modalRef = this.modalService.open(DeleteConfirmationComponent, { size: 'md', centered: true });
        modalRef.result.then(result => {
            if (result) {
                this.customersService.delete(id).subscribe(
                    () => { this.sharedservice.showAlert(1, 'Deleted Successfully'); this.getDataList(); },
                    () => this.sharedservice.showAlert(2, 'Something Went Wrong')
                );
            }
        }).catch(() => { });
    }

    updateStatus(newStatus: boolean, id: number) {
        this.customersService.updateStatus(id, { isActive: newStatus }).subscribe(
            () => { this.getDataList(); this.sharedservice.showAlert(1, 'Status Updated'); },
            () => this.sharedservice.showAlert(2, 'Something Went Wrong')
        );
    }
}
