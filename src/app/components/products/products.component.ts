import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { ProductsService } from './products.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';
import { CategoriesService } from '../categories/categories.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
    @ViewChild('csvFileInput') csvFileInput!: ElementRef<HTMLInputElement>;

    dataList: any[] = [];
    searchTxt = '';
    page = 1;
    totalCount = 0;
    limit = 20;
    isDataLoaded = false;
    isTechnicalIssue = false;

    allCategories: any[] = [];
    filterCategoryId: number | null = null;

    isExporting = false;
    isImporting = false;

    constructor(
        public sharedservice: SharedService,
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private modalService: NgbModal,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadMeta();
        this.getDataList();
    }

    loadMeta() {
        this.categoriesService.getAll().subscribe((res: any) => { this.allCategories = res.data || []; });
    }

    getDataList() {
        this.isDataLoaded = false;
        const filters: any = {};
        if (this.filterCategoryId) filters.categoryId = this.filterCategoryId;

        this.productsService.getAllByPage(this.page, this.limit, this.searchTxt, filters).subscribe(
            (res: any) => {
                this.dataList = res.data || [];
                this.totalCount = res.totalCount || 0;
                this.isDataLoaded = true;
            },
            () => { this.isTechnicalIssue = true; this.sharedservice.showAlert(2, 'Technical Issue Found!'); }
        );
    }

    filterData() {
        this.page = 1;
        this.searchTxt = this.searchTxt.trim();
        this.getDataList();
    }

    clearFilters() {
        this.filterCategoryId = null;
        this.searchTxt = '';
        this.page = 1;
        this.getDataList();
    }

    goToAdd() { this.router.navigate(['/products/add']); }
    goToEdit(id: number) { this.router.navigate(['/products/edit', id]); }

    deleteData(id: number) {
        const modalRef = this.modalService.open(DeleteConfirmationComponent, { size: 'md', centered: true });
        modalRef.result.then(result => {
            if (result) {
                this.productsService.delete(id).subscribe(
                    () => { this.sharedservice.showAlert(1, 'Deleted Successfully'); this.getDataList(); },
                    () => this.sharedservice.showAlert(2, 'Something Went Wrong')
                );
            }
        }).catch(() => {});
    }

    updateStatus(newStatus: boolean, id: number) {
        this.productsService.updateStatus(id, { isActive: newStatus }).subscribe(
            () => { this.getDataList(); this.sharedservice.showAlert(1, 'Status Updated'); },
            () => this.sharedservice.showAlert(2, 'Something Went Wrong')
        );
    }

    updateFeatured(newFeatured: boolean, id: number) {
        this.productsService.updateFeatured(id, { isFeatured: newFeatured }).subscribe(
            () => { this.getDataList(); this.sharedservice.showAlert(1, newFeatured ? 'Marked as Featured' : 'Removed from Featured'); },
            () => this.sharedservice.showAlert(2, 'Something Went Wrong')
        );
    }

    getFirstImage(images: string[]): string { return images?.[0] || ''; }

    duplicateProduct(id: number) {
        this.productsService.duplicate(id).subscribe(
            (res: any) => {
                this.sharedservice.showAlert(1, 'Product duplicated! Redirecting to edit...');
                this.getDataList();
                setTimeout(() => this.router.navigate(['/products/edit', res.data.id]), 800);
            },
            () => this.sharedservice.showAlert(2, 'Something Went Wrong')
        );
    }

    exportCSV(): void {
        if (this.isExporting) return;
        this.isExporting = true;

        const url = this.productsService.exportCSV(this.searchTxt, this.filterCategoryId);
        const rawToken = localStorage.getItem('admin_token');
        const token = rawToken ? atob(rawToken).replace(/"/g, '') : '';

        fetch(url, { headers: { Authorization: token } })
            .then((res) => {
                if (!res.ok) throw new Error('Export failed');
                return res.blob();
            })
            .then((blob) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(a.href);
                this.sharedservice.showAlert(1, 'Products exported successfully');
                this.isExporting = false;
            })
            .catch(() => {
                this.sharedservice.showAlert(2, 'Export failed. Please try again.');
                this.isExporting = false;
            });
    }

    triggerImport(): void {
        this.csvFileInput?.nativeElement?.click();
    }

    onImportFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            this.sharedservice.showAlert(2, 'Please select a .csv file');
            return;
        }

        if (this.isImporting) return;
        this.isImporting = true;

        this.productsService.importCSV(file, 'upsert').subscribe({
            next: (res: any) => {
                this.isImporting = false;
                const msg = `Import done: ${res.created || 0} created, ${res.updated || 0} updated, ${res.skipped || 0} skipped, ${res.failed || 0} failed`;
                this.sharedservice.showAlert(res.failed ? 2 : 1, msg);
                this.getDataList();
            },
            error: (err) => {
                this.isImporting = false;
                this.sharedservice.showAlert(2, err?.error?.error || 'Import failed');
            }
        });
    }
}
