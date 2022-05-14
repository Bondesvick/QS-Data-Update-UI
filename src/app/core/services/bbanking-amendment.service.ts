import { Injectable } from '@angular/core';
import { AppConfigService } from './appconfig.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBOnboardingResponse } from '../models/payloads/otp-response';
import { IBOnboardingGenericResponse } from '../models/payloads/generic-response';

@Injectable({
    providedIn: 'root'
})
export class BusinessBankingAmendmentService {
    apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(settings: AppConfigService, private httpClient: HttpClient) {
        this.apiBaseUrl = settings.BusBankingAmendmentURL;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'xvbTHDUUJILMxsqwoppdjjxZSxQpvk' });

    }
    validateAccountNoAndPhoneNo(payload): any {

        return this.httpClient.post(`${this.apiBaseUrl}/RequestInitiation/ValidateAccountNoAndPhone`, payload);
    }
    validateCache(payload): any {
        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
        };

        return this.httpClient.post(`${this.apiBaseUrl}/RequestInitiation/validate-capcha`, payload);
    }
    initiateRequest(payload): Observable<IBOnboardingGenericResponse> {
        return this.httpClient.post<IBOnboardingGenericResponse>(`${this.apiBaseUrl}/RequestInitiation/InitiateRequest`,
            payload);
    }
}
