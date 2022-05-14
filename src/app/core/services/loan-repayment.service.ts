import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './appconfig.service';
import { Observable } from 'rxjs';
import { GenericApiResponse } from '../models/payloads/generic-response';

@Injectable({
    providedIn: 'root'
})
export class LoanRepaymentService {
    apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(settings: AppConfigService, private httpClient: HttpClient) {
        this.apiBaseUrl = settings.LoanRepaymentURL;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });

    }
    sendOTPToCustomer(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/request-manager/SendOTP`, payload);
    }

    loanRepaymentDetails(cifId: string): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/request-manager/LoanRepaymentDetails`, { cifId });
    }
    validateOTP(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/request-manager/ValidateOTP`, payload);
    }
    submitRequest(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/request-manager/InitiateRequest`, payload);
    }
    validateAccountNoAndPhoneNo(payload): any {
        return this.httpClient.post(`${this.apiBaseUrl}/request-manager/ValidateAccountNoAndPhone`, payload);
    }
}
