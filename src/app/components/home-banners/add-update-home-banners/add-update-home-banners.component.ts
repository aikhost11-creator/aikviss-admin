import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../shared/services/shared.service';
import { HomeBannersService } from '../home-banners.service';
import { HomeBannerReqModel } from '../home-banners.model';

@Component({
    selector: 'app-add-update-home-banners',
    templateUrl: './add-update-home-banners.component.html',
    styleUrl: './add-update-home-banners.component.scss'
})
export class AddUpdateHomeBannersComponent implements OnInit {
    @Input() isEdit: boolean = false;
    @Input() data: any;

    dataReqModel: HomeBannerReqModel = new HomeBannerReqModel();
    isSubmitting: boolean = false;

    typeOptions = [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' }
    ];

    constructor(
        public activeModal: NgbActiveModal,
        public sharedservice: SharedService,
        private bannersService: HomeBannersService
    ) { }

    ngOnInit(): void {
        if (this.data) {
            this.isEdit = true;
            this.dataReqModel.type = this.data.type;
            this.dataReqModel.url = this.data.url;
            this.dataReqModel.forMobile = !!this.data.forMobile;
            this.dataReqModel.redirectionUrl = this.data.redirectionUrl || '';
            this.dataReqModel.sortOrder = this.data.sortOrder || 0;
            this.dataReqModel.isActive = !!this.data.isActive;
        }
    }

    async uploadMedia() {
        const type = this.dataReqModel.type === 'video' ? 'video' : 'image';
        const result = await this.sharedservice.UploadFile('home-banners', null, type);
        if (result?.url) {
            this.dataReqModel.url = result.url;
        }
    }

    validateData() {
        let errTxt = '';

        if (!this.dataReqModel.type) {
            errTxt += 'Select Type <br/>';
        }
        if (!this.dataReqModel.url) {
            errTxt += 'Upload Media (Image/Video) <br/>';
        }

        if (errTxt === '') {
            this.isSubmitting = true;
            if (this.isEdit) {
                this.updateData();
            } else {
                this.addData();
            }
        } else {
            this.sharedservice.showAlert(2, errTxt);
        }
    }

    addData() {
        this.bannersService.create(this.dataReqModel).subscribe(
            (res: any) => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Banner Created Successfully');
                this.activeModal.close(true);
            },
            err => {
                this.isSubmitting = false;
                if (err.status === 401) {
                    this.activeModal.close();
                } else {
                    this.sharedservice.showAlert(2, 'Something Went Wrong');
                }
            }
        );
    }

    updateData() {
        this.bannersService.update(this.data.id, this.dataReqModel).subscribe(
            (res: any) => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Banner Updated Successfully');
                this.activeModal.close(true);
            },
            err => {
                this.isSubmitting = false;
                if (err.status === 401) {
                    this.activeModal.close();
                } else {
                    this.sharedservice.showAlert(2, 'Something Went Wrong');
                }
            }
        );
    }
}
