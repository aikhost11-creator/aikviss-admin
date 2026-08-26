import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../shared/services/shared.service';
import { BrandsService } from '../brands.service';
import { BrandReqModel } from '../brands.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    selector: 'app-add-update-brands',
    templateUrl: './add-update-brands.component.html',
    styleUrl: './add-update-brands.component.scss'
})
export class AddUpdateBrandsComponent implements OnInit {
    @Input() isEdit: boolean = false;
    @Input() data: any;
    @Input() allCategories: any[] = [];

    dataReqModel: BrandReqModel = new BrandReqModel();
    isSubmitting: boolean = false;

    // Multi-select dropdown
    dropdownList: any[] = [];
    selectedItems: any[] = [];
    dropdownSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        itemsShowLimit: 5,
        allowSearchFilter: true,
        searchPlaceholderText: 'Search categories...',
        noDataAvailablePlaceholderText: 'No categories available',
        noFilteredDataAvailablePlaceholderText: 'No matching categories'
    };

    constructor(
        public activeModal: NgbActiveModal,
        public sharedservice: SharedService,
        private brandsService: BrandsService
    ) { }

    ngOnInit(): void {
        this.dropdownList = this.allCategories.map(c => ({ id: c.id, name: c.name }));

        if (this.data) {
            this.isEdit = true;
            this.dataReqModel.name       = this.data.name;
            this.dataReqModel.image      = this.data.image || '';
            this.dataReqModel.sortOrder  = this.data.sortOrder || 0;
            this.dataReqModel.isActive   = !!this.data.isActive;
            this.dataReqModel.categoryIds = this.data.categoryIds || [];

            this.selectedItems = this.dropdownList.filter(c => this.dataReqModel.categoryIds.includes(c.id));
        }
    }

    onCategorySelect(item: any) {
        if (!this.dataReqModel.categoryIds.includes(item.id)) {
            this.dataReqModel.categoryIds.push(item.id);
        }
    }

    onCategoryDeselect(item: any) {
        this.dataReqModel.categoryIds = this.dataReqModel.categoryIds.filter(id => id !== item.id);
    }

    onSelectAll(items: any) {
        // ng-multiselect-dropdown passes array directly
        const arr = Array.isArray(items) ? items : [];
        this.dataReqModel.categoryIds = arr.map(i => i.id);
    }

    onDeselectAll() {
        this.dataReqModel.categoryIds = [];
    }

    async uploadImage() {
        const result = await this.sharedservice.UploadFile('brands', null, 'image');
        if (result?.url) this.dataReqModel.image = result.url;
    }

    removeImage() {
        this.dataReqModel.image = '';
    }

    getCategoryName(id: number): string {
        return this.dropdownList.find(c => c.id === id)?.name || '';
    }

    validateData() {
        let errTxt = '';
        if (!this.dataReqModel.name?.trim()) errTxt += 'Enter Brand Name <br/>';

        if (errTxt === '') {
            this.dataReqModel.name = this.dataReqModel.name.trim();
            this.isSubmitting = true;
            this.isEdit ? this.updateData() : this.addData();
        } else {
            this.sharedservice.showAlert(2, errTxt);
        }
    }

    addData() {
        this.brandsService.create(this.dataReqModel).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Brand Created Successfully');
                this.activeModal.close(true);
            },
            err => {
                this.isSubmitting = false;
                if (err.status === 401) this.activeModal.close();
                else this.sharedservice.showAlert(2, 'Something Went Wrong');
            }
        );
    }

    updateData() {
        this.brandsService.update(this.data.id, this.dataReqModel).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Brand Updated Successfully');
                this.activeModal.close(true);
            },
            err => {
                this.isSubmitting = false;
                if (err.status === 401) this.activeModal.close();
                else this.sharedservice.showAlert(2, 'Something Went Wrong');
            }
        );
    }
}
