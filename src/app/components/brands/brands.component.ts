import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { BrandsService } from './brands.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUpdateBrandsComponent } from './add-update-brands/add-update-brands.component';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';
import { CategoriesService } from '../categories/categories.service';

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {

    dataList: any[] = [];
    searchTxt: string = '';
    page: number = 1;
    totalCount: number = 0;
    limit: number = 10;
    isDataLoaded: boolean = false;
    isTechnicalIssue: boolean = false;

    // All categories flat — passed to popup
    allCategories: any[] = [];

    constructor(
        public sharedservice: SharedService,
        private brandsService: BrandsService,
        private categoriesService: CategoriesService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.getDataList();
    }

    loadCategories() {
        this.categoriesService.getAll().subscribe((res: any) => {
            this.allCategories = res.data || [];
        });
    }

    getDataList() {
        this.isDataLoaded = false;
        this.brandsService.getAllByPage(this.page, this.limit, this.searchTxt).subscribe(
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
        const modalRef = this.modalService.open(AddUpdateBrandsComponent, {
            size: 'xl', backdrop: 'static', centered: true
        });
        modalRef.componentInstance.isEdit = isEdit;
        modalRef.componentInstance.allCategories = this.allCategories;
        if (data) modalRef.componentInstance.data = data;

        modalRef.result.then(result => {
            if (result) this.getDataList();
        }).catch(() => { });
    }

    deleteData(id: number) {
        const modalRef = this.modalService.open(DeleteConfirmationComponent, {
            size: 'md', centered: true
        });
        modalRef.result.then(result => {
            if (result) {
                this.brandsService.delete(id).subscribe(
                    () => {
                        this.sharedservice.showAlert(1, 'Deleted Successfully');
                        this.getDataList();
                    },
                    () => this.sharedservice.showAlert(2, 'Something Went Wrong')
                );
            }
        }).catch(() => { });
    }

    updateStatus(newStatus: boolean, id: number) {
        this.brandsService.updateStatus(id, { isActive: newStatus }).subscribe(
            () => {
                this.getDataList();
                this.sharedservice.showAlert(1, 'Status Updated');
            },
            () => this.sharedservice.showAlert(2, 'Something Went Wrong')
        );
    }

    // Get category names for a brand's categoryIds
    getCategoryName(id: number): string {
        return this.allCategories.find(c => c.id === id)?.name || '';
    }

    getCategoryNames(categoryIds: number[]): string {
        if (!categoryIds?.length) return '—';
        return categoryIds
            .map(id => this.allCategories.find(c => c.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    }
}
