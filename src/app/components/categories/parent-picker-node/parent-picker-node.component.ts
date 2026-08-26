import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-parent-picker-node',
    templateUrl: './parent-picker-node.component.html',
    styleUrl: './parent-picker-node.component.scss'
})
export class ParentPickerNodeComponent {
    @Input() node: any;
    @Input() depth: number = 0;
    @Input() selectedId: number | null = null;

    @Output() onSelect = new EventEmitter<any>();

    toggle(e: Event) {
        e.stopPropagation();
        this.node.expanded = !this.node.expanded;
    }

    select() { this.onSelect.emit(this.node); }
    bubble(node: any) { this.onSelect.emit(node); }

    get isSelected(): boolean { return this.selectedId === this.node.id; }
    get hasChildren(): boolean { return this.node.children?.length > 0; }
}
