export class ProductReqModel {
    name: string = '';
    slug: string = '';
    sku: string = '';
    description: string = '';
    shortDescription: string = '';
    resultTag: string = '';
    badge: string = '';
    price: number = 0;
    salePrice: number | null = null;
    categoryId: number | null = null;
    images: string[] = [];
    variants: ProductVariant[] = [];
    tags: string[] = [];
    benefits: string[] = [];
    whyLoveIt: WhyLoveItem[] = [];
    keyIngredients: KeyIngredient[] = [];
    howToUse: string = '';
    additionalDetails: string = '';
    consumerCareDetails: string = '';
    faqs: FaqItem[] = [];
    promoImage: string = '';
    promoReel: string = '';
    galleryMedia: GalleryMedia[] = [];
    sizeGuideImage: string = '';
    isActive: boolean = true;
    isFeatured: boolean = false;
    sortOrder: number = 0;
}

export class ProductVariant {
    name: string = '';
    options: VariantOption[] = [];
}

export class VariantOption {
    label: string = '';
    value: string = '';
    stock: number = 0;
    sku: string = '';
}

export class WhyLoveItem {
    title: string = '';
    description: string = '';
}

export class KeyIngredient {
    name: string = '';
    description: string = '';
    image: string = '';
}

export class FaqItem {
    question: string = '';
    answer: string = '';
}

export class GalleryMedia {
    type: 'image' | 'video' = 'image';
    url: string = '';
    thumbnail: string = '';
}
