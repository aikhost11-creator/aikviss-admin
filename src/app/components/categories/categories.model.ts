export class CategoryReqModel {
    name: string = '';
    image: string = '';
    parentId: number | null = null;
    sortOrder: number = 0;
    isActive: boolean = true;
}
