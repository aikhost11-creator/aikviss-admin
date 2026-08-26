import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { urlConstant } from '../../shared/constant/urlConst';

@Component({
    selector: 'app-legal-pages',
    standalone: false,
    templateUrl: './legal-pages.component.html',
    styleUrls: ['./legal-pages.component.scss']
})
export class LegalPagesComponent implements OnInit {

    pages = [
        { slug: 'shipping-policy',  title: 'Shipping Policy',       content: '', saving: false },
        { slug: 'return-refund',    title: 'Return & Refund Policy', content: '', saving: false },
        { slug: 'privacy-policy',   title: 'Privacy Policy',         content: '', saving: false },
        { slug: 'terms-conditions', title: 'Terms & Conditions',     content: '', saving: false },
    ];

    isLoading = false;
    activeSlug = 'shipping-policy';

    editorConfig: any = {
        placeholder: 'Write content here...',
        buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color',
                  'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent',
                  'orderedList', 'unorderedList', 'link', 'undo', 'redo']
    };

    constructor(public sharedService: SharedService, private http: HttpClient) {}

    ngOnInit() { this.loadAll(); }

    loadAll() {
        this.isLoading = true;
        this.http.get<any>(urlConstant.LegalPagesAPI.getAll).subscribe({
            next: res => {
                (res.data || []).forEach((p: any) => {
                    const local = this.pages.find(lp => lp.slug === p.slug);
                    if (local) { local.title = p.title; local.content = p.content || ''; }
                });
                this.isLoading = false;
            },
            error: () => { this.isLoading = false; }
        });
    }

    get activePage() { return this.pages.find(p => p.slug === this.activeSlug)!; }

    save(page: any) {
        page.saving = true;
        this.http.post<any>(urlConstant.LegalPagesAPI.upsert, {
            slug: page.slug, title: page.title, content: page.content
        }).subscribe({
            next: () => { page.saving = false; this.sharedService.showAlert(1, `${page.title} saved`); },
            error: () => { page.saving = false; this.sharedService.showAlert(2, 'Something went wrong'); }
        });
    }
}
