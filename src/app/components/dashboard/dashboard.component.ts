import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: false,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    shortcuts = [
        { title: 'Orders', desc: 'View & manage orders', icon: 'bag-shopping', url: '/orders' },
        { title: 'Products', desc: 'Catalog & inventory', icon: 'box', url: '/products' },
        { title: 'Categories', desc: 'Organize catalog', icon: 'folder-tree', url: '/categories' },
        { title: 'Unsync Orders', desc: 'Fix shipping sync', icon: 'truck-fast', url: '/unsync-orders' },
        { title: 'Site Config', desc: 'Branding & store info', icon: 'gears', url: '/site-configuration' },
        { title: 'Payments', desc: 'Razorpay / PhonePe', icon: 'credit-card', url: '/payment-settings' },
    ];

    constructor(private router: Router) {}

    go(url: string) {
        this.router.navigate([url]);
    }
}
