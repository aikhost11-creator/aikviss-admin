import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { urlConstant } from '../../shared/constant/urlConst';

interface SyncItem {
    id: number;
    orderNumber: string;
    guestName: string;
    contactPhone: string;
    total: number;
    paymentMethod: string;
    status: string;
    items: any;
    deliveryAddress: any;
    guestEmail: string;
    subtotal: number;
    deliveryCharge: number;
    razorpayPaymentId: string;
    paymentId: string;
    created_at: string;
    _syncStatus: 'pending' | 'syncing' | 'synced' | 'failed' | null;
    _syncMsg: string;
    shipeaso_response?: any;
}

@Component({
    selector: 'app-unsync-orders',
    standalone: false,
    templateUrl: './unsync-orders.component.html',
    styleUrls: ['./unsync-orders.component.scss']
})
export class UnsyncOrdersComponent implements OnInit, OnDestroy {

    // ── List page ─────────────────────────────────────────────────────────────
    orders: any[] = [];
    isLoading  = false;
    totalCount = 0;
    page  = 1;
    limit = 20;

    // ── Popup state ───────────────────────────────────────────────────────────
    showPopup       = false;
    isFetching      = false;   // loading orders for sync
    isSyncing       = false;
    syncDone        = false;
    syncList: SyncItem[] = [];
    currentIdx      = -1;
    selectedBatch   = 10;      // default selection
    private syncTimeout: any = null;

    readonly quickOptions = [
        { label: 'Latest 10',  value: 10  },
        { label: 'Latest 50',  value: 50  },
        { label: 'Latest 100', value: 100 },
        { label: 'All',        value: 0   },
    ];

    // ── Computed ──────────────────────────────────────────────────────────────
    get processedCount() { return this.syncList.filter(o => o._syncStatus === 'synced' || o._syncStatus === 'failed').length; }
    get syncedCount()    { return this.syncList.filter(o => o._syncStatus === 'synced').length; }
    get failedCount()    { return this.syncList.filter(o => o._syncStatus === 'failed').length; }
    get progressPct()    { return this.syncList.length ? (this.processedCount / this.syncList.length) * 100 : 0; }
    get totalInBatch()   { return this.syncList.length; }

    constructor(public sharedService: SharedService, private http: HttpClient) {}

    ngOnInit(): void  { this.loadOrders(); }
    ngOnDestroy(): void { this.clearTimeout(); }

    // ── List ──────────────────────────────────────────────────────────────────
    loadOrders(): void {
        this.isLoading = true;
        const url = `${urlConstant.OrderAPI.getUnsyncedOrders}?page=${this.page}&limit=${this.limit}`;
        this.http.get<any>(url).subscribe({
            next: res => { this.orders = res.data || []; this.totalCount = res.total || 0; this.isLoading = false; },
            error: () => { this.isLoading = false; this.sharedService.showAlert(2, 'Failed to load'); }
        });
    }

    onPageChange(p: number): void { this.page = p; this.loadOrders(); }
    onLimitChange(): void         { this.page = 1; this.loadOrders(); }

    // ── Popup open ────────────────────────────────────────────────────────────
    openSyncPopup(): void {
        this.syncList     = [];
        this.currentIdx   = -1;
        this.isSyncing    = false;
        this.syncDone     = false;
        this.isFetching   = false;
        this.selectedBatch = Math.min(10, this.totalCount) || 10;
        this.showPopup    = true;
    }

    closePopup(): void {
        if (this.isSyncing) return;
        this.clearTimeout();
        this.showPopup = false;
        this.loadOrders();
    }

    selectBatch(val: number): void {
        this.selectedBatch = val;
    }

    // effective limit for API: 0 means all → use totalCount
    get effectiveLimit(): number {
        return this.selectedBatch === 0 ? this.totalCount : this.selectedBatch;
    }

