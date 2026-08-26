import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { urlConstant } from '../../shared/constant/urlConst';

@Component({
    selector: 'app-abandon-checkouts',
    standalone: false,
    templateUrl: './abandon-checkouts.component.html',
    styleUrls: ['./abandon-checkouts.component.scss']
})
export class AbandonCheckoutsComponent implements OnInit {

    data: any[] = [];
    isLoading = false;
    isTechnicalIssue = false;
    total = 0;
    page = 1;
    limit = 20;
    selectedRow: any = null;

    // Stats
    totalCount     = 0;
    abandonedCount = 0;
    convertedCount = 0;

    // Filter
    filterStatus = ''; // '' | 'abandoned' | 'converted'

    constructor(public sharedService: SharedService, private http: HttpClient) {}

    ngOnInit() { this.load(); }

    load() {
        this.isLoading = true;
        this.isTechnicalIssue = false;
        let url = `${urlConstant.AbandonCheckoutAPI.getAll}?page=${this.page}&limit=${this.limit}`;
        if (this.filterStatus === 'abandoned')  url += '&isConverted=0';
        if (this.filterStatus === 'converted')  url += '&isConverted=1';

        this.http.get<any>(url).subscribe({
            next: res => {
                this.data  = res.data  || [];
                this.total = res.total || 0;
                this.totalCount     = res.totalCount     ?? res.total ?? 0;
                this.abandonedCount = res.abandonedCount ?? 0;
                this.convertedCount = res.convertedCount ?? 0;
                this.isLoading = false;
            },
            error: () => { this.isLoading = false; this.isTechnicalIssue = true; }
        });
    }

    setFilter(f: string) {
        this.filterStatus = f;
        this.page = 1;
        this.load();
    }

    onPageChange(p: number) { this.page = p; this.load(); }

    parseItems(val: any): any[] {
        try { return typeof val === 'string' ? JSON.parse(val) : (val || []); } catch { return []; }
    }

    parseAddress(val: any): any {
        try { return typeof val === 'string' ? JSON.parse(val) : (val || null); } catch { return null; }
    }

    viewRow(row: any) {
        this.selectedRow = {
            ...row,
            _items:   this.parseItems(row.items),
            _address: this.parseAddress(row.address)
        };
    }

    closeDetail() { this.selectedRow = null; }

    get currency(): string { return this.sharedService.siteConfig?.currency || '₹'; }
}
