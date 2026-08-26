import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { CategoriesService } from './categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUpdateCategoriesComponent } from './add-update-categories/add-update-categories.component';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

    allCategories: any[] = [];
    treeData: any[] = [];
    filteredTree: any[] = [];

    searchTxt: string = '';
    isLoaded: boolean = false;
    isTechnicalIssue: boolean = false;

    // Stats
    totalCount: number = 0;
    rootCount: number = 0;
    activeCount: number = 0;

    constructor(
        public sharedservice: SharedService,
        private categoriesService: CategoriesService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.loadTree();
    }

    loadTree() {
        this.isLoaded = false;
        this.categoriesService.getAll().subscribe(
            (res: any) => {
                this.allCategories = res.data || [];
                this.treeData = this.buildTree(this.allCategories, null);
                this.filteredTree = this.treeData;
                this.calcStats();
                this.isLoaded = true;
            },
            () => {
                this.isTechnicalIssue = true;
                this.isLoaded = true;
                this.sharedservice.showAlert(2, 'Technical Issue Found!');
            }
        );
    }

    buildTree(flat: any[], parentId: number | null): any[] {
        return flat
            .filter(c => (c.parentId ?? null) === parentId)
            .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
            .map(c => ({ ...c, children: this.buildTree(flat, c.id), expanded: true }));
    }

    calcStats() {
        this.totalCount = this.allCategories.length;
        this.rootCount = this.allCategories.filter(c => !c.parentId).length;
        this.activeCount = this.allCategories.filter(c => c.isActive).length;
    }

    // ── Search: filter tree by name, keep parents visible ──────────────────
    onSearch() {
        const q = this.searchTxt.trim().toLowerCase();
        if (!q) {
            this.filteredTree = this.treeData;
            return;
        }
        this.filteredTree = this.filterTree(this.treeData, q);
    }

    filterTree(nodes: any[], q: string): any[] {
        const result: any[] = [];
        for (const node of nodes) {
            const match = node.name.toLowerCase().includes(q);
            const filteredChildren = this.filterTree(node.children || [], q);
            if (match || filteredChildren.length > 0) {
                result.push({ ...node, children: filteredChildren, expanded: true });
            }
        }
        return result;
    }

    clearSearch() {
        this.searchTxt = '';
        this.filteredTree = this.treeData;
    }

    // ── Expand / Collapse all ───────────────────────────────────────────────
    expandAll() { this.setExpanded(this.filteredTree, true); }
    collapseAll() { this.setExpanded(this.filteredTree, false); }

    setExpanded(nodes: any[], val: boolean) {
        for (const n of nodes) {
            n.expanded = val;
            if (n.children?.length) this.setExpanded(n.children, val);
        }
    }

    // ── CRUD ────────────────────────────────────────────────────────────────
    addUpdateData(isEdit: boolean, data?: any, parentId?: number | null) {
        const modalRef = this.modalService.open(AddUpdateCategoriesComponent, {
            size: 'xl', backdrop: 'static', centered: true
        });
        modalRef.componentInstance.isEdit = isEdit;
        if (data) modalRef.componentInstance.data = data;
        if (parentId !== undefined) modalRef.componentInstance.presetParentId = parentId;

        modalRef.result.then(result => {
            if (result) this.loadTree();
        }).catch(() => { });
    }

    deleteData(id: number) {
        const modalRef = this.modalService.open(DeleteConfirmationComponent, {
            size: 'md', centered: true
        });
        modalRef.result.then(result => {
            if (result) {
                this.categoriesService.delete(id).subscribe(
                    () => {
                        this.sharedservice.showAlert(1, 'Deleted Successfully');
                        this.loadTree();
                    },
                    () => this.sharedservice.showAlert(2, 'Something Went Wrong')
                );
            }
        }).catch(() => { });
    }

    updateStatus(newStatus: boolean, id: number) {
        this.categoriesService.updateStatus(id, { isActive: newStatus }).subscribe(
            () => {
                this.sharedservice.showAlert(1, 'Status Updated');
                this.loadTree();
            },
            () => this.sharedservice.showAlert(2, 'Something Went Wrong')
        );
    }
}