    // ── Start: fetch exactly N orders then sync one by one ────────────────────
    startSync(): void {
        if (this.isSyncing || this.isFetching) return;
        this.isFetching = true;
        this.syncList   = [];

        const fetchLimit = this.selectedBatch === 0 ? this.totalCount : this.selectedBatch;

        this.http.get<any>(`${urlConstant.OrderAPI.getUnsyncedOrders}?page=1&limit=${fetchLimit}`).subscribe({
            next: res => {
                const items: SyncItem[] = (res.data || []).map((o: any) => ({
                    ...o,
                    _syncStatus: 'pending' as const,
                    _syncMsg: ''
                }));
                this.syncList   = items;
                this.isFetching = false;
                this.isSyncing  = true;
                this.currentIdx = 0;
                this.syncNext();
            },
            error: () => {
                this.isFetching = false;
                this.sharedService.showAlert(2, 'Failed to fetch orders. Try again.');
            }
        });
    }

    private syncNext(): void {
        if (this.currentIdx >= this.syncList.length) {
            this.isSyncing = false;
            this.syncDone  = true;
            return;
        }

        const item = this.syncList[this.currentIdx];
        item._syncStatus = 'syncing';

        this.http.post<any>(`${urlConstant.OrderAPI.resyncShipeaso}${item.id}`, {}).subscribe({
            next: res => {
                const success = this.isShipeasoSuccess(res.data?.shipeaso_response);
                item._syncStatus = success ? 'synced' : 'failed';
                item._syncMsg    = success ? 'Synced'  : 'Failed';
                this.currentIdx++;
                this.syncTimeout = setTimeout(() => this.syncNext(), 600);
            },
            error: () => {
                item._syncStatus = 'failed';
                item._syncMsg    = 'API Error';
                this.currentIdx++;
                this.syncTimeout = setTimeout(() => this.syncNext(), 600);
            }
        });
    }

    private clearTimeout(): void {
        if (this.syncTimeout) { clearTimeout(this.syncTimeout); this.syncTimeout = null; }
    }

    private isShipeasoSuccess(raw: any): boolean {
        if (!raw) return false;
        try {
            const d = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (d?.error) return false;
            const r = d?.response || d;
            return r?.status === true || r?.success === true || r?.order_id || r?.id
                || (typeof r?.message === 'string' && r.message.toLowerCase().includes('success'));
        } catch { return false; }
    }

    // ── CSV ───────────────────────────────────────────────────────────────────
    exportCSV(type: 'synced' | 'failed'): void {
        const list = this.syncList.filter(o =>
            type === 'synced' ? o._syncStatus === 'synced' : o._syncStatus === 'failed'
        );
        if (!list.length) { this.sharedService.showAlert(2, `No ${type} orders`); return; }

        const tryParse = (v: any, fb: any) => { try { return typeof v === 'string' ? JSON.parse(v) : (v ?? fb); } catch { return fb; } };
        const headers = ['Order #','Date','Status','Sync Status','Customer','Phone','Email','Payment','Payment ID','Items','Subtotal','Delivery','Total','Address','City','State','Pincode'];
        const rows = list.map(o => {
            const items   = tryParse(o.items, []);
            const address = tryParse(o.deliveryAddress, {});
            return [
                o.orderNumber, new Date(o.created_at).toLocaleString('en-IN'), o.status,
                type === 'synced' ? 'Synced' : 'Failed',
                o.guestName||'', o.contactPhone||'', o.guestEmail||'',
                o.paymentMethod||'', o.razorpayPaymentId||o.paymentId||'',
                items.map((i: any) => `${i.name} x${i.quantity}`).join(' | '),
                o.subtotal, o.deliveryCharge, o.total,
                address.line1||'', address.city||'', address.state||'', address.postcode||''
            ];
        });

        const csv = [headers, ...rows].map(r => r.map((v: any) => `"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'}));
        a.download = `${type}_orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    get currency(): string { return this.sharedService.siteConfig?.currency || '₹'; }
}
