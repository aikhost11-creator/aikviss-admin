 import { Component, Input } from '@angular/core';
import { UserReqModel } from '../users.model';
import { SharedService } from '../../../shared/services/shared.service';
import { UserService } from '../users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-update-users',
  templateUrl: './add-update-users.component.html',
  styleUrl: './add-update-users.component.scss'
})
export class AddUpdateUsersComponent {
  @Input() isEdit;
  @Input() data;
  dataReqModel: UserReqModel = new UserReqModel();
  roleList : any[];

  constructor(public sharedservice: SharedService, private userservice: UserService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEdit = true;
      this.dataReqModel.email = this.data.email;
      this.dataReqModel.isActive = this.data.isActive;
      this.dataReqModel.mobile = this.data.mobile;
      this.dataReqModel.name = this.data.name;
      this.dataReqModel.password = this.data.password;
    }
  }

  validateData() {
    let errTxt = '';

    if (!this.dataReqModel.name) {
      errTxt += 'Enter Name <br/>'
    }
    if (!this.dataReqModel.password) {
      errTxt += 'Enter Password <br/>'
    }
    if (!this.dataReqModel.email) {
      errTxt += 'Enter Email <br/>'
    }else{
      if (String(this.dataReqModel.email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) { } else {
        errTxt += 'Enter Valid Email<br/>'
      }
    }
    if (!this.dataReqModel.mobile) {
      errTxt += 'Enter Mobile <br/>'
    }else{
      if(String(this.dataReqModel.mobile).length != 10){
        errTxt += 'Enter Valid Mobile <br/>'
      }
    }
     
    if (errTxt == '') {
      this.dataReqModel.mobile = String(this.dataReqModel.mobile);
      this.dataReqModel.isActive = true;
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
    this.userservice.addUser(this.dataReqModel).subscribe((res: any) => {
      if (res) {
        this.sharedservice.showAlert(1, 'Data Added Successfully');
        this.activeModal.close(true);
      } else {
        this.sharedservice.showAlert(2, 'Something Went Wrong');
      }
    }, err => {
      if(err.status == 401){
        this.activeModal.close();
      }else{
        this.sharedservice.showAlert(2, 'Something Went Wrong');
      }
    })
  }
  updateData() {
    this.userservice.updateUser(this.data.id, this.dataReqModel).subscribe((res: any) => {
      if (res) {
        this.sharedservice.showAlert(1, 'Data Updated Successfully');
        this.activeModal.close(true);
      } else {
        this.sharedservice.showAlert(2, 'Something Went Wrong');
      }
    }, err => {
      if(err.status == 401){
        this.activeModal.close();
      }else{
        this.sharedservice.showAlert(2, 'Something Went Wrong');
      }
    })
  }
}