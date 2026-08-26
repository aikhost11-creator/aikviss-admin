import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { UserService } from './users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUpdateUsersComponent } from './add-update-users/add-update-users.component';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  dataList: any = [];
  
  searchTxt: string = '';
  page: number = 1;
  totalCount: number = 0;
  limit: number = 10;
  isDataLoaded : boolean = false;
  isTechnicalIssue : boolean = false;

  constructor(public sharedservice: SharedService, private userservice: UserService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getDataList();
  }

  getDataList() {
    this.userservice.getAllUsersByPage(this.page,this.limit,this.searchTxt).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data;
        this.totalCount = res.totalCount;
        this.isDataLoaded = true;
      }
    },err => {
      this.isTechnicalIssue = true;
      this.sharedservice.showAlert(2,'Technical Issue Found !')
    })
  }
  filterData() {
    this.page = 1;
    this.searchTxt = this.searchTxt.trim();
    this.getDataList();
  }

  addUpdateData(isedit: boolean, data?) {
    const modalRef = this.modalService.open(AddUpdateUsersComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
    modalRef.componentInstance.isEdit = isedit;
    if (data) {
      modalRef.componentInstance.data = data;
    }
    modalRef.result.then(result => {
      if (result) {
        this.getDataList();
      }
    })
  }

  deleteData(id: number) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      size: 'md',
      centered: true
    });
    modalRef.result.then(result => {
      if (result) {
        if (id) {
          this.userservice.deleteUser(id).subscribe(res => {
            if (res) {
              this.sharedservice.showAlert(1, 'Deleted Successfully');
              this.getDataList();
            }
          }, err => {
            this.sharedservice.showAlert(2, 'Something Went Wrong');
          })
        } else {
          this.sharedservice.showAlert(2, 'Delete Target Not Available');
        }
      }
    })
  }

  updateStatus(newStatus, id) {
    let statusJSON = {
      isActive: newStatus
    }
    this.userservice.updateUserStatus(id, statusJSON).subscribe((res: any) => {
      if (res) {
        this.getDataList();
        this.sharedservice.showAlert(1, 'Status Updated');
      }
    })
  }
}