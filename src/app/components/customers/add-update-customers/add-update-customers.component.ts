import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../shared/services/shared.service';
import { CustomersService } from '../customers.service';

@Component({
    selector: 'app-add-update-customers',
    templateUrl: './add-update-customers.component.html',
    styleUrl: './add-update-customers.component.scss'
})
export class AddUpdateCustomersComponent implements OnInit {
    @Input() isEdit: boolean = false;
    @Input() data: any;

    model: any = { firstName: '', lastName: '', email: '', password: '', mobile: '', dateOfBirth: '' };
    isSubmitting: boolean = false;
    passVisible: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        public sharedservice: SharedService,
        private customersService: CustomersService
    ) { }

    ngOnInit(): void {
        if (this.data) {
            this.isEdit = true;
            this.model.firstName   = this.data.firstName;
            this.model.lastName    = this.data.lastName;
            this.model.email       = this.data.email;
            this.model.mobile      = this.data.mobile || '';
            this.model.dateOfBirth = this.data.dateOfBirth || '';
        }
    }

    validateData() {
        let errTxt = '';
        if (!this.model.firstName?.trim()) errTxt += 'Enter First Name <br/>';
        if (!this.model.lastName?.trim())  errTxt += 'Enter Last Name <br/>';
        if (!this.model.email?.trim())     errTxt += 'Enter Email <br/>';
        else if (!this.model.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errTxt += 'Enter Valid Email <br/>';
        if (!this.isEdit && !this.model.password?.trim()) errTxt += 'Enter Password <br/>';

        if (errTxt === '') {
            this.isSubmitting = true;
            this.isEdit ? this.updateData() : this.addData();
        } else {
            this.sharedservice.showAlert(2, errTxt);
        }
    }

    addData() {
        this.customersService.create(this.model).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Customer Created Successfully');
                this.activeModal.close(true);
            },
            err => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(2, err.error?.error || 'Something Went Wrong');
            }
        );
    }

    updateData() {
        this.customersService.update(this.data.id, this.model).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Customer Updated Successfully');
                this.activeModal.close(true);
            },
            err => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(2, err.error?.error || 'Something Went Wrong');
            }
        );
    }
}
