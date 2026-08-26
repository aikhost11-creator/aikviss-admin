import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { urlConstant } from '../../shared/constant/urlConst';

// Layout: Row 0 = [full], Row 1 = [half, half], Row 2 = [full]
// rowIndex: 0,1,2  |  colIndex per row: row0=[0], row1=[0,1], row2=[0]
export const PROMO_LAYOUT = [
    { rowIndex: 0, cols: [{ colIndex: 0, label: 'Row 1 — Full Width' }] },
    { rowIndex: 1, cols: [{ colIndex: 0, label: 'Row 2 — Left Half' }, { colIndex: 1, label: 'Row 2 — Right Half' }] },
    { rowIndex: 2, cols: [{ colIndex: 0, label: 'Row 3 — Full Width' }] },
];

@Component({
    selector: 'app-promo-banners',
    standalone: false,
    templateUrl: './promo-banners.component.html',
    styleUrl: './promo-banners.component.scss'
})
export class PromoBannersComponent implements OnInit {

    layout = PROMO_LAYOUT;
    // slots[rowIndex][colIndex] = banner data
    slots: { [row: number]: { [col: number]: any } } = {};
    isLoading = false;
    savingSlot: string | null = null;

    constructor(
        public sharedService: SharedService,
        private http: HttpClient
    ) {}

    ngOnInit(): void { this.loadAll(); }

    loadAll(): void {
        this.isLoading = true;
        this.http.get<any>(urlConstant.PromoBannerAPI.getAll).subscribe(
            res => {
                this.slots = {};
                (res.data || []).forEach((b: any) => {
                    if (!this.slots[b.rowIndex]) this.slots[b.rowIndex] = {};
                    this.slots[b.rowIndex][b.colIndex] = { ...b };
                });
                this.isLoading = false;
            },
            () => { this.isLoading = false; }
        );
    }

    getSlot(rowIndex: number, colIndex: number): any {
        return this.slots[rowIndex]?.[colIndex] || { url: '', redirectionUrl: '', label: '', isActive: true };
    }

    ensureSlot(rowIndex: number, colIndex: number): void {
        if (!this.slots[rowIndex]) this.slots[rowIndex] = {};
        if (!this.slots[rowIndex][colIndex]) {
            this.slots[rowIndex][colIndex] = { url: '', redirectionUrl: '', label: '', isActive: true };
        }
    }

    async uploadImage(rowIndex: number, colIndex: number): Promise<void> {
        this.ensureSlot(rowIndex, colIndex);
        const result = await this.sharedService.UploadFile('promo-banners', null, 'image');
        if (result?.url) {
            this.slots[rowIndex][colIndex].url = result.url;
        }
    }

    removeImage(rowIndex: number, colIndex: number): void {
        this.ensureSlot(rowIndex, colIndex);
        this.slots[rowIndex][colIndex].url = '';
    }

    saveSlot(rowIndex: number, colIndex: number): void {
        const key = `${rowIndex}_${colIndex}`;
        this.savingSlot = key;
        const slot = this.getSlot(rowIndex, colIndex);
        this.http.put<any>(`${urlConstant.PromoBannerAPI.upsert}${rowIndex}/${colIndex}`, slot).subscribe(
            () => {
                this.savingSlot = null;
                this.sharedService.showAlert(1, 'Saved successfully');
                this.loadAll();
            },
            () => {
                this.savingSlot = null;
                this.sharedService.showAlert(2, 'Something went wrong');
            }
        );
    }

    isSaving(rowIndex: number, colIndex: number): boolean {
        return this.savingSlot === `${rowIndex}_${colIndex}`;
    }
}
