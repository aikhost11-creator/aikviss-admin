import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { urlConstant } from '../../shared/constant/urlConst';

@Component({
    selector: 'app-payment-settings',
    standalone: false,
    templateUrl: './payment-settings.component.html',
    styleUrls: ['./payment-settings.component.scss']
})
export class PaymentSettingsComponent implements OnInit {

    isLoading = false;
    isSaving  = false;
    showRzpSecret   = false;
    showPhonePeSalt = false;
    showPhonePeApi  = false;

    settings = {
        razorpayKeyId: '', razorpayKeySecret: '',
        isTestMode: true, isActive: false,
        phonepeMerchantId: '', phonepeApiKey: '',
        phonepeSaltIndex: '1', phonepeSaltKey: '',
        phonepeMerchantUserId: '', phonepeIsActive: false,
        codIsActive: false
    };

    constructor(public sharedService: SharedService, private http: HttpClient) {}

    ngOnInit() { this.loadSettings(); }

    loadSettings() {
        this.isLoading = true;
        this.http.get<any>(urlConstant.PaymentSettingsAPI.getAdmin).subscribe({
            next: res => {
                if (res.data) {
                    const d = res.data;
                    this.settings.razorpayKeyId       = d.razorpayKeyId || '';
                    this.settings.razorpayKeySecret    = d.razorpayKeySecret || '';
                    this.settings.isTestMode           = !!d.isTestMode;
                    this.settings.isActive             = !!d.isActive;
                    this.settings.phonepeMerchantId    = d.phonepeMerchantId || '';
                    this.settings.phonepeApiKey        = d.phonepeApiKey || '';
                    this.settings.phonepeSaltIndex     = d.phonepeSaltIndex || '1';
                    this.settings.phonepeSaltKey       = d.phonepeSaltKey || '';
                    this.settings.phonepeMerchantUserId = d.phonepeMerchantUserId || '';
                    this.settings.phonepeIsActive      = !!d.phonepeIsActive;
                    this.settings.codIsActive          = !!d.codIsActive;
                }
                this.isLoading = false;
            },
            error: () => { this.isLoading = false; }
        });
    }

    saveSettings() {
        this.isSaving = true;
        this.http.post<any>(urlConstant.PaymentSettingsAPI.update, this.settings).subscribe({
            next: () => { this.isSaving = false; this.sharedService.showAlert(1, 'Settings saved'); },
            error: () => { this.isSaving = false; this.sharedService.showAlert(2, 'Failed to save'); }
        });
    }
}
