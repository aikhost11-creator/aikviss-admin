import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { SpinnerService } from '../components/spinner/spinner.service';

// URLs that should NOT trigger the global spinner
const SILENT_URLS = [
    'siteconfig/getSiteconfig',
    'dashboard/superAdminDashboard',
    'file/getFoldersByPath',
    'file/getFilesByPath',
];

@Injectable()
export class Interceptor implements HttpInterceptor {

    // Counter — spinner shows when > 0, hides when back to 0
    private activeRequests = 0;

    constructor(
        private router: Router,
        public sharedService: SharedService,
        private spinnerService: SpinnerService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Attach auth token
        const rawToken = localStorage.getItem('admin_token');
        if (rawToken) {
            const token = atob(rawToken).replace(/"/g, '');
            request = request.clone({ setHeaders: { Authorization: token } });
        }

        const isSilent = SILENT_URLS.some(u => request.url.includes(u));

        if (!isSilent) {
            this.activeRequests++;
            this.spinnerService.isSpinnerShow = true;
        }

        return next.handle(request).pipe(
            tap({
                error: (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.sharedService.showAlert(2, 'Session expired. Please login again.');
                        localStorage.clear();
                        if (this.router.url !== '/login') {
                            this.router.navigate(['/login']);
                        }
                    }
                }
            }),
            finalize(() => {
                if (!isSilent) {
                    this.activeRequests = Math.max(0, this.activeRequests - 1);
                    if (this.activeRequests === 0) {
                        this.spinnerService.isSpinnerShow = false;
                    }
                }
            })
        );
    }
}
