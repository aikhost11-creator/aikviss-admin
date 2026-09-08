import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { urlConstant } from '../../shared/constant/urlConst';

@Component({
    selector: 'app-delete-orders',
    standalone: false,
    templateUrl: './delete-orders.component.html',
    styleUrls: ['./delete-orders.component.scss']
})
export class DeleteOrdersComponent implements OnInit {
    dateFrom = '';
    dateTo = '';
    maxDate = ''; // yesterday (past dates only)

    isFiltering = false;
    isDeleting = false;
    preview: any = null;
    filtered = false;

    showConfirm = false;
    confirmText = '';

    constructor(
        public sharedService: SharedService,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        this.maxDate = this.yesterdayYmd();
    }

    private yesterdayYmd(): string {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - 1);
        return this.toYmd(d);
    }

    private toYmd(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    private isPastDate(ymd: string): boolean {
        return !!ymd && ymd <= this.maxDate;
    }

    onDateChange(): void {
        // Clamp to past only
        if (this.dateFrom && this.dateFrom > this.maxDate) this.dateFrom = this.maxDate;
        if (this.dateTo && this.dateTo > this.maxDate) this.dateTo = this.maxDate;
        this.preview = null;
        this.filtered = false;
        this.showConfirm = false;
        this.confirmText = '';
    }

    filterOrders(): void {
        if (!this.dateFrom || !this.dateTo) {
            this.sharedService.showAlert(2, 'Please select From and To dates');
            return;
        }
        if (!this.isPastDate(this.dateFrom) || !this.isPastDate(this.dateTo)) {
            this.sharedService.showAlert(2, 'Only past dates are allowed');
            return;
        }
        if (this.dateFrom > this.dateTo) {
            this.sharedService.showAlert(2, 'From date cannot be after To date');
            return;
        }

        this.isFiltering = true;
        this.preview = null;
        this.filtered = false;
        this.showConfirm = false;
        this.confirmText = '';

        const url = `${urlConstant.OrderAPI.deleteOrdersPreview}?dateFrom=${this.dateFrom}&dateTo=${this.dateTo}`;
        this.http.get<any>(url).subscribe({
            next: (res) => {
                this.preview = res.data || null;
                this.filtered = true;
                this.isFiltering = false;
            },
            error: (err) => {
                this.isFiltering = false;
                this.sharedService.showAlert(2, err?.error?.error || 'Failed to load order stats');
            }
        });
    }

    openConfirm(): void {
        if (!this.preview || !this.preview.total) {
            this.sharedService.showAlert(2, 'No orders to delete in this range');
            return;
        }
        this.confirmText = '';
        this.showConfirm = true;
    }

    closeConfirm(): void {
        this.showConfirm = false;
        this.confirmText = '';
    }

    permanentlyDelete(): void {
        if (this.confirmText.trim() !== 'DELETE') {
            this.sharedService.showAlert(2, 'Type DELETE exactly to confirm');
            return;
        }
        if (this.isDeleting) return;
        this.isDeleting = true;

        this.http.post<any>(urlConstant.OrderAPI.bulkDeleteOrders, {
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            confirmText: 'DELETE'
        }).subscribe({
            next: (res) => {
                this.isDeleting = false;
                this.showConfirm = false;
                this.confirmText = '';
                const deleted = res?.data?.deleted ?? 0;
                const remaining = res?.data?.remaining ?? 0;
                if (remaining === 0) {
                    this.sharedService.showAlert(1, `Permanently deleted ${deleted} order(s) from DB`);
                } else {
                    this.sharedService.showAlert(2, `Deleted ${deleted}, but ${remaining} still remain — filter again`);
                }
                // Refresh counts
                this.filterOrders();
            },
            error: (err) => {
                this.isDeleting = false;
                this.sharedService.showAlert(2, err?.error?.error || 'Delete failed');
            }
        });
    }
}
