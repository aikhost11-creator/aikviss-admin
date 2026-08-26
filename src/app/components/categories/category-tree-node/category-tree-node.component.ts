import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-category-tree-node',
    templateUrl: './category-tree-node.component.html',
    styleUrl: './category-tree-node.component.scss'
})
export class CategoryTreeNodeComponent {
    @Input() node: any;
    @Input() depth: number = 0;
    @Input() isLast: boolean = false;

    @Output() onEdit = new EventEmitter<any>();
    @Output() onAddSub = new EventEmitter<number>();
    @Output() onDelete = new EventEmitter<number>();
    @Output() onToggleStatus = new EventEmitter<{ id: number; status: boolean }>();

    toggle() { this.node.expanded = !this.node.expanded; }

    emitEdit()   { this.onEdit.emit(this.node); }
    emitAddSub() { this.onAddSub.emit(this.node.id); }
    emitDelete() { this.onDelete.emit(this.node.id); }
    emitToggle() { this.onToggleStatus.emit({ id: this.node.id, status: !this.node.isActive }); }

    bubbleEdit(data: any)                          { this.onEdit.emit(data); }
    bubbleAddSub(id: number)                       { this.onAddSub.emit(id); }
    bubbleDelete(id: number)                       { this.onDelete.emit(id); }
    bubbleToggle(e: { id: number; status: boolean }) { this.onToggleStatus.emit(e); }

    get hasChildren(): boolean { return this.node.children?.length > 0; }
    get isRoot(): boolean { return this.depth === 0; }

    // Depth-based accent color class
    get depthClass(): string {
        const classes = ['depth-0', 'depth-1', 'depth-2', 'depth-3', 'depth-4'];
        return classes[Math.min(this.depth, classes.length - 1)];
    }
}
