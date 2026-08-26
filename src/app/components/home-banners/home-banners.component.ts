import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { HomeBannersService } from './home-banners.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUpdateHomeBannersComponent } from './add-update-home-banners/add-update-home-banners.component';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';

@Component({
    selector: 'app-home-banners',
    templateUrl: './home-banners.component.html',
    styleUrl: './home-banners.component.scss'
})
export class HomeBannersComponent implements OnInit {
    dataList: any[] = [];
    searchTxt: string = '';
    page: number = 1;
    totalCount: number = 0;
    limit: number = 10;
    isDataLoaded: boolean = false;
    isTechnicalIssue: boolean = false;

    constructor(
        public sharedservice: SharedService,
        private bannersService: HomeBannersService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.getDataList();
    }

    getDataList() {
        this.bannersService.getAllByPage(this.page, this.limit, this.searchTxt).subscribe(
            (res: any) => {
                if (res) {
                    this.dataList = res.data;
                    this.totalCount = res.totalCount;
                    this.isDataLoaded = true;
                }
            },
            err => {
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
        const modalRef = this.modalService.open(AddUpdateHomeBannersComponent, {
            size: 'lg',
            backdrop: 'static',
            centered: true
        });
        modalRef.componentInstance.isEdit = isEdit;
        if (data) {
            modalRef.componentInstance.data = data;
        }
        modalRef.result.then(result => {
            if (result) {
                this.getDataList();
            }
        }).catch(() => { });
    }

    deleteData(id: number) {
        const modalRef = this.modalService.open(DeleteConfirmationComponent, {
            size: 'md',
            centered: true
        });
        modalRef.result.then(result => {
            if (result) {
                if (id) {
                    this.bannersService.delete(id).subscribe(
                        res => {
                            this.sharedservice.showAlert(1, 'Deleted Successfully');
                            this.getDataList();
                        },
                        err => {
                            this.sharedservice.showAlert(2, 'Something Went Wrong');
                        }
                    );
                } else {
                    this.sharedservice.showAlert(2, 'Delete Target Not Available');
                }
            }
        }).catch(() => { });
    }

    updateStatus(newStatus: boolean, id: number) {
        this.bannersService.updateStatus(id, { isActive: newStatus }).subscribe(
            (res: any) => {
                if (res) {
                    this.getDataList();
                    this.sharedservice.showAlert(1, 'Status Updated');
                }
            },
            err => {
                this.sharedservice.showAlert(2, 'Something Went Wrong');
            }
        );
    }
}
