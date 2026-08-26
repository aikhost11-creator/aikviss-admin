import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { ProductsService } from '../products.service';
import { CategoriesService } from '../../categories/categories.service';
import { ProductReqModel } from '../products.model';
import { EditorConfig, ST_BUTTONS } from 'ngx-simple-text-editor';

@Component({
    selector: 'app-add-update-products',
    standalone: false,
    templateUrl: './add-update-products.component.html',
    styleUrl: './add-update-products.component.scss'
})
export class AddUpdateProductsComponent implements OnInit {

    isEdit = false;
    productId: number | null = null;
    isPageLoading = false;
    isSubmitting = false;

    model = new ProductReqModel();

    allCategories: any[] = [];

    editorConfig: EditorConfig = {
        placeholder: 'Describe the product — use bold, colors, emojis...',
        buttons: ST_BUTTONS,
    };

    // Variant inputs
    newVariantName = '';
    newOptionLabel: { [vi: number]: string } = {};
    newOptionStock: { [vi: number]: number } = {};

    // Tag input
    newTag = '';

    // Active section for sticky nav
    activeSection = 'basic';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public sharedservice: SharedService,
        private productsService: ProductsService,
        private categoriesService: CategoriesService
    ) {}

    ngOnInit(): void {
        this.loadMeta();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.productId = +id;
            this.loadProduct(this.productId);
        }
    }

    loadMeta() {
        this.categoriesService.getAll().subscribe((res: any) => { this.allCategories = res.data || []; });
    }

    loadProduct(id: number) {
        this.isPageLoading = true;
        this.productsService.getById(id).subscribe(
            (res: any) => {
                const d = res.data;
                if (!d) { this.router.navigate(['/products']); return; }
                this.model.name               = d.name;
                this.model.slug               = d.slug || '';
                this.model.sku                = d.sku || '';
                this.model.description        = d.description || '';
                this.model.shortDescription   = d.shortDescription || '';
                this.model.resultTag          = d.resultTag || '';
                this.model.badge              = d.badge || '';
                this.model.price              = d.price || 0;
                this.model.salePrice          = d.salePrice || null;
                this.model.categoryId         = d.categoryId || null;
                this.model.images             = [...(d.images || [])];
                this.model.variants           = JSON.parse(JSON.stringify(d.variants || []));
                this.model.tags               = [...(d.tags || [])];
                this.model.benefits           = [...(d.benefits || [])];
                this.model.whyLoveIt          = JSON.parse(JSON.stringify(d.whyLoveIt || []));
                this.model.keyIngredients     = JSON.parse(JSON.stringify(d.keyIngredients || []));
                this.model.howToUse           = d.howToUse || '';
                this.model.additionalDetails  = d.additionalDetails || '';
                this.model.consumerCareDetails= d.consumerCareDetails || '';
                this.model.faqs               = JSON.parse(JSON.stringify(d.faqs || []));
                this.model.promoImage         = d.promoImage || '';
                this.model.promoReel          = d.promoReel || '';
                this.model.galleryMedia       = JSON.parse(JSON.stringify(d.galleryMedia || []));
                this.model.sizeGuideImage     = d.sizeGuideImage || '';
                this.model.isActive           = !!d.isActive;
                this.model.isFeatured         = !!d.isFeatured;
                this.model.sortOrder          = d.sortOrder || 0;
                this.isPageLoading = false;
            },
            () => { this.router.navigate(['/products']); }
        );
    }

    // ── Slug ─────────────────────────────────────────────────────────────────
    autoSlug() {
        if (!this.model.slug && this.model.name) {
            this.model.slug = this.model.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
    }

    regenerateSlug() {
        this.model.slug = this.model.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // ── Images ────────────────────────────────────────────────────────────────
    async addImage() {
        const result = await this.sharedservice.UploadFile('products', null, 'image');
        if (result?.url) this.model.images.push(result.url);
    }

    removeImage(i: number) { this.model.images.splice(i, 1); }

    setMainImage(i: number) {
        if (i === 0) return;
        const img = this.model.images.splice(i, 1)[0];
        this.model.images.unshift(img);
    }

    moveImage(i: number, dir: -1 | 1) {
        const j = i + dir;
        if (j < 0 || j >= this.model.images.length) return;
        [this.model.images[i], this.model.images[j]] = [this.model.images[j], this.model.images[i]];
    }

    // ── Variants ──────────────────────────────────────────────────────────────
    addVariant() {
        const name = this.newVariantName.trim();
        if (!name) return;
        if (this.model.variants.find(v => v.name.toLowerCase() === name.toLowerCase())) {
            this.sharedservice.showAlert(2, 'Variant already exists');
            return;
        }
        this.model.variants.push({ name, options: [] });
        this.newVariantName = '';
    }

    removeVariant(i: number) { this.model.variants.splice(i, 1); }

    addOption(vi: number) {
        const label = (this.newOptionLabel[vi] || '').trim();
        if (!label) return;
        const stock = this.newOptionStock[vi] || 0;
        this.model.variants[vi].options.push({ label, value: label.toLowerCase().replace(/\s+/g, '-'), stock, sku: '' });
        this.newOptionLabel[vi] = '';
        this.newOptionStock[vi] = 0;
    }

    removeOption(vi: number, oi: number) { this.model.variants[vi].options.splice(oi, 1); }

    // ── Tags ──────────────────────────────────────────────────────────────────
    addTag() {
        const t = this.newTag.trim().toLowerCase();
        if (t && !this.model.tags.includes(t)) this.model.tags.push(t);
        this.newTag = '';
    }

    removeTag(i: number) { this.model.tags.splice(i, 1); }

    onTagKey(e: KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); this.addTag(); }
    }

    // ── Benefits ──────────────────────────────────────────────────────────────
    newBenefit = '';
    addBenefit() {
        const b = this.newBenefit.trim();
        if (b) { this.model.benefits.push(b); this.newBenefit = ''; }
    }
    removeBenefit(i: number) { this.model.benefits.splice(i, 1); }
    onBenefitKey(e: KeyboardEvent) {
        if (e.key === 'Enter') { e.preventDefault(); this.addBenefit(); }
    }

    // ── Why Love It ───────────────────────────────────────────────────────────
    addWhyLove() { this.model.whyLoveIt.push({ title: '', description: '' }); }
    removeWhyLove(i: number) { this.model.whyLoveIt.splice(i, 1); }

    // ── Key Ingredients ───────────────────────────────────────────────────────
    addIngredient() { this.model.keyIngredients.push({ name: '', description: '', image: '' }); }
    removeIngredient(i: number) { this.model.keyIngredients.splice(i, 1); }
    async uploadIngredientImage(i: number) {
        const result = await this.sharedservice.UploadFile('products', null, 'image');
        if (result?.url) this.model.keyIngredients[i].image = result.url;
    }

    // ── FAQs ──────────────────────────────────────────────────────────────────
    addFaq() { this.model.faqs.push({ question: '', answer: '' }); }
    removeFaq(i: number) { this.model.faqs.splice(i, 1); }

    // ── Promo Image ───────────────────────────────────────────────────────────
    async uploadPromoImage() {
        const result = await this.sharedservice.UploadFile('products', null, 'image');
        if (result?.url) this.model.promoImage = result.url;
    }

    // ── Promo Reel ────────────────────────────────────────────────────────────
    async uploadPromoReel() {
        const result = await this.sharedservice.UploadFile('products', null, 'video');
        if (result?.url) this.model.promoReel = result.url;
    }

    // ── Size Guide Image ──────────────────────────────────────────────────────
    async uploadSizeGuideImage() {
        const result = await this.sharedservice.UploadFile('products', null, 'image');
        if (result?.url) this.model.sizeGuideImage = result.url;
    }

    // ── Gallery Media ─────────────────────────────────────────────────────────
    async addGalleryMedia(type: 'image' | 'video') {
        const result = await this.sharedservice.UploadFile('products', null, type);
        if (result?.url) this.model.galleryMedia.push({ type, url: result.url, thumbnail: '' });
    }
    removeGalleryMedia(i: number) { this.model.galleryMedia.splice(i, 1); }

    // ── Submit ────────────────────────────────────────────────────────────────
    validate() {
        let err = '';
        if (!this.model.name?.trim())                    err += 'Product name is required.<br/>';
        if (!this.model.price || this.model.price <= 0)  err += 'Price must be greater than 0.<br/>';
        if (this.model.salePrice && this.model.salePrice >= this.model.price) err += 'Sale price must be less than original price.<br/>';
        if (err) { this.sharedservice.showAlert(2, err); return; }

        this.model.name = this.model.name.trim();
        if (!this.model.slug) this.regenerateSlug();
        this.isSubmitting = true;
        this.isEdit ? this.update() : this.create();
    }

    create() {
        this.productsService.create(this.model).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Product created successfully!');
                this.router.navigate(['/products']);
            },
            err => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(2, err?.error?.error || 'Something went wrong');
            }
        );
    }

    update() {
        this.productsService.update(this.productId!, this.model).subscribe(
            () => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(1, 'Product updated successfully!');
                this.router.navigate(['/products']);
            },
            err => {
                this.isSubmitting = false;
                this.sharedservice.showAlert(2, err?.error?.error || 'Something went wrong');
            }
        );
    }

    cancel() { this.router.navigate(['/products']); }

    scrollTo(sectionId: string) {
        this.activeSection = sectionId;
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    get totalStock(): number {
        return this.model.variants.reduce((sum, v) => sum + v.options.reduce((s, o) => s + (o.stock || 0), 0), 0);
    }

    get hasVariants(): boolean { return this.model.variants.length > 0; }
}
