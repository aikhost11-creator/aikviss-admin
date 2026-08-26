import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { urlConstant } from '../../shared/constant/urlConst';

@Component({
    selector: 'app-orders',
    standalone: false,
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    orders: any[] = [];
    isLoading = false;
    isExporting = false;
    isTechnicalIssue = false;
    totalOrders = 0;
    currentPage = 1;
    pageSize = 20;

    // Stats (global counts, not filtered)
    stats: any = {
        total: 0, pending: 0, confirmed: 0, processing: 0,
        shipped: 0, delivered: 0, cancelled: 0, revenue: 0,
        today: 0, yesterday: 0, last7days: 0, thisMonth: 0
    };

    // Active quick date filter label
    activeDateQuick = '';

    // Filters
    filterStatus        = '';
    filterSearch        = '';
    filterDateFrom      = '';
    filterDateTo        = '';
    filterPaymentMethod = '';

    // Detail panel
    selectedOrder: any = null;

    // Shipeaso response popup
    shipeasoOrder: any = null;

    get shipeasoJson(): string {
        if (!this.shipeasoOrder?.shipeaso_response) return '';
        try { return JSON.stringify(JSON.parse(this.shipeasoOrder.shipeaso_response), null, 2); }
        catch { return this.shipeasoOrder.shipeaso_response; }
    }

    get shipeasoData(): any {
        if (!this.shipeasoOrder?.shipeaso_response) return null;
        try { return JSON.parse(this.shipeasoOrder.shipeaso_response); }
        catch { return null; }
    }

    get shipeasoRequest(): any { return this.shipeasoData?.request || null; }
    get shipeasoResponse(): any { return this.shipeasoData?.response || this.shipeasoData?.error || this.shipeasoData || null; }
    get shipeasoHasError(): boolean { return !!this.shipeasoData?.error; }

    get shipeasoRequestJson(): string {
        return this.shipeasoRequest ? JSON.stringify(this.shipeasoRequest, null, 2) : '';
    }
    get shipeasoResponseJson(): string {
        return this.shipeasoResponse ? JSON.stringify(this.shipeasoResponse, null, 2) : '';
    }

    isShipeasoSuccess(order: any): boolean {
        if (!order?.shipeaso_response) return false;
        try {
            const d = JSON.parse(order.shipeaso_response);
            if (d?.error) return false;
            const r = d?.response || d;
            return r?.status === true || r?.success === true || r?.order_id || r?.id
                || (typeof r?.message === 'string' && r.message.toLowerCase().includes('success'));
        } catch { return false; }
    }

    shipeasoResponseEntries(): { key: string; value: string }[] {
        const r = this.shipeasoResponse;
        if (!r || typeof r !== 'object') return [];
        return Object.entries(r).map(([key, value]) => ({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
        }));
    }

    viewShipeaso(order: any, e: Event) { e.stopPropagation(); this.shipeasoOrder = order; }
    closeShipeaso() { this.shipeasoOrder = null; }

    resyncingId: number | null = null;

    resyncShipeaso(order: any, e: Event) {
        e.stopPropagation();
        this.resyncingId = order.id;
        this.http.post<any>(`${urlConstant.OrderAPI.resyncShipeaso}${order.id}`, {}).subscribe({
            next: res => {
                this.resyncingId = null;
                // Update the order in list
                const idx = this.orders.findIndex(o => o.id === order.id);
                if (idx > -1) this.orders[idx] = { ...this.orders[idx], shipeaso_response: res.data?.shipeaso_response };
                if (this.shipeasoOrder?.id === order.id) this.shipeasoOrder = { ...this.shipeasoOrder, shipeaso_response: res.data?.shipeaso_response };
                this.sharedService.showAlert(1, 'Shipeaso sync attempted');
            },
            error: () => { this.resyncingId = null; this.sharedService.showAlert(2, 'Resync failed'); }
        });
    }

    statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    constructor(public sharedService: SharedService, private http: HttpClient) {}

    ngOnInit(): void { this.loadOrders(); }

    loadOrders(): void {
        this.isLoading = true;
        this.isTechnicalIssue = false;

        let url = `${urlConstant.OrderAPI.getAllOrders}?page=${this.currentPage}&limit=${this.pageSize}`;
        if (this.filterStatus)        url += `&status=${this.filterStatus}`;
        if (this.filterSearch)        url += `&search=${encodeURIComponent(this.filterSearch)}`;
        if (this.filterDateFrom)      url += `&dateFrom=${this.filterDateFrom}`;
        if (this.filterDateTo)        url += `&dateTo=${this.filterDateTo}`;
        if (this.filterPaymentMethod) url += `&paymentMethod=${this.filterPaymentMethod}`;

        this.http.get<any>(url).subscribe({
            next: res => {
                this.orders      = res.orders || [];
                this.totalOrders = res.total  || 0;
                if (res.stats)   this.stats = res.stats;
                this.isLoading   = false;
            },
            error: () => { this.isLoading = false; this.isTechnicalIssue = true; }
        });
    }

    filterData()                    { this.currentPage = 1; this.loadOrders(); }
    setStatusFilter(s: string)      { this.filterStatus = s; this.filterData(); }
    onPageChange(page: number)      { this.currentPage = page; this.loadOrders(); }

    onDateChange() {
        const fromOk = !this.filterDateFrom || this.filterDateFrom.length === 10;
        const toOk   = !this.filterDateTo   || this.filterDateTo.length   === 10;
        if (fromOk && toOk) { this.activeDateQuick = ''; this.filterData(); }
    }

    setDateQuick(label: string) {
        const today = new Date();
        const fmt = (d: Date) => d.toISOString().split('T')[0];

        if (this.activeDateQuick === label) {
            // Toggle off
            this.activeDateQuick = '';
            this.filterDateFrom = '';
            this.filterDateTo   = '';
        } else {
            this.activeDateQuick = label;
            if (label === 'today') {
                this.filterDateFrom = fmt(today);
                this.filterDateTo   = fmt(today);
            } else if (label === 'yesterday') {
                const y = new Date(today); y.setDate(y.getDate() - 1);
                this.filterDateFrom = fmt(y);
                this.filterDateTo   = fmt(y);
            } else if (label === 'last7days') {
                const d = new Date(today); d.setDate(d.getDate() - 6);
                this.filterDateFrom = fmt(d);
                this.filterDateTo   = fmt(today);
            } else if (label === 'thisMonth') {
                const d = new Date(today.getFullYear(), today.getMonth(), 1);
                this.filterDateFrom = fmt(d);
                this.filterDateTo   = fmt(today);
            }
        }
        this.filterData();
    }

    clearFilters() {
        this.filterStatus = ''; this.filterSearch = '';
        this.filterDateFrom = ''; this.filterDateTo = '';
        this.filterPaymentMethod = '';
        this.activeDateQuick = '';
        this.currentPage = 1; this.loadOrders();
    }

    get hasActiveFilters(): boolean {
        return !!(this.filterStatus || this.filterSearch || this.filterDateFrom || this.filterDateTo || this.filterPaymentMethod);
    }

    viewOrder(order: any): void {
        this.selectedOrder = { ...order };
        this.selectedOrder._items   = this.parseJSON(order.items, []);
        this.selectedOrder._address = this.parseJSON(order.deliveryAddress, null);
    }

    closeDetail() { this.selectedOrder = null; }

    customerName(order: any): string {
        const n = `${order.firstName || ''} ${order.lastName || ''}`.trim();
        return n || order.guestName || '—';
    }

    customerEmail(order: any): string { return order.email || order.guestEmail || '—'; }

    updateStatus(order: any, status: string): void {
        this.http.put<any>(`${urlConstant.OrderAPI.updateStatus}${order.id}`, { status }).subscribe({
            next: res => {
                const prev = order.status;
                order.status = res.data?.status || status;
                if (this.selectedOrder?.id === order.id) this.selectedOrder.status = order.status;
                // Update local stats counts
                if (prev !== order.status) {
                    if (this.stats[prev] !== undefined) this.stats[prev] = Math.max(0, this.stats[prev] - 1);
                    if (this.stats[order.status] !== undefined) this.stats[order.status]++;
                }
                this.sharedService.showAlert(1, 'Status updated');
            },
            error: () => this.sharedService.showAlert(2, 'Failed to update status')
        });
    }

    exportCSV(): void {
        if (this.isExporting) return;
        this.isExporting = true;

        // Build query params matching current filters
        let url = `${urlConstant.OrderAPI.exportCSV}?t=${Date.now()}`;
        if (this.filterStatus)        url += `&status=${this.filterStatus}`;
        if (this.filterSearch)        url += `&search=${encodeURIComponent(this.filterSearch)}`;
        if (this.filterDateFrom)      url += `&dateFrom=${this.filterDateFrom}`;
        if (this.filterDateTo)        url += `&dateTo=${this.filterDateTo}`;
        if (this.filterPaymentMethod) url += `&paymentMethod=${this.filterPaymentMethod}`;

        // Get auth token and trigger download via fetch → blob
        const rawToken = localStorage.getItem('admin_token');
        const token = rawToken ? atob(rawToken).replace(/"/g, '') : '';

        fetch(url, { headers: { Authorization: token } })
            .then(res => {
                if (!res.ok) throw new Error('Export failed');
                return res.blob();
            })
            .then(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(a.href);
                this.isExporting = false;
            })
            .catch(() => {
                this.sharedService.showAlert(2, 'Export failed. Please try again.');
                this.isExporting = false;
            });
    }

    parseJSON(val: any, fallback: any): any {
        try { return typeof val === 'string' ? JSON.parse(val) : (val ?? fallback); }
        catch { return fallback; }
    }

    getStatusClass(status: string): string {
        const map: any = { pending: 'yellow', confirmed: 'blue', processing: 'blue', shipped: 'green', delivered: 'green', cancelled: 'red' };
        return map[status] || 'yellow';
    }

    getStatusIcon(status: string): string {
        const map: any = { pending: 'fa-clock', confirmed: 'fa-circle-check', processing: 'fa-gear', shipped: 'fa-truck', delivered: 'fa-box-check', cancelled: 'fa-circle-xmark' };
        return 'fa-light ' + (map[status] || 'fa-circle-dot');
    }

    get currency(): string { return this.sharedService.siteConfig?.currency || '₹'; }

    getOptionEntries(options: any): { key: string; value: string }[] {
        return Object.entries(options || {}).map(([key, value]) => ({ key, value: value as string }));
    }

    capitalize(s: string): string { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
}
