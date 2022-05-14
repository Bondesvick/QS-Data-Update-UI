import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './appconfig.service';
import { Observable } from 'rxjs';
import { GenericApiResponse } from '../models/payloads/generic-response';

@Injectable({
    providedIn: 'root'
})
export class LoanInitiationService {
    apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(settings: AppConfigService, private httpClient: HttpClient) {
        this.apiBaseUrl = settings.LoanInitiationURL;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });

    }
    sendOTPToCustomer(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/send-otp`, payload);
    }

    loadPlppTypes(): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/plpp-types`, {});
    }
    loanProductDocs(): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/loan-product-docs`, {});
    }
    validateOTP(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/validate-otp`, payload);
    }
    submitRequest(payload):Observable<GenericApiResponse>{
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/loan-initiation`, payload);

    }
}
