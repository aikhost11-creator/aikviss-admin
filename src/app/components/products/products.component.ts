import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { ProductsService } from './products.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';
import { CategoriesService } from '../categories/categories.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
    @ViewChild('csvFileInput') csvFileInput!: ElementRef<HTMLInputElement>;
    @ViewChild('reviewModal') reviewModalTpl!: TemplateRef<any>;

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

    // ── Reviews Modal ──────────────────────────────────────────────────────
    reviewModalRef: NgbModalRef | null = null;
    reviewProduct: any = null;          // current product for modal
    reviewList: any[] = [];
    reviewsLoading = false;

    // form state
    reviewEditMode = false;             // false = add, true = edit
    editingReview: any = null;          // review being edited
    reviewForm = this.emptyForm();

    private emptyForm() {
        return { reviewerName: '', rating: 5, title: '', body: '', reviewImage: '' };
    }

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

    // ── Reviews Modal ──────────────────────────────────────────────────────
    openReviews(product: any) {
        this.reviewProduct = product;
        this.reviewList = [];
        this.reviewForm = this.emptyForm();
        this.reviewEditMode = false;
        this.editingReview = null;
        this.reviewModalRef = this.modalService.open(this.reviewModalTpl, { size: 'lg', centered: true, scrollable: true });
        this.loadReviews();
    }

    loadReviews() {
        this.reviewsLoading = true;
        this.productsService.getProductReviews(this.reviewProduct.id).subscribe(
            (res: any) => { this.reviewList = res.data || []; this.reviewsLoading = false; },
            () => { this.sharedservice.showAlert(2, 'Could not load reviews'); this.reviewsLoading = false; }
        );
    }

    startAdd() {
        this.reviewEditMode = false;
        this.editingReview = null;
        this.reviewForm = this.emptyForm();
    }

    startEdit(r: any) {
        this.reviewEditMode = true;
        this.editingReview = r;
        this.reviewForm = {
            reviewerName: r.reviewerName || '',
            rating: r.rating || 5,
            title: r.title || '',
            body: r.body || '',
            reviewImage: r.reviewImage || ''
        };
    }

    cancelForm() {
        this.reviewEditMode = false;
        this.editingReview = null;
        this.reviewForm = this.emptyForm();
    }

    saveReview() {
        if (!this.reviewForm.reviewerName?.trim()) {
            this.sharedservice.showAlert(2, 'Customer name is required');
            return;
        }
        if (!this.reviewForm.rating || this.reviewForm.rating < 1 || this.reviewForm.rating > 5) {
            this.sharedservice.showAlert(2, 'Please select a rating (1-5)');
            return;
        }
        const payload = {
            reviewerName: this.reviewForm.reviewerName.trim(),
            rating: Number(this.reviewForm.rating),
            title: this.reviewForm.title?.trim() || '',
            body: this.reviewForm.body?.trim() || '',
            reviewImage: this.reviewForm.reviewImage?.trim() || null,
            productId: this.reviewProduct.id
        };

        if (this.reviewEditMode && this.editingReview) {
            this.productsService.adminUpdateReview(this.editingReview.id, payload).subscribe(
                () => { this.sharedservice.showAlert(1, 'Review updated!'); this.cancelForm(); this.loadReviews(); this.getDataList(); },
                () => this.sharedservice.showAlert(2, 'Update failed')
            );
        } else {
            this.productsService.adminAddReview(this.reviewProduct.id, payload).subscribe(
                () => { this.sharedservice.showAlert(1, 'Review added!'); this.cancelForm(); this.loadReviews(); this.getDataList(); },
                () => this.sharedservice.showAlert(2, 'Could not add review')
            );
        }
    }

    deleteReview(reviewId: number) {
        if (!confirm('Delete this review?')) return;
        this.productsService.deleteReview(reviewId).subscribe(
            () => { this.sharedservice.showAlert(1, 'Review deleted'); this.loadReviews(); this.getDataList(); },
            () => this.sharedservice.showAlert(2, 'Delete failed')
        );
    }

    toggleReviewStatus(r: any) {
        this.productsService.updateReviewStatus(r.id, { isActive: !r.isActive }).subscribe(
            () => { this.sharedservice.showAlert(1, 'Status updated'); this.loadReviews(); },
            () => this.sharedservice.showAlert(2, 'Update failed')
        );
    }

    starRange = [1, 2, 3, 4, 5];
}
