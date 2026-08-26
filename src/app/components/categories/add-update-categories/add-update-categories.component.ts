import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../shared/services/shared.service';
import { CategoriesService } from '../categories.service';
import { CategoryReqModel } from '../categories.model';

@Component({
    selector: 'app-add-update-categories',
    templateUrl: './add-update-categories.component.html',
    styleUrl: './add-update-categories.component.scss'
})
export class AddUpdateCategoriesComponent implements OnInit {
    @Input() isEdit: boolean = false;
    @Input() data: any;
    @Input() presetParentId: number | null = null;

    dataReqModel: CategoryReqModel = new CategoryReqModel();
    isSubmitting: boolean = false;

    // Flat list for parent picker
    allCategories: any[] = [];
    // Tree for visual parent picker
    parentTree: any[] = [];
    // Selected parent display name
    selectedParentName: string = '';
    // Show parent picker dropdown
    showParentPicker: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        public sharedservice: SharedService,
        private categoriesService: CategoriesService
    ) { }

    ngOnInit(): void {
        this.loadAllCategories();

        if (this.data) {
            this.isEdit = true;
            this.dataReqModel.name      = this.data.name;
            this.dataReqModel.image     = this.data.image || '';
            this.dataReqModel.parentId  = this.data.parentId ?? null;
            this.dataReqModel.sortOrder = this.data.sortOrder || 0;
            this.dataReqModel.isActive  = !!this.data.isActive;
        } else if (this.presetParentId !== null && this.presetParentId !== undefined) {
            this.dataReqModel.parentId = this.presetParentId;
        }
    }

    loadAllCategories() {
        this.categoriesService.getAll().subscribe((res: any) => {
            this.allCategories = res.data || [];

            // Exclude self + all descendants when editing
            const excluded = this.isEdit && this.data
                ? this.getDescendantIds(this.allCategories, this.data.id)
                : [];

            const filtered = this.allCategories.filter(c => !excluded.includes(c.id));
            this.parentTree = this.buildTree(filtered, null);

            // Set display name for preset
            if (this.dataReqModel.parentId) {
                const found = this.allCategories.find(c => c.id === this.dataReqModel.parentId);
                this.selectedParentName = found?.name || '';
            }
        });
    }

    // Get all descendant IDs (to prevent circular parent)
    getDescendantIds(flat: any[], id: number): number[] {
        const ids = [id];
        const children = flat.filter(c => c.parentId === id);
        for (const child of children) {
            ids.push(...this.getDescendantIds(flat, child.id));
        }
        return ids;
    }

    buildTree(flat: any[], parentId: number | null): any[] {
        return flat
            .filter(c => (c.parentId ?? null) === parentId)
            .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
            .map(c => ({ ...c, children: this.buildTree(flat, c.id), expanded: true }));
    }

    selectParent(cat: any | null) {
        this.dataReqModel.parentId = cat ? cat.id : null;
        this.selectedParentName = cat ? cat.name : '';
        this.showParentPicker = false;
    }

    clearParent() {
        this.dataReqModel.parentId = null;
        this.selectedParentName = '';
    }

    toggleParentPicker() {
        this.showParentPicker = !this.showParentPicker;
    }

    async uploadImage() {
        const result = await this.sharedservice.UploadFile('categories', null, 'image');
        if (result?.url) {
            this.dataReqModel.image = result.url;
        }
    }

    removeImage() {
        this.dataReqModel.image = '';
    }

    validateData() {
        let errTxt = '';
        if (!this.dataReqModel.name?.trim()) errTxt += 'Enter Category Name <br/>';

        if (errTxt === '') {
            this.dataReqModel.name = this.dataReqModel.name.trim();
            this.isSubmitting = true;
            this.isEdit ? this.updateData() : this.addData();
        } else {
            this.sharedservice.showAlert(2, errTxt);
        }
    }

    addData() {
        this.categoriesService.create(this.dataReqModel).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Category Created Successfully');
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
        this.categoriesService.update(this.data.id, this.dataReqModel).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Category Updated Successfully');
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
