import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { urlConstant } from '../../shared/constant/urlConst';

@Component({
    selector: 'app-reels',
    standalone: false,
    templateUrl: './reels.component.html',
    styleUrls: ['./reels.component.scss']
})
export class ReelsComponent implements OnInit {

    data: any[] = [];
    isLoading = false;
    isTechnicalIssue = false;

    // Add/Edit form
    showForm = false;
    isEdit = false;
    editId: number | null = null;
    isSaving = false;

    form = { videoUrl: '', thumbnail: '', title: '', sortOrder: 0, isActive: true };

    constructor(
        public sharedService: SharedService,
        private http: HttpClient,
        private modalService: NgbModal
    ) {}

    ngOnInit() { this.load(); }

    load() {
        this.isLoading = true;
        this.isTechnicalIssue = false;
        this.http.get<any>(urlConstant.ReelsAPI.getAll).subscribe({
            next: res => { this.data = res.data || []; this.isLoading = false; },
            error: () => { this.isLoading = false; this.isTechnicalIssue = true; }
        });
    }

    openAdd() {
        this.isEdit = false;
        this.editId = null;
        this.form = { videoUrl: '', thumbnail: '', title: '', sortOrder: 0, isActive: true };
        this.showForm = true;
    }

    openEdit(item: any) {
        this.isEdit = true;
        this.editId = item.id;
        this.form = { videoUrl: item.videoUrl, thumbnail: item.thumbnail || '', title: item.title || '', sortOrder: item.sortOrder || 0, isActive: !!item.isActive };
        this.showForm = true;
    }

    closeForm() { this.showForm = false; }

    save() {
        if (!this.form.videoUrl.trim()) { this.sharedService.showAlert(2, 'Video URL is required'); return; }
        this.isSaving = true;
        const req = this.isEdit
            ? this.http.put<any>(urlConstant.ReelsAPI.update + this.editId, this.form)
            : this.http.post<any>(urlConstant.ReelsAPI.create, this.form);
        req.subscribe({
            next: () => {
                this.isSaving = false;
                this.showForm = false;
                this.sharedService.showAlert(1, this.isEdit ? 'Reel updated' : 'Reel added');
                this.load();
            },
            error: () => { this.isSaving = false; this.sharedService.showAlert(2, 'Something went wrong'); }
        });
    }

    updateStatus(id: number, isActive: boolean) {
        this.http.put<any>(urlConstant.ReelsAPI.updateStatus + id, { isActive }).subscribe({
            next: () => { this.load(); this.sharedService.showAlert(1, 'Status updated'); },
            error: () => this.sharedService.showAlert(2, 'Something went wrong')
        });
    }

    delete(id: number) {
        const ref = this.modalService.open(DeleteConfirmationComponent, { size: 'md', centered: true });
        ref.result.then(ok => {
            if (!ok) return;
            this.http.delete<any>(urlConstant.ReelsAPI.delete + id).subscribe({
                next: () => { this.sharedService.showAlert(1, 'Deleted'); this.load(); },
                error: () => this.sharedService.showAlert(2, 'Something went wrong')
            });
        }).catch(() => {});
    }

    uploadVideo() {
        const ref = this.modalService.open(FileUploadComponent, { centered: true, size: 'lg', backdrop: 'static' });
        ref.componentInstance.directory = 'reels';
        ref.componentInstance.type = 'video';
        ref.result.then((r: any) => { if (r?.status && r?.url) this.form.videoUrl = r.url; }).catch(() => {});
    }

    uploadThumbnail() {
        const ref = this.modalService.open(FileUploadComponent, { centered: true, size: 'lg', backdrop: 'static' });
        ref.componentInstance.directory = 'reels';
        ref.componentInstance.type = 'image';
        ref.result.then((r: any) => { if (r?.status && r?.url) this.form.thumbnail = r.url; }).catch(() => {});
    }
}
